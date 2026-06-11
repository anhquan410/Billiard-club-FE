import agent from "./agent";
import type {
  BookingDashboardData,
  BookingStatus,
  TableBooking,
} from "../types/booking.type";

export type BookingQueryParams = {
  date?: string;
  status?: BookingStatus;
  search?: string;
};

export type CreateBookingPayload = {
  customerName: string;
  customerPhone: string;
  tableId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  depositAmount?: number;
  note?: string;
};

export async function getBookingDashboard(params: BookingQueryParams = {}) {
  const searchParams = new URLSearchParams();
  if (params.date) searchParams.set("date", params.date);
  if (params.status) searchParams.set("status", params.status);
  if (params.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  const response = await agent.get<BookingDashboardData>(
    `/bookings/dashboard${query ? `?${query}` : ""}`,
  );
  return response.data;
}

export async function createBooking(payload: CreateBookingPayload) {
  const response = await agent.post<TableBooking>("/bookings", payload);
  return response.data;
}

export async function confirmBooking(id: string) {
  const response = await agent.patch<TableBooking>(`/bookings/${id}/confirm`);
  return response.data;
}

export async function cancelBooking(id: string) {
  const response = await agent.patch<TableBooking>(`/bookings/${id}/cancel`);
  return response.data;
}

export type CustomerBookingData = {
  bookings: TableBooking[];
  availableTables: { id: string; tableName: string; hourlyRate: number }[];
};

export type CustomerCreateBookingPayload = {
  tableId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  note?: string;
};

export async function getMyBookings() {
  const response = await agent.get<CustomerBookingData>("/bookings/my");
  return response.data;
}

export async function createCustomerBooking(
  payload: CustomerCreateBookingPayload,
) {
  const response = await agent.post<TableBooking>("/bookings/my", payload);
  return response.data;
}
