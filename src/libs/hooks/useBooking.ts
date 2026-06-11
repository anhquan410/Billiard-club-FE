import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelBooking,
  confirmBooking,
  createBooking,
  createCustomerBooking,
  getBookingDashboard,
  getMyBookings,
  type BookingQueryParams,
  type CreateBookingPayload,
  type CustomerCreateBookingPayload,
} from "../api/booking";

export const BOOKING_QUERY_KEY = {
  all: ["bookings"] as const,
  dashboard: (params: BookingQueryParams) =>
    [...BOOKING_QUERY_KEY.all, "dashboard", params] as const,
  my: () => [...BOOKING_QUERY_KEY.all, "my"] as const,
};

export const useBookingDashboard = (params: BookingQueryParams) => {
  return useQuery({
    queryKey: BOOKING_QUERY_KEY.dashboard(params),
    queryFn: () => getBookingDashboard(params),
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => createBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKING_QUERY_KEY.all });
    },
  });
};

export const useConfirmBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => confirmBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKING_QUERY_KEY.all });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKING_QUERY_KEY.all });
    },
  });
};

export const useMyBookings = () => {
  return useQuery({
    queryKey: BOOKING_QUERY_KEY.my(),
    queryFn: getMyBookings,
  });
};

export const useCreateCustomerBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CustomerCreateBookingPayload) =>
      createCustomerBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKING_QUERY_KEY.all });
    },
  });
};
