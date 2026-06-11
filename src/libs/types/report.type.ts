export type ReportPeriod = "TODAY" | "WEEK" | "MONTH" | "QUARTER" | "YEAR";

export type PaymentMethod =
  | "CASH"
  | "BANK_TRANSFER"
  | "MOMO"
  | "VNPAY"
  | "OTHER";

export type ReportSummary = {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  tableSessions: number;
  tableRevenue: number;
  productRevenue: number;
  totalCost: number;
  grossProfit: number;
  revenueGrowthPercent: number;
  orderGrowthPercent: number;
};

export type RevenueByDay = {
  date: string;
  tableRevenue: number;
  productRevenue: number;
  total: number;
};

export type RevenueByPaymentMethod = {
  method: PaymentMethod;
  label: string;
  amount: number;
  orderCount: number;
  percent: number;
};

export type TopProductReport = {
  productId: string;
  productName: string;
  category: string;
  quantitySold: number;
  revenue: number;
  cost: number;
  profit: number;
};

export type TableUsageReport = {
  tableId: string;
  tableName: string;
  sessionCount: number;
  totalHours: number;
  tableFeeRevenue: number;
  productRevenue: number;
  totalRevenue: number;
  totalRevenueAfterDiscount: number;
};

export type InventoryMovementSummary = {
  totalImportValue: number;
  totalExportValue: number;
  importReceiptCount: number;
  exportReceiptCount: number;
  lowStockProductCount: number;
  outOfStockProductCount: number;
};

export type LowStockProduct = {
  productId: string;
  productName: string;
  currentStock: number;
  minStock: number;
  unit: string;
};

export type ReportQueryParams = {
  fromDate: string;
  toDate: string;
  period?: ReportPeriod;
  staffId?: string;
  tableId?: string;
  paymentMethod?: PaymentMethod;
  category?: string;
  limit?: number;
};

export type ReportDashboardData = {
  period: ReportPeriod;
  periodLabel: string;
  fromDate: string;
  toDate: string;
  summary: ReportSummary;
  revenueByDay: RevenueByDay[];
  revenueByPaymentMethod: RevenueByPaymentMethod[];
  topProducts: TopProductReport[];
  tableUsage: TableUsageReport[];
  inventorySummary: InventoryMovementSummary;
  lowStockProducts: LowStockProduct[];
};
