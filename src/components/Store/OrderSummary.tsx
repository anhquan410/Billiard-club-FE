import { Box, Typography } from "@mui/material";

interface OrderSummaryProps {
  total: number;
}

export default function OrderSummary({ total }: OrderSummaryProps) {
  return (
    <Box sx={{ mt: "auto", pt: 2, borderTop: "2px solid #e0e0e0" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography>Thành tiền</Typography>
        <Typography fontWeight="bold">
          {total.toLocaleString("vi-VN")}₫
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography>Tổng thanh tiền</Typography>
        <Typography fontWeight="bold">
          {total.toLocaleString("vi-VN")}₫
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography>Tổng giảm giá</Typography>
        <Typography>- 0₫</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Tổng thanh toán</Typography>
        <Typography variant="h5" color="primary" fontWeight="bold">
          {total.toLocaleString("vi-VN")}₫
        </Typography>
      </Box>
    </Box>
  );
}
