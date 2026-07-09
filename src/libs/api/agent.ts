import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
} from "../utils/authTokens";

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const agent = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

const AUTH_SKIP_REFRESH_PATHS = ["/auth/login", "/auth/refresh-token"];

function shouldSkipRefresh(url?: string) {
  if (!url) return false;
  return AUTH_SKIP_REFRESH_PATHS.some((path) => url.includes(path));
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token");
  }

  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
    { refresh_token: refreshToken },
  );

  const newAccessToken = response.data?.access_token;
  const newRefreshToken = response.data?.refresh_token;

  if (!newAccessToken) {
    throw new Error("Refresh token response missing access_token");
  }

  setAuthTokens(newAccessToken, newRefreshToken);
  return newAccessToken;
}

function redirectToLogin() {
  clearAuthTokens();
  if (window.location.pathname !== "/auth/login") {
    window.location.href = "/auth/login";
  }
}

agent.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

agent.interceptors.response.use(
  async (response) => {
    await sleep(1000);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      shouldSkipRefresh(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    if (!getRefreshToken()) {
      redirectToLogin();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshAccessToken().finally(() => {
          isRefreshing = false;
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return agent(originalRequest);
    } catch (refreshError) {
      redirectToLogin();
      return Promise.reject(refreshError);
    }
  },
);

export default agent;
