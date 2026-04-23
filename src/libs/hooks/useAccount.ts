import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import type { User } from "../types";
import { useNavigate } from "react-router-dom";

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
      // Lưu access_token vào localStorage
      if (response.data?.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
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
    onSuccess: async () => {
      localStorage.removeItem("access_token");
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
    // enabled: !!queryClient.getQueryData(["user"]),
  });

  return { loginUser, registerUser, logoutUser, user, isLoadingUser };
};
