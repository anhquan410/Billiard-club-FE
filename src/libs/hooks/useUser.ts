import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllUser } from "../api/user";
import {
  deleteUserById as deleteUserByIdApi,
  createUser as createUserApi,
} from "../api/user";

export const USERS_QUERY_KEY = {
  all: ["users", "all"],
} as const;

export const useUser = () => {
  const queryClient = useQueryClient();

  const { data: users } = useQuery({
    queryKey: USERS_QUERY_KEY.all,
    queryFn: getAllUser,
  });

  const { mutate: createUser, isPending: isCreating } = useMutation({
    mutationFn: (data: {
      fullName: string;
      email: string;
      phone?: string;
      role: string;
      password: string;
    }) => {
      return createUserApi(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY.all });
    },
  });

  const { mutate: deleteUserById, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteUserByIdApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY.all });
    },
  });

  return { users, createUser, isCreating, deleteUserById, isDeleting };
};
