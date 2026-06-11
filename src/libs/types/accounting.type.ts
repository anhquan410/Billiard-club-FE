export type TransactionType = "INCOME" | "EXPENSE";

export type TransactionCategory =
  | "TABLE_REVENUE"
  | "PRODUCT_SALES"
  | "IMPORT_COST"
  | "SALARY"
  | "UTILITIES"
  | "MAINTENANCE"
  | "OTHER";

export type DebtType = "RECEIVABLE" | "PAYABLE";

export type DebtStatus = "PENDING" | "PARTIAL" | "PAID" | "OVERDUE";

export type AccountingSummary = {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  cashBalance: number;
  receivableTotal: number;
  payableTotal: number;
  transactionCount: number;
};

export type AccountingTransaction = {
  id: string;
  code: string;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  amount: number;
  paymentMethod: string;
  createdAt: string;
  createdBy: string;
};

export type DebtRecord = {
  id: string;
  type: DebtType;
  partnerName: string;
  phone?: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  dueDate: string;
  status: DebtStatus;
  note?: string;
};

export type AccountingDashboardData = {
  fromDate: string;
  toDate: string;
  summary: AccountingSummary;
  transactions: AccountingTransaction[];
  debts: DebtRecord[];
};
