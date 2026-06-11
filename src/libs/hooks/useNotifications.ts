import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { io, type Socket } from "socket.io-client";
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type AppNotification,
} from "../api/notification";
import { getWebSocketUrl } from "../utils/wsUrl";
import { BOOKING_QUERY_KEY } from "./useBooking";
import { TABLES_QUERY_KEY } from "./useTable";
import { useSnackbar } from "../context/SnackbarContext";

export const NOTIFICATION_QUERY_KEY = {
  all: ["notifications"] as const,
  list: () => [...NOTIFICATION_QUERY_KEY.all, "list"] as const,
  unread: () => [...NOTIFICATION_QUERY_KEY.all, "unread"] as const,
};

const BOOKING_EVENTS = new Set([
  "BOOKING_CREATED",
  "BOOKING_SUBMITTED",
  "BOOKING_RECORDED",
  "BOOKING_CONFIRMED",
  "BOOKING_CANCELLED",
  "BOOKING_NO_SHOW",
  "BOOKING_CHECK_IN",
]);

const TABLE_EVENTS = new Set(["TABLE_PAYMENT", "TABLE_STARTED"]);

export function useNotifications() {
  const queryClient = useQueryClient();
  const { showSuccess } = useSnackbar();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: NOTIFICATION_QUERY_KEY.list(),
    queryFn: () => getNotifications(30),
    enabled: !!localStorage.getItem("access_token"),
  });

  const { data: unreadCount = 0 } = useQuery({
    queryKey: NOTIFICATION_QUERY_KEY.unread(),
    queryFn: getUnreadNotificationCount,
    enabled: !!localStorage.getItem("access_token"),
    refetchInterval: 60_000,
  });

  const markReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEY.all });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEY.all });
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const socket: Socket = io(getWebSocketUrl(), {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    const handleNotification = (
      payload: AppNotification & { eventType?: string },
    ) => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEY.all });

      if (payload.eventType && BOOKING_EVENTS.has(payload.eventType)) {
        queryClient.invalidateQueries({ queryKey: BOOKING_QUERY_KEY.all });
      }

      if (payload.eventType && TABLE_EVENTS.has(payload.eventType)) {
        queryClient.invalidateQueries({ queryKey: TABLES_QUERY_KEY.all });
      }

      showSuccess(payload.message);
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
      socket.disconnect();
    };
  }, [queryClient, showSuccess]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead: markReadMutation.mutate,
    markAllAsRead: markAllReadMutation.mutate,
    isMarkingRead: markReadMutation.isPending,
    isMarkingAllRead: markAllReadMutation.isPending,
  };
}
