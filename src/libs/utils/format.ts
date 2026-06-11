export const formatCurrency = (value: number) =>
  `${value.toLocaleString("vi-VN")} ₫`;

export const formatPercent = (value: number) =>
  `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
