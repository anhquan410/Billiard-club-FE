import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import type { User } from "../types";
import { useNavigate } from "react-router-dom";
import {
  clearAuthTokens,
  hasAccessToken,
  setAuthTokens,
} from "../utils/authTokens";

export const ACCOUNT_QUERY_KEY = {
  all: ["account"],
  user: () => [...ACCOUNT_QUERY_KEY.all],
} as const;

export const useAccount = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const loginUser = useMutation({
    mutationFn: async (credentials: {
      emailOrPhone: string;
      password: string;
    }) => {
      const response = await agent.post("auth/login", credentials);
      if (response.data?.access_token) {
        setAuthTokens(response.data.access_token, response.data.refresh_token);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEY.user() });
    },
  });

  const registerUser = useMutation({
    mutationFn: async (credentials: {
      email: string;
      password: string;
      fullName: string;
    }) => {
      const response = await agent.post("/user", credentials);
      return response.data;
    },
  });

  const logoutUser = useMutation({
    mutationFn: async () => {
      const response = await agent.post("/auth/logout");
      return response.data;
    },
    onSettled: () => {
      clearAuthTokens();
      queryClient.removeQueries({ queryKey: ACCOUNT_QUERY_KEY.user() });
      navigate("/");
    },
  });

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ACCOUNT_QUERY_KEY.user(),
    queryFn: async () => {
      const response = await agent.get<User>("/auth/profile");
      return response.data;
    },
    enabled: hasAccessToken(),
  });

  return { loginUser, registerUser, logoutUser, user, isLoadingUser };
};
