import { Box, LinearProgress, Paper, Typography } from "@mui/material";
import type { RevenueByPaymentMethod } from "../../../libs/types/report.type";
import { formatCurrency } from "../../../libs/utils/format";

type PaymentMethodChartProps = {
  data: RevenueByPaymentMethod[];
};

const methodColors: Record<string, string> = {
  CASH: "#4caf50",
  BANK_TRANSFER: "#1976d2",
  MOMO: "#e91e63",
  VNPAY: "#1565c0",
  OTHER: "#9e9e9e",
};

export default function PaymentMethodChart({ data }: PaymentMethodChartProps) {
  return (
    <Paper sx={{ p: 2.5, height: "100%" }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Doanh thu theo hình thức thanh toán
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
        {data.map((item) => (
          <Box key={item.method}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 0.5,
              }}
            >
              <Typography variant="body2" fontWeight={500}>
                {item.label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.percent}% · {item.orderCount} đơn
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={item.percent}
              sx={{
                height: 10,
                borderRadius: 1,
                bgcolor: "#f0f0f0",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 1,
                  bgcolor: methodColors[item.method] || "#607d8b",
                },
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {formatCurrency(item.amount)}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
