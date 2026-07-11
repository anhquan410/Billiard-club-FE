import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getStockItemsPagination,
  createImportStockMovement as createImportStockMovementApi,
} from "../api/receipt";
import type { StockMovement } from "../types/warehouse.type";
import { PRODUCTS_QUERY_KEY } from "./useProduct";

export const RECEIPT_QUERY_KEY = {
  all: ["stock-movements", "all"],
  pagination: (page?: number, limit?: number, type?: string, search?: string) =>
    [...RECEIPT_QUERY_KEY.all, page, limit, type, search] as const,
} as const;

export const useReceiptPagination = (
  page: number = 1,
  limit: number = 10,
  type?: string,
  search?: string,
) => {
  const { data: paginatedStockMovements, isLoading: isLoadingStockMovements } =
    useQuery({
      queryKey: [...RECEIPT_QUERY_KEY.pagination(page, limit, type, search)],
      queryFn: () => getStockItemsPagination(page, limit, type, search),
    });

  return { paginatedStockMovements, isLoadingStockMovements };
};

export const useReceipt = () => {
  const queryClient = useQueryClient();

  // create import stock movement
  const {
    mutate: createImportStockMovement,
    isPending: isCreatingImportStockMovement,
  } = useMutation({
    mutationFn: async ({
      data,
      staffId,
    }: {
      data: StockMovement;
      staffId: string;
    }) => {
      return createImportStockMovementApi(data, staffId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: RECEIPT_QUERY_KEY.all,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: PRODUCTS_QUERY_KEY.all,
        refetchType: "all",
      });
    },
  });
  return { createImportStockMovement, isCreatingImportStockMovement };
};
