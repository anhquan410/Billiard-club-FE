import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminSaveSchedule,
  approveSchedule,
  getMySchedule,
  getPendingSchedules,
  getRegistrationWindow,
  getScheduleOverview,
  rejectApprovedSchedule,
  rejectSchedule,
  saveMySchedule,
  submitMySchedule,
} from "../api/schedule";
import type {
  AdminSaveSchedulePayload,
  SaveSchedulePayload,
} from "../types/schedule.type";

export const SCHEDULE_QUERY_KEY = {
  all: ["work-schedule"] as const,
  window: () => [...SCHEDULE_QUERY_KEY.all, "window"] as const,
  my: (weekStart: string) =>
    [...SCHEDULE_QUERY_KEY.all, "my", weekStart] as const,
  pending: () => [...SCHEDULE_QUERY_KEY.all, "pending"] as const,
  overview: (weekStart: string) =>
    [...SCHEDULE_QUERY_KEY.all, "overview", weekStart] as const,
};

export function useRegistrationWindow() {
  return useQuery({
    queryKey: SCHEDULE_QUERY_KEY.window(),
    queryFn: getRegistrationWindow,
  });
}

export function useMySchedule(weekStart: string, enabled = true) {
  return useQuery({
    queryKey: SCHEDULE_QUERY_KEY.my(weekStart),
    queryFn: () => getMySchedule(weekStart),
    enabled: enabled && !!weekStart,
    retry: false,
  });
}

export function usePendingSchedules(enabled = true) {
  return useQuery({
    queryKey: SCHEDULE_QUERY_KEY.pending(),
    queryFn: getPendingSchedules,
    enabled,
  });
}

export function useScheduleOverview(weekStart: string, enabled = true) {
  return useQuery({
    queryKey: SCHEDULE_QUERY_KEY.overview(weekStart),
    queryFn: () => getScheduleOverview(weekStart),
    enabled: enabled && !!weekStart,
  });
}

export function useSaveMySchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SaveSchedulePayload) => saveMySchedule(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_QUERY_KEY.all });
    },
  });
}

export function useSubmitMySchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (weekStart: string) => submitMySchedule(weekStart),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_QUERY_KEY.all });
    },
  });
}

export function useAdminSaveSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: string;
      payload: AdminSaveSchedulePayload;
    }) => adminSaveSchedule(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_QUERY_KEY.all });
    },
  });
}

export function useApproveSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (weekId: string) => approveSchedule(weekId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_QUERY_KEY.all });
    },
  });
}

export function useRejectSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      weekId,
      rejectReason,
      approved,
    }: {
      weekId: string;
      rejectReason: string;
      approved?: boolean;
    }) =>
      approved
        ? rejectApprovedSchedule(weekId, rejectReason)
        : rejectSchedule(weekId, rejectReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_QUERY_KEY.all });
    },
  });
}
