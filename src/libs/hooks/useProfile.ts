/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile } from "../api/profile";
import { ACCOUNT_QUERY_KEY } from "./useAccount";
import { useMemo } from "react";
import type { Profile, User } from "../types";
import { updateProfile as updateProfileApi } from "../api/profile";
import { USERS_QUERY_KEY } from "./useUser";

const PROFILE_QUERY_KEY = {
  all: ["profiles"],
  profile: (id?: string) => [...PROFILE_QUERY_KEY.all, id],
};

export const useProfile = (id?: string) => {
  const queryClient = useQueryClient();

  const user = queryClient.getQueryData<User>(ACCOUNT_QUERY_KEY.user());

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: PROFILE_QUERY_KEY.profile(id as string),
    queryFn: () => getProfile(id as string),
    enabled: !!id,
  });

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: ({ id, profile }: { id: string; profile: Profile }) =>
      updateProfileApi(id, profile),
    onSuccess: (_, _variables) => {
      queryClient.invalidateQueries({
        queryKey: PROFILE_QUERY_KEY.profile(id as string),
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: USERS_QUERY_KEY.all,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ACCOUNT_QUERY_KEY.user(),
        refetchType: "all",
      });
    },
  });

  const isCurrentUser = useMemo(() => {
    if (!user || !profile) return false;
    return user?.id === profile?.id;
  }, [user, profile]);

  return {
    profile,
    isLoadingProfile,
    updateProfile,
    isUpdatingProfile,
    isCurrentUser,
  };
};
