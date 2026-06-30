import { Box, Paper, Typography } from "@mui/material";
import type { RevenueByDay } from "../../../libs/types/report.type";
import { formatCurrency } from "../../../libs/utils/format";

const CHART_HEIGHT = 180;
const BAR_MIN_WIDTH = 30;

type RevenueChartProps = {
  data: RevenueByDay[];
};

function formatAxisLabel(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}tr`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}k`;
  }
  return value.toString();
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const maxTotal = Math.max(...data.map((d) => d.total), 0);

  return (
    <Paper sx={{ p: 2.5, height: "100%" }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Doanh thu theo ngày
      </Typography>
      <Box
        sx={{
          overflowX: "auto",
          width: "100%",
          mt: 2,
          // Giữ nhãn ngày ở 2 đầu không bị cắt khi cuộn hết
          scrollPaddingInline: 8,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            gap: 1,
            height: CHART_HEIGHT + 48,
            minWidth: "100%",
            px: 1,
          }}
        >
        {data.map((item) => {
          const barHeight =
            maxTotal > 0
              ? Math.max(4, Math.round((item.total / maxTotal) * CHART_HEIGHT))
              : 0;
          const tableHeight =
            item.total > 0
              ? Math.round((item.tableRevenue / item.total) * barHeight)
              : 0;
          const productHeight = Math.max(0, barHeight - tableHeight);

          return (
            <Box
              key={item.date}
              sx={{
                flex: `1 0 ${BAR_MIN_WIDTH}px`,
                minWidth: BAR_MIN_WIDTH,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                height: "100%",
                gap: 0.5,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: 10, minHeight: 14 }}
              >
                {item.total > 0 ? formatAxisLabel(item.total) : "0"}
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 48,
                  height: barHeight,
                  borderRadius: "4px 4px 0 0",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  bgcolor: item.total > 0 ? "transparent" : "#f5f5f5",
                }}
              >
                {tableHeight > 0 && (
                  <Box sx={{ height: tableHeight, bgcolor: "#3f51b5" }} />
                )}
                {productHeight > 0 && (
                  <Box sx={{ height: productHeight, bgcolor: "#f06292" }} />
                )}
              </Box>
              <Typography
                variant="caption"
                sx={{ whiteSpace: "nowrap", fontSize: 11, lineHeight: 1.2 }}
              >
                {item.date}
              </Typography>
            </Box>
          );
        })}
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 3, mt: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{ width: 12, height: 12, bgcolor: "#3f51b5", borderRadius: 0.5 }}
          />
          <Typography variant="caption">Tiền bàn</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{ width: 12, height: 12, bgcolor: "#f06292", borderRadius: 0.5 }}
          />
          <Typography variant="caption">Sản phẩm</Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
          Cao nhất: {formatCurrency(maxTotal)}
        </Typography>
      </Box>
    </Paper>
  );
}
