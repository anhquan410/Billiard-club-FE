import agent from "./agent";
import type {
  AccountingDashboardData,
  AccountingTransaction,
  DebtRecord,
  TransactionType,
} from "../types/accounting.type";

export type AccountingQueryParams = {
  fromDate: string;
  toDate: string;
  type?: TransactionType;
};

export type CreateTransactionPayload = {
  type: TransactionType;
  category: AccountingTransaction["category"];
  description: string;
  amount: number;
  paymentMethod: "CASH" | "BANK_TRANSFER" | "MOMO" | "VNPAY" | "OTHER";
};

export async function getAccountingDashboard(params: AccountingQueryParams) {
  const searchParams = new URLSearchParams();
  searchParams.set("fromDate", params.fromDate);
  searchParams.set("toDate", params.toDate);
  if (params.type) searchParams.set("type", params.type);

  const response = await agent.get<AccountingDashboardData>(
    `/accounting/dashboard?${searchParams.toString()}`,
  );
  return response.data;
}

export async function createAccountingTransaction(
  payload: CreateTransactionPayload,
) {
  const response = await agent.post<AccountingTransaction>(
    "/accounting/transactions",
    payload,
  );
  return response.data;
}

export async function createDebt(payload: Omit<DebtRecord, "id" | "remainingAmount" | "status"> & { paidAmount?: number }) {
  const response = await agent.post<DebtRecord>("/accounting/debts", payload);
  return response.data;
}
