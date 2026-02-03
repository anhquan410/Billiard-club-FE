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
} from "../api/table";

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
    refetchOnMount: "always", // Luôn refetch khi mount lại
    refetchOnWindowFocus: true, // Refetch khi focus lại window
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
      staffId,
      note,
    }: {
      tableId: string;
      staffId: string;
      note?: string;
    }) => startTableSessionApi(tableId, staffId, note),
    onSuccess: (_data, _variables) => {
      // Invalidate queries or update cache as needed
      queryClient.invalidateQueries({
        queryKey: TABLES_QUERY_KEY.all,
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
      onSuccess: () => {
        // Invalidate session query để refetch services
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
      };
    }) => endTableSessionApi(tableId, paymentData),
    onSuccess: () => {
      // Invalidate tất cả queries liên quan
      queryClient.invalidateQueries({
        queryKey: TABLES_QUERY_KEY.all,
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
    endTableSession,
    endTableSessionAsync,
    isEndingTableSession,
  };
};
