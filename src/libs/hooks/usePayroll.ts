import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPayrollAdjustment,
  deletePayrollAdjustment,
  getAdminPayrollSummary,
  getMyPayroll,
  getPayrollAdjustments,
  getPayrollSettings,
  getUserPayroll,
  updatePayrollAdjustment,
  updatePayrollSettings,
} from "../api/payroll";
import type {
  CreatePayrollAdjustmentPayload,
  UpdatePayrollAdjustmentPayload,
} from "../types/payroll.type";

export const PAYROLL_QUERY_KEY = {
  all: ["payroll"] as const,
  settings: () => [...PAYROLL_QUERY_KEY.all, "settings"] as const,
  my: (month: string) => [...PAYROLL_QUERY_KEY.all, "my", month] as const,
  adminSummary: (month: string) =>
    [...PAYROLL_QUERY_KEY.all, "admin-summary", month] as const,
  user: (userId: string, month: string) =>
    [...PAYROLL_QUERY_KEY.all, "user", userId, month] as const,
  adjustments: (month: string, userId?: string) =>
    [...PAYROLL_QUERY_KEY.all, "adjustments", month, userId ?? "all"] as const,
};

export function usePayrollSettings() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: PAYROLL_QUERY_KEY.settings(),
    queryFn: getPayrollSettings,
  });

  const mutation = useMutation({
    mutationFn: updatePayrollSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYROLL_QUERY_KEY.all });
    },
  });

  return {
    ...query,
    updateSettings: mutation.mutateAsync,
    isSaving: mutation.isPending,
  };
}

export function useMyPayroll(month: string) {
  return useQuery({
    queryKey: PAYROLL_QUERY_KEY.my(month),
    queryFn: () => getMyPayroll(month),
    enabled: !!month,
  });
}

export function useAdminPayrollSummary(month: string, enabled = true) {
  return useQuery({
    queryKey: PAYROLL_QUERY_KEY.adminSummary(month),
    queryFn: () => getAdminPayrollSummary(month),
    enabled: enabled && !!month,
  });
}

export function useUserPayroll(userId: string, month: string, enabled = true) {
  return useQuery({
    queryKey: PAYROLL_QUERY_KEY.user(userId, month),
    queryFn: () => getUserPayroll(userId, month),
    enabled: enabled && !!userId && !!month,
  });
}

export function useCreatePayrollAdjustment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePayrollAdjustmentPayload) =>
      createPayrollAdjustment(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: PAYROLL_QUERY_KEY.adminSummary(variables.month),
      });
      queryClient.invalidateQueries({
        queryKey: PAYROLL_QUERY_KEY.adjustments(variables.month),
      });
    },
  });
}

export function useUpdatePayrollAdjustment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
      month,
    }: {
      id: string;
      payload: UpdatePayrollAdjustmentPayload;
      month: string;
    }) => updatePayrollAdjustment(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: PAYROLL_QUERY_KEY.adminSummary(variables.month),
      });
      queryClient.invalidateQueries({
        queryKey: PAYROLL_QUERY_KEY.adjustments(variables.month),
      });
    },
  });
}

export function useDeletePayrollAdjustment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, month }: { id: string; month: string }) =>
      deletePayrollAdjustment(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: PAYROLL_QUERY_KEY.adminSummary(variables.month),
      });
      queryClient.invalidateQueries({
        queryKey: PAYROLL_QUERY_KEY.adjustments(variables.month),
      });
    },
  });
}

export function usePayrollAdjustments(month: string, userId?: string) {
  return useQuery({
    queryKey: PAYROLL_QUERY_KEY.adjustments(month, userId),
    queryFn: () => getPayrollAdjustments(month, userId),
    enabled: !!month,
  });
}
