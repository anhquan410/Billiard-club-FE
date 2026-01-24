import axios from "axios";

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

const agent = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Thêm interceptor để tự động gửi access_token nếu có
agent.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

agent.interceptors.response.use(
  async (response) => {
    await sleep(1000);
    return response;
  },
  async (error) => {
    // Nếu lỗi 401 Unauthorized (access token hết hạn)
    // if (error.response?.status === 401) {
    //   try {
    //     // Gọi API refresh để xin access token mới
    //     const res = await axios.post(
    //       `${import.meta.env.VITE_API_URL}/auth/refresh`,
    //       {}, // hoặc truyền thêm dữ liệu nếu backend yêu cầu
    //       { withCredentials: true },
    //     );
    //     const newToken = res.data.access_token;
    //     // Lưu token mới vào localStorage
    //     localStorage.setItem("access_token", newToken);

    //     // Đặt lại header và retry request với access token mới
    //     error.config.headers["Authorization"] = `Bearer ${newToken}`;
    //     return agent(error.config);
    //   } catch (refreshError) {
    //     // Nếu refresh cũng lỗi (refresh token hết hạn/hết phiên)
    //     localStorage.removeItem("access_token");
    //     // Đẩy user về trang login (xóa state, reset app)
    //     window.location.href = "/auth/login";
    //     return Promise.reject(refreshError);
    //   }
    // }
    return Promise.reject(error);
  },
);

export default agent;
