import agent from "./agent";
import type {
  CreatePayrollAdjustmentPayload,
  PayrollAdminSummary,
  PayrollAdjustment,
  PayrollSettings,
  PayrollSummary,
} from "../types/payroll.type";

export async function getPayrollSettings() {
  const response = await agent.get<PayrollSettings>("/payroll/settings");
  return response.data;
}

export async function updatePayrollSettings(
  payload: Omit<PayrollSettings, "id" | "updatedAt">,
) {
  const response = await agent.put<PayrollSettings>("/payroll/settings", payload);
  return response.data;
}

export async function getMyPayroll(month: string) {
  const response = await agent.get<PayrollSummary>(`/payroll/my?month=${month}`);
  return response.data;
}

export async function getAdminPayrollSummary(month: string) {
  const response = await agent.get<PayrollAdminSummary>(
    `/payroll/admin/summary?month=${month}`,
  );
  return response.data;
}

export async function getUserPayroll(userId: string, month: string) {
  const response = await agent.get<PayrollSummary>(
    `/payroll/admin/users/${userId}?month=${month}`,
  );
  return response.data;
}

export async function createPayrollAdjustment(
  payload: CreatePayrollAdjustmentPayload,
) {
  const response = await agent.post<PayrollAdjustment>(
    "/payroll/admin/adjustments",
    payload,
  );
  return response.data;
}

export async function getPayrollAdjustments(month: string, userId?: string) {
  const params = new URLSearchParams({ month });
  if (userId) params.set("userId", userId);
  const response = await agent.get<PayrollAdjustment[]>(
    `/payroll/adjustments?${params}`,
  );
  return response.data;
}
