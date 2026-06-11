import agent from "./agent";

export type PlaySessionHistory = {
  id: string;
  orderNumber: string;
  paidAt: string;
  tableName: string;
  durationMins: number;
  tablePrice: number;
  servicesTotal: number;
  total: number;
  paymentMethod: string;
  serviceCount: number;
};

export type BookingHistory = {
  id: string;
  bookingCode: string;
  tableName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: string;
  guestCount: number;
};

export type CustomerPlayHistory = {
  playSessions: PlaySessionHistory[];
  bookings: BookingHistory[];
};

export async function getMyPlayHistory() {
  const response = await agent.get<CustomerPlayHistory>("/orders/my-history");
  return response.data;
}
