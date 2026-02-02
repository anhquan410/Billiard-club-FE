import { Box, Typography, Paper } from "@mui/material";

export default function TasksPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        🎧 Công việc
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="body1">
          Trang Công việc đang được phát triển...
        </Typography>
      </Paper>
    </Box>
  );
}
