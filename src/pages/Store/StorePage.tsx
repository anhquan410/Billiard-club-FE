/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  IconButton,
  Paper,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import type { TableData } from "../../libs/types/store.type";
import TableCard from "../../components/Store/Tablecard";
import { useTable } from "../../libs/hooks/useTable";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAccount } from "../../libs/hooks/useAccount";
import { getTableSession } from "../../libs/api/table";
import { getConfirmedBookingForTable } from "../../libs/api/booking";
import { useSnackbar } from "../../libs/context/SnackbarContext";
import { getApiErrorMessage } from "../../libs/utils/apiError";
import PageLoader from "../../components/common/PageLoader";

export default function StorePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(1);
  const [_selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const { tables, isLoadingTables, startTableSessionAsync } = useTable();
  const { user } = useAccount();
  const { showSuccess, showError } = useSnackbar();
  // console.log(user);

  // Nếu đang ở child route (/store/table), chỉ render Outlet
  if (location.pathname !== "/store") {
    return <Outlet />;
  }

  // console.log(products);
  if (isLoadingTables) {
    return <PageLoader color="#4caf50" />;
  }

  const normalTables = tables.filter(
    (t: TableData) => t.tableName !== "Bàn 13",
  );
  const vipTables = tables.filter((t: TableData) => t.tableName === "Bàn 13");
  const totalTables = tables.length;
  const totalEstimatedAmount = tables.reduce(
    (sum: number, table: TableData) =>
      table.status === "OCCUPIED"
        ? sum + (table.estimatedTotal ?? 0)
        : sum,
    0,
  );

  // Handlers
  const handleOpenOrder = async (table: TableData) => {
    setSelectedTable(table);

    // Nếu bàn đang OCCUPIED, fetch session data từ API
    if (table.status === "OCCUPIED") {
      try {
        const sessionData = await getTableSession(table.id);
        console.log("Fetched session data for OCCUPIED table:", sessionData);
        navigate(`/store/table/${table.id}`, {
          state: { sessionData },
        });
      } catch (error) {
        console.error("Failed to get session:", error);
        // Fallback: navigate với table data nếu API fail
        navigate(`/store/table/${table.id}`, {
          state: { sessionData: table },
        });
      }
      return;
    }

    // Bàn RESERVED: check-in từ đặt bàn đã xác nhận
    if (table.status === "RESERVED") {
      try {
        const booking = await getConfirmedBookingForTable(table.id);
        if (!booking) {
          showError("Check-in bàn đặt sớm tối đa 15 phút.");
          return;
        }

        const sessionData = await startTableSessionAsync({
          tableId: table.id,
          bookingId: booking.id,
          note: `Check-in ${booking.bookingCode}`,
        });

        showSuccess(
          `Check-in thành công — ${booking.customerName} (${booking.startTime}–${booking.endTime})`,
        );
        navigate(`/store/table/${table.id}`, {
          state: { sessionData },
        });
      } catch (error) {
        showError(
          getApiErrorMessage(error, "Không thể check-in đặt bàn. Vui lòng thử lại!"),
        );
      }
      return;
    }

    // Bàn AVAILABLE: walk-in (đặt bàn tương lai vẫn cho phép nếu chưa vào khung giữ chỗ)
    try {
      const sessionData = await startTableSessionAsync({
        tableId: table.id,
        note: table.upcomingBooking
          ? `Walk-in (có đặt ${table.upcomingBooking.startTime} sau)`
          : "",
      });

      showSuccess("Mở bàn thành công!");
      navigate(`/store/table/${table.id}`, {
        state: { sessionData },
      });
    } catch (error) {
      showError(getApiErrorMessage(error, "Không thể mở bàn. Vui lòng thử lại!"));
      console.error("Failed to start session:", error);
    }
  };

  return (
    <Box>
      {/* Header với Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_e, newValue) => setActiveTab(newValue)}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "14px",
              fontWeight: 500,
            },
            "& .Mui-selected": {
              color: "#2196f3 !important",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#2196f3",
            },
          }}
        >
          <Tab label="Tất cả đơn" />
          <Tab label="Đang phục vụ" />
          <Tab label="Tác nghiệp" />
          <Tab label="Danh sách order" />
        </Tabs>
      </Paper>

      {/* Tab:  Đang phục vụ */}
      {activeTab === 1 && (
        <Box>
          {/* Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Box component="span">📊</Box>}
                sx={{
                  bgcolor: "#ff9800",
                  "&:hover": { bgcolor: "#f57c00" },
                  textTransform: "none",
                }}
              >
                Tổng bàn: {totalTables}
              </Button>
              <Button
                variant="contained"
                startIcon={<Box component="span">💰</Box>}
                sx={{
                  bgcolor: "#4caf50",
                  "&:hover": { bgcolor: "#388e3c" },
                  textTransform: "none",
                }}
              >
                Tổng tiền: {totalEstimatedAmount.toLocaleString("vi-VN")} đ
              </Button>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                sx={{
                  bgcolor: "#4caf50",
                  color: "white",
                  "&:hover": { bgcolor: "#388e3c" },
                }}
              >
                <MenuIcon />
              </IconButton>
              <Button
                variant="outlined"
                sx={{
                  textTransform: "none",
                  borderColor: "#e0e0e0",
                  color: "text.primary",
                }}
              >
                Bàn
              </Button>
            </Box>
          </Box>

          {/* Bàn chơi */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
            >
              <Box component="span">▼</Box> Bàn chơi
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 3,
                "@media (min-width: 1400px)": {
                  gridTemplateColumns: "repeat(6, 1fr)",
                },
              }}
            >
              {normalTables.map((table: TableData) => (
                <TableCard
                  key={table.id}
                  table={table}
                  onOpenOrder={handleOpenOrder}
                />
              ))}
            </Box>
          </Box>

          {/* Bàn VIP */}
          <Box>
            <Typography
              variant="h6"
              sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
            >
              <Box component="span">▼</Box> Bàn Vip
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 3,
                "@media (min-width: 1400px)": {
                  gridTemplateColumns: "repeat(6, 1fr)",
                },
              }}
            >
              {vipTables.map((table: TableData) => (
                <TableCard
                  key={table.id}
                  table={table}
                  onOpenOrder={handleOpenOrder}
                />
              ))}
            </Box>
          </Box>
        </Box>
      )}

      {/* Các tab khác */}
      {activeTab === 0 && (
        <Box sx={{ py: 8, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            Tab "Tất cả đơn"
          </Typography>
        </Box>
      )}

      {activeTab === 2 && (
        <Box sx={{ py: 8, textAlign: "center" }}>
          <Typography variant="h6" color="text. secondary">
            Tab "Tác nghiệp" đang được phát triển...
          </Typography>
        </Box>
      )}

      {activeTab === 3 && (
        <Box sx={{ py: 8, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            Tab "Danh sách order" đang được phát triển...
          </Typography>
        </Box>
      )}
    </Box>
  );
}
