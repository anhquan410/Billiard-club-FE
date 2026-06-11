export type tableStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED";

export type UpcomingBooking = {
  id: string;
  customerName: string;
  startTime: string;
  endTime: string;
};

export type TableData = {
  id: string;
  tableNumber: string;
  tableName: string;
  hourlyRate: number;
  status: tableStatus;
  description?: string;
  customerName?: string;
  estimatedTotal?: number;
  upcomingBooking?: UpcomingBooking;
};

export type Order = {
  id: string;
  customerName: string;
  table: string;
  date: string;
  beforeDiscount: number;
  total: number;
  cost: number;
  profit: number;
  debt: number;
  deposit: number;
  bankTransfer: number;
  status: string;
};

export type SessionService = {
  productId: string;
  sessionId: string;
  price: number;
  quantity: number;
  subtotal: number;
};
