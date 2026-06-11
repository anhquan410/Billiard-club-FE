import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adjustBonusPoints,
  getBonusHistory,
  getBonusProfile,
  getBonusSettings,
  updateBonusSettings,
  type BonusSettings,
} from "../api/bonus";
import { USERS_QUERY_KEY } from "./useUser";

export const BONUS_QUERY_KEY = {
  profile: (userId: string) => ["bonus", "profile", userId] as const,
  history: (userId: string) => ["bonus", "history", userId] as const,
  settings: ["bonus", "settings"] as const,
  systemInfo: ["bonus", "system-info"] as const,
};

export function useBonusProfile(userId?: string) {
  return useQuery({
    queryKey: BONUS_QUERY_KEY.profile(userId ?? ""),
    queryFn: () => getBonusProfile(userId!),
    enabled: !!userId,
  });
}

export function useBonusHistory(userId?: string, limit = 50) {
  return useQuery({
    queryKey: BONUS_QUERY_KEY.history(userId ?? ""),
    queryFn: () => getBonusHistory(userId!, limit),
    enabled: !!userId,
  });
}

export function useBonusSettings() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: BONUS_QUERY_KEY.settings,
    queryFn: getBonusSettings,
  });

  const mutation = useMutation({
    mutationFn: (data: Omit<BonusSettings, "id" | "updatedAt">) =>
      updateBonusSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BONUS_QUERY_KEY.settings });
      queryClient.invalidateQueries({ queryKey: BONUS_QUERY_KEY.systemInfo });
    },
  });

  return { ...query, updateSettings: mutation.mutate, isSaving: mutation.isPending };
}

export function useAdjustBonusPoints() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adjustBonusPoints,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: BONUS_QUERY_KEY.profile(variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: BONUS_QUERY_KEY.history(variables.userId),
      });
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY.all });
    },
  });
}
