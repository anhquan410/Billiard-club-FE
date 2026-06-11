import {
  Card,
  CardContent,
  Typography,
  Box,
  Switch,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import type { TableData, tableStatus } from "../../libs/types/store.type";

interface TableCardProps {
  table: TableData;
  onOpenOrder: (table: TableData) => void;
}

export default function TableCard({ table, onOpenOrder }: TableCardProps) {
  const statusColor: Record<tableStatus, string> = {
    AVAILABLE: "#4caf50",
    OCCUPIED: "#eb1a1a",
    RESERVED: "#616161",
  };

  const customerLabel =
    table.status === "AVAILABLE"
      ? null
      : table.customerName || "Khách vãng lai";

  return (
    <Card
      sx={{
        bgcolor: statusColor[table.status],
        color: "white",
        position: "relative",
        minHeight: 200,
      }}
    >
      <CardContent sx={{ pb: 2 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
          {table.tableName}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.9, fontSize: "15px", fontWeight: "bold" }}>
          {table.status === "AVAILABLE"
            ? "Trống"
            : table.status === "OCCUPIED"
              ? "Đang sử dụng"
              : "Bàn đặt"}
        </Typography>
        {table.status === "AVAILABLE" && table.upcomingBooking && (
          <Typography variant="caption" sx={{ display: "block", mt: 0.5, opacity: 0.95 }}>
            Đặt {table.upcomingBooking.startTime}–{table.upcomingBooking.endTime}
          </Typography>
        )}
        <Box sx={{ mt: 2, fontSize: "13px" }}>
          {customerLabel && (
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              KH: {customerLabel}
            </Typography>
          )}
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            Tổng tiền:{" "}
            {table.estimatedTotal != null
              ? table.estimatedTotal.toLocaleString("vi-VN")
              : "—"}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 1,
              mt: 0.5,
            }}
          >
            <Typography variant="body2">Đèn: </Typography>
            <Switch
              size="small"
              checked={table.status !== "AVAILABLE"}
              sx={{
                "& .MuiSwitch-switchBase": {
                  color: "white",
                },
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "white",
                },
                "& .MuiSwitch-track": {
                  bgcolor: "rgba(255, 255, 255, 0.5)",
                },
              }}
            />
          </Box>
        </Box>
        <IconButton
          onClick={() => onOpenOrder(table)}
          sx={{
            position: "absolute",
            bottom: 8,
            right: 8,
            bgcolor: "rgba(255, 255, 255, 0.3)",
            color: "white",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.5)",
            },
          }}
        >
          {table.status === "OCCUPIED" ? (
            <EditIcon />
          ) : table.status === "RESERVED" ? (
            <AddIcon titleAccess="Check-in đặt bàn" />
          ) : (
            <AddIcon />
          )}
        </IconButton>
      </CardContent>
    </Card>
  );
}
