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

  const sessionQueryKey = [...TABLES_QUERY_KEY.table(tableId), "session"];

  const refreshStoreTableList = () => {
    queryClient.invalidateQueries({
      queryKey: TABLES_QUERY_KEY.all,
      exact: true,
      refetchType: "active",
    });
  };

  const patchSessionServices = (
    old: any,
    updater: (services: any[]) => any[],
  ) => {
    if (!old?.session?.services) return old;

    const services = updater(old.session.services);
    const servicesTotal =
      Math.round(
        services.reduce((sum: number, s: any) => sum + Number(s.subtotal), 0) *
          100,
      ) / 100;
    const currentTablePrice = Number(old.currentTablePrice || 0);

    return {
      ...old,
      servicesTotal,
      estimatedTotal:
        Math.round((currentTablePrice + servicesTotal) * 100) / 100,
      session: {
        ...old.session,
        services,
      },
    };
  };

  const matchesServiceProduct = (service: any, productId: string) =>
    service.productId === productId || service.product?.id === productId;

  const { data: sessionData, isLoading: isLoadingSession } = useQuery({
    queryKey: sessionQueryKey,
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
      onMutate: async ({ productId, quantity }) => {
        await queryClient.cancelQueries({ queryKey: sessionQueryKey });
        const previousData = queryClient.getQueryData<any>(sessionQueryKey);

        const products =
          queryClient.getQueryData<any[]>(PRODUCTS_QUERY_KEY.all) ?? [];
        const product = products.find((p) => p.id === productId);
        const unitPrice = product ? Number(product.price) : 0;

        queryClient.setQueryData<any>(sessionQueryKey, (old: any) => {
          if (!old?.session) return old;

          const services = old.session.services || [];
          const existing = services.find((s: any) =>
            matchesServiceProduct(s, productId),
          );

          if (existing) {
            const nextQty = existing.quantity + quantity;
            return patchSessionServices(old, (svcs) =>
              svcs.map((s: any) =>
                matchesServiceProduct(s, productId)
                  ? {
                      ...s,
                      quantity: nextQty,
                      subtotal: Number(s.price) * nextQty,
                    }
                  : s,
              ),
            );
          }

          const newService = {
            id: `temp-${productId}`,
            productId,
            product: product
              ? {
                  id: product.id,
                  name: product.name,
                  unit: product.unit ?? "",
                }
              : { id: productId, name: "Đang tải...", unit: "" },
            price: unitPrice,
            quantity,
            subtotal: unitPrice * quantity,
            elapsed: "",
          };

          return patchSessionServices(old, (svcs) => [...svcs, newService]);
        });

        return { previousData };
      },
      onError: (_err, _variables, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(sessionQueryKey, context.previousData);
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: sessionQueryKey });
      },
      onSettled: () => {
        refreshStoreTableList();
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
    onMutate: async ({ serviceId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: sessionQueryKey });
      const previousData = queryClient.getQueryData<any>(sessionQueryKey);

      queryClient.setQueryData<any>(sessionQueryKey, (old: any) =>
        patchSessionServices(old, (services) => {
          if (quantity <= 0) {
            return services.filter((s: any) => s.id !== serviceId);
          }
          return services.map((s: any) =>
            s.id === serviceId
              ? {
                  ...s,
                  quantity,
                  subtotal: Number(s.price) * quantity,
                }
              : s,
          );
        }),
      );

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(sessionQueryKey, context.previousData);
      }
    },
    onSettled: () => {
      refreshStoreTableList();
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
    onMutate: async ({ serviceId }) => {
      await queryClient.cancelQueries({ queryKey: sessionQueryKey });
      const previousData = queryClient.getQueryData<any>(sessionQueryKey);

      queryClient.setQueryData<any>(sessionQueryKey, (old: any) =>
        patchSessionServices(old, (services) =>
          services.filter((s: any) => s.id !== serviceId),
        ),
      );

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(sessionQueryKey, context.previousData);
      }
    },
    onSettled: () => {
      refreshStoreTableList();
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
