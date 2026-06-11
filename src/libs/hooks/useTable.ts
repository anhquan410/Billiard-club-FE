/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllTables,
  getTableById,
  getTableSession,
  startTableSession as startTableSessionApi,
  endTableSession as endTableSessionApi,
  addServiceToTable as addServiceToTableApi,
  removeServiceFromTable as removeServiceFromTableApi,
  updateServiceQuantity as updateServiceQuantityApi,
  assignCustomerToSession as assignCustomerToSessionApi,
} from "../api/table";
import { PRODUCTS_QUERY_KEY } from "./useProduct";
import { RECEIPT_QUERY_KEY } from "./useReceipt";
import { BOOKING_QUERY_KEY } from "./useBooking";

export const TABLES_QUERY_KEY = {
  all: ["tables"],
  table: (id?: string) => [...TABLES_QUERY_KEY.all, id],
  session: (tableId?: string, sessionId?: string) => [
    ...TABLES_QUERY_KEY.table(tableId),
    "session",
    sessionId,
  ],
} as const;

export const useTable = (id?: string) => {
  const queryClient = useQueryClient();

  // Get all tables
  const { data: tables, isLoading: isLoadingTables } = useQuery({
    queryKey: TABLES_QUERY_KEY.all,
    queryFn: getAllTables,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: 30_000, // Cập nhật tổng tiền tạm tính theo thời gian chơi
  });

  // Get table by ID
  const { data: table, isLoading: isLoadingTable } = useQuery({
    queryKey: TABLES_QUERY_KEY.table(id as string),
    queryFn: () => getTableById(id as string),
    enabled: !!id,
  });

  // Start table session mutation
  const {
    mutate: startTableSession,
    mutateAsync: startTableSessionAsync,
    isPending: isStartingTableSession,
  } = useMutation({
    mutationFn: ({
      tableId,
      note,
      bookingId,
    }: {
      tableId: string;
      note?: string;
      bookingId?: string;
    }) => startTableSessionApi(tableId, { note, bookingId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TABLES_QUERY_KEY.all,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: BOOKING_QUERY_KEY.all,
        refetchType: "all",
      });
    },
  });

  return {
    tables,
    table,
    isLoadingTables,
    isLoadingTable,
    startTableSession,
    startTableSessionAsync,
    isStartingTableSession,
  };
};

export const useTableSession = (tableId: string) => {
  const queryClient = useQueryClient();

  const { data: sessionData, isLoading: isLoadingSession } = useQuery({
    queryKey: [...TABLES_QUERY_KEY.table(tableId), "session"],
    queryFn: () => getTableSession(tableId),
    enabled: !!tableId && tableId !== "", // Chỉ fetch khi có tableId hợp lệ
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    staleTime: 0,
  });

  const { mutate: addServiceToTable, isPending: isAddingServiceToTable } =
    useMutation({
      mutationFn: ({
        sessionId,
        productId,
        quantity,
      }: {
        sessionId: string;
        productId: string;
        quantity: number;
      }) => addServiceToTableApi(sessionId, productId, quantity),
      // Optimistic update
      onMutate: async ({ sessionId, productId, quantity }) => {
        await queryClient.cancelQueries({
          queryKey: [...TABLES_QUERY_KEY.table(tableId), "session"],
        });
        const previousData = queryClient.getQueryData<any>([
          ...TABLES_QUERY_KEY.table(tableId),
          "session",
        ]);

        // Tạo service mới tạm thời
        const newService = {
          id: Math.random().toString(36).substring(2), // id tạm
          product: previousData?.products?.find(
            (p: any) => p.id === productId,
          ) || { id: productId, name: "Đang tải...", unit: "", price: 0 },
          price:
            previousData?.products?.find((p: any) => p.id === productId)
              ?.price || 0,
          quantity,
          subtotal:
            (previousData?.products?.find((p: any) => p.id === productId)
              ?.price || 0) * quantity,
          elapsed: "",
        };

        // Cập nhật optimistic
        queryClient.setQueryData<any>(
          [...TABLES_QUERY_KEY.table(tableId), "session"],
          (old: any) => {
            if (!old) return old;
            return {
              ...old,
              session: {
                ...old.session,
                services: [...(old.session?.services || []), newService],
              },
            };
          },
        );
        return { previousData };
      },
      onError: (_err, _variables, context) => {
        // Quay lại dữ liệu cũ nếu lỗi
        if (context?.previousData) {
          queryClient.setQueryData(
            [...TABLES_QUERY_KEY.table(tableId), "session"],
            context.previousData,
          );
        }
      },
      onSettled: () => {
        // Luôn refetch lại dữ liệu thật
        queryClient.invalidateQueries({
          queryKey: TABLES_QUERY_KEY.all,
          refetchType: "all",
        });
      },
    });

  const {
    mutate: updateServiceQuantity,
    isPending: isUpdatingServiceQuantity,
  } = useMutation({
    mutationFn: ({
      sessionId,
      serviceId,
      quantity,
    }: {
      sessionId: string;
      serviceId: string;
      quantity: number;
    }) => updateServiceQuantityApi(sessionId, serviceId, quantity),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: TABLES_QUERY_KEY.all,
        refetchType: "all",
      });
    },
  });

  const {
    mutate: removeServiceFromTable,
    isPending: isRemovingServiceFromTable,
  } = useMutation({
    mutationFn: ({
      sessionId,
      serviceId,
    }: {
      sessionId: string;
      serviceId: string;
    }) => {
      return removeServiceFromTableApi(sessionId, serviceId);
    },
    onSuccess: () => {
      // Invalidate session query để refetch services
      queryClient.invalidateQueries({
        queryKey: TABLES_QUERY_KEY.all,
        refetchType: "all",
      });
    },
  });

  const {
    mutate: assignCustomer,
    isPending: isAssigningCustomer,
  } = useMutation({
    mutationFn: ({
      tableId,
      sessionId,
      customerId,
    }: {
      tableId: string;
      sessionId: string;
      customerId: string | null;
    }) => assignCustomerToSessionApi(tableId, sessionId, customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...TABLES_QUERY_KEY.table(tableId), "session"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: TABLES_QUERY_KEY.all,
        refetchType: "all",
      });
    },
  });

  const {
    mutate: endTableSession,
    mutateAsync: endTableSessionAsync,
    isPending: isEndingTableSession,
  } = useMutation({
    mutationFn: ({
      tableId,
      paymentData,
    }: {
      tableId: string;
      paymentData: {
        paymentMethod: "CASH" | "BANK_TRANSFER" | "MOMO" | "VNPAY" | "OTHER";
        discount?: number;
        note?: string;
        customerId?: string;
        bonusPointsToUse?: number;
        useTierDiscount?: boolean;
      };
    }) => endTableSessionApi(tableId, paymentData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TABLES_QUERY_KEY.all,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: BOOKING_QUERY_KEY.all,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: PRODUCTS_QUERY_KEY.all,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: RECEIPT_QUERY_KEY.all,
        refetchType: "all",
      });
    },
  });

  return {
    sessionData,
    isLoadingSession,
    addServiceToTable,
    isAddingServiceToTable,
    removeServiceFromTable,
    isRemovingServiceFromTable,
    updateServiceQuantity,
    isUpdatingServiceQuantity,
    assignCustomer,
    isAssigningCustomer,
    endTableSession,
    endTableSessionAsync,
    isEndingTableSession,
  };
};
