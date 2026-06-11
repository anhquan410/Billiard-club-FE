import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAccountingTransaction,
  getAccountingDashboard,
  type AccountingQueryParams,
  type CreateTransactionPayload,
} from "../api/accounting";

export const ACCOUNTING_QUERY_KEY = {
  all: ["accounting"] as const,
  dashboard: (params: AccountingQueryParams) =>
    [...ACCOUNTING_QUERY_KEY.all, "dashboard", params] as const,
};

export const useAccountingDashboard = (params: AccountingQueryParams) => {
  return useQuery({
    queryKey: ACCOUNTING_QUERY_KEY.dashboard(params),
    queryFn: () => getAccountingDashboard(params),
  });
};

export const useCreateAccountingTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTransactionPayload) =>
      createAccountingTransaction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTING_QUERY_KEY.all });
    },
  });
};
