import { Box, Paper, Typography } from "@mui/material";
import type { RevenueByDay } from "../../../libs/types/report.type";
import { formatCurrency } from "../../../libs/utils/format";

type RevenueChartProps = {
  data: RevenueByDay[];
};

export default function RevenueChart({ data }: RevenueChartProps) {
  const maxTotal = Math.max(...data.map((d) => d.total));

  return (
    <Paper sx={{ p: 2.5, height: "100%" }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Doanh thu theo ngày
      </Typography>
      <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, height: 220, mt: 2 }}>
        {data.map((item) => {
          const heightPercent = maxTotal > 0 ? (item.total / maxTotal) * 100 : 0;
          const tablePercent =
            item.total > 0 ? (item.tableRevenue / item.total) * 100 : 0;

          return (
            <Box
              key={item.date}
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>
                {(item.total / 1_000_000).toFixed(1)}tr
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 48,
                  height: `${heightPercent}%`,
                  minHeight: 4,
                  borderRadius: "4px 4px 0 0",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    flex: tablePercent,
                    bgcolor: "#3f51b5",
                  }}
                />
                <Box
                  sx={{
                    flex: 100 - tablePercent,
                    bgcolor: "#f06292",
                  }}
                />
              </Box>
              <Typography variant="caption">{item.date}</Typography>
            </Box>
          );
        })}
      </Box>
      <Box sx={{ display: "flex", gap: 3, mt: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 12, height: 12, bgcolor: "#3f51b5", borderRadius: 0.5 }} />
          <Typography variant="caption">Tiền bàn</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 12, height: 12, bgcolor: "#f06292", borderRadius: 0.5 }} />
          <Typography variant="caption">Sản phẩm</Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
          Cao nhất: {formatCurrency(maxTotal)}
        </Typography>
      </Box>
    </Paper>
  );
}
