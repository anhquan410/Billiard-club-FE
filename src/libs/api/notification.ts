import agent from "./agent";

export type AppNotification = {
  id: string;
  userId: string;
  message: string;
  type: "USER" | "STAFF" | "ADMIN" | "CASHIER";
  isRead: boolean;
  createdAt: string;
  eventType?: string;
  bookingId?: string;
  tableId?: string;
};

export async function getNotifications(limit = 30) {
  const response = await agent.get<AppNotification[]>(
    `/notification?limit=${limit}`,
  );
  return response.data;
}

export async function getUnreadNotificationCount() {
  const response = await agent.get<number>("/notification/unread-count");
  return response.data;
}

export async function markNotificationAsRead(id: string) {
  const response = await agent.patch(`/notification/${id}/read`);
  return response.data;
}

export async function markAllNotificationsAsRead() {
  const response = await agent.patch("/notification/read-all");
  return response.data;
}
