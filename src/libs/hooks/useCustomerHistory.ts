import { useQuery } from "@tanstack/react-query";
import { getMyPlayHistory } from "../api/history";

export const HISTORY_QUERY_KEY = {
  all: ["customer-history"],
} as const;

export function useCustomerHistory() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: HISTORY_QUERY_KEY.all,
    queryFn: getMyPlayHistory,
  });

  return {
    history: data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  };
}
