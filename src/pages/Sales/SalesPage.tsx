import { Box, Typography, Paper } from "@mui/material";

export default function SalesPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        🎧 Sales
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="body1">
          Trang Sales đang được phát triển...
        </Typography>
      </Paper>
    </Box>
  );
}
