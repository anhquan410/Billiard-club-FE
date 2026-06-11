import type { ReportPeriod } from "../types/report.type";

const toISODate = (date: Date) => date.toISOString().slice(0, 10);

export const getDateRangeForPeriod = (
  period: ReportPeriod,
  referenceDate = new Date(),
): { fromDate: string; toDate: string } => {
  const toDate = toISODate(referenceDate);
  const from = new Date(referenceDate);

  switch (period) {
    case "TODAY":
      break;
    case "WEEK":
      from.setDate(from.getDate() - 6);
      break;
    case "MONTH":
      from.setDate(1);
      break;
    case "QUARTER": {
      const quarterStartMonth = Math.floor(from.getMonth() / 3) * 3;
      from.setMonth(quarterStartMonth, 1);
      break;
    }
    case "YEAR":
      from.setMonth(0, 1);
      break;
  }

  return { fromDate: toISODate(from), toDate };
};
