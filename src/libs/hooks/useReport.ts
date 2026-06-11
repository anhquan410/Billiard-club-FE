import { useMutation, useQuery } from "@tanstack/react-query";
import { exportReport, getReportDashboard } from "../api/report";
import type { ReportQueryParams } from "../types/report.type";

export const REPORT_QUERY_KEY = {
  all: ["reports"] as const,
  dashboard: (params: ReportQueryParams) =>
    [...REPORT_QUERY_KEY.all, "dashboard", params] as const,
};

export const useReportDashboard = (params: ReportQueryParams) => {
  return useQuery({
    queryKey: REPORT_QUERY_KEY.dashboard(params),
    queryFn: () => getReportDashboard(params),
  });
};

export const useExportReport = () => {
  return useMutation({
    mutationFn: (params: ReportQueryParams) => exportReport(params),
  });
};
