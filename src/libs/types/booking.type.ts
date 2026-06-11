export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "NO_SHOW";

export type TableBooking = {
  id: string;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  tableId: string;
  tableName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  depositAmount: number;
  note?: string;
  status: BookingStatus;
  createdAt: string;
  confirmedBy?: string;
  canCancel?: boolean;
};

export type BookingSummary = {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  todayBookings: number;
};

export type BookingDashboardData = {
  date: string;
  summary: BookingSummary;
  bookings: TableBooking[];
  availableTables: { id: string; tableName: string; hourlyRate: number }[];
};
