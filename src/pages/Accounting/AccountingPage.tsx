import { Box, Typography, Paper } from "@mui/material";

export default function AccountingPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        🎧 Kế toán
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="body1">
          Trang Kế toán đang được phát triển...
        </Typography>
      </Paper>
    </Box>
  );
}
