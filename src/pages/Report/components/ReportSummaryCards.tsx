import { Box, Grid, Paper, Typography } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import type { ReportSummary } from "../../../libs/types/report.type";
import { formatCurrency, formatPercent } from "../../../libs/utils/format";

type ReportSummaryCardsProps = {
  summary: ReportSummary;
};

type SummaryCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  growth?: number;
  color: string;
};

function SummaryCard({ title, value, subtitle, growth, color }: SummaryCardProps) {
  const isPositive = growth !== undefined && growth >= 0;

  return (
    <Paper
      sx={{
        p: 2.5,
        height: "100%",
        borderTop: `4px solid ${color}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      )}
      {growth !== undefined && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}>
          {isPositive ? (
            <TrendingUpIcon sx={{ fontSize: 16, color: "success.main" }} />
          ) : (
            <TrendingDownIcon sx={{ fontSize: 16, color: "error.main" }} />
          )}
          <Typography
            variant="caption"
            fontWeight={600}
            color={isPositive ? "success.main" : "error.main"}
          >
            {formatPercent(growth)} so với kỳ trước
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

export default function ReportSummaryCards({ summary }: ReportSummaryCardsProps) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <SummaryCard
          title="Tổng doanh thu"
          value={formatCurrency(summary.totalRevenue)}
          growth={summary.revenueGrowthPercent}
          color="#1976d2"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <SummaryCard
          title="Số hóa đơn"
          value={summary.totalOrders.toLocaleString("vi-VN")}
          growth={summary.orderGrowthPercent}
          color="#f06292"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <SummaryCard
          title="Giá trị TB / hóa đơn"
          value={formatCurrency(summary.avgOrderValue)}
          subtitle={`${summary.tableSessions} phiên chơi bàn`}
          color="#4caf50"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <SummaryCard
          title="Lợi nhuận gộp"
          value={formatCurrency(summary.grossProfit)}
          subtitle={`Chi phí: ${formatCurrency(summary.totalCost)}`}
          color="#ff9800"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SummaryCard
          title="Doanh thu tiền bàn"
          value={formatCurrency(summary.tableRevenue)}
          subtitle={`${((summary.tableRevenue / summary.totalRevenue) * 100).toFixed(1)}% tổng doanh thu`}
          color="#3f51b5"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SummaryCard
          title="Doanh thu sản phẩm"
          value={formatCurrency(summary.productRevenue)}
          subtitle={`${((summary.productRevenue / summary.totalRevenue) * 100).toFixed(1)}% tổng doanh thu`}
          color="#9c27b0"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SummaryCard
          title="Tỷ suất lợi nhuận"
          value={`${((summary.grossProfit / summary.totalRevenue) * 100).toFixed(1)}%`}
          subtitle="Lợi nhuận gộp / doanh thu"
          color="#607d8b"
        />
      </Grid>
    </Grid>
  );
}
