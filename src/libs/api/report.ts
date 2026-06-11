import agent from "./agent";
import type {
  ReportDashboardData,
  ReportQueryParams,
} from "../types/report.type";

export async function getReportDashboard(params: ReportQueryParams) {
  const searchParams = new URLSearchParams();

  searchParams.set("fromDate", params.fromDate);
  searchParams.set("toDate", params.toDate);

  if (params.period) searchParams.set("period", params.period);
  if (params.staffId) searchParams.set("staffId", params.staffId);
  if (params.tableId) searchParams.set("tableId", params.tableId);
  if (params.paymentMethod)
    searchParams.set("paymentMethod", params.paymentMethod);
  if (params.category) searchParams.set("category", params.category);
  if (params.limit) searchParams.set("limit", params.limit.toString());

  const response = await agent.get<ReportDashboardData>(
    `/reports/dashboard?${searchParams.toString()}`,
  );
  return response.data;
}

export async function exportReport(params: ReportQueryParams) {
  const searchParams = new URLSearchParams();

  searchParams.set("fromDate", params.fromDate);
  searchParams.set("toDate", params.toDate);
  if (params.period) searchParams.set("period", params.period);

  const response = await agent.get(`/reports/export?${searchParams.toString()}`, {
    responseType: "blob",
  });
  return response.data;
}
