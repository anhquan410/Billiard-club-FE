import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useState } from "react";
import PageLoader from "../../components/common/PageLoader";
import { useCustomerHistory } from "../../libs/hooks/useCustomerHistory";
import { formatCurrency } from "../../libs/utils/format";
import { getBookingStatusLabel } from "../../libs/utils/moduleLabels";
import { getApiErrorMessage } from "../../libs/utils/apiError";
import type { BookingStatus } from "../../libs/types/booking.type";

const statusColor = (status: BookingStatus) => {
  switch (status) {
    case "CONFIRMED":
      return "success";
    case "PENDING":
      return "warning";
    case "COMPLETED":
      return "info";
    case "CANCELLED":
    case "NO_SHOW":
      return "error";
    default:
      return "default";
  }
};

export default function PlayHistoryPage() {
  const [tab, setTab] = useState(0);
  const { history, isLoading, isError, error, refetch, isFetching } =
    useCustomerHistory();

  if (isLoading) {
    return <PageLoader color="#ff5722" />;
  }

  if (isError || !history) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {getApiErrorMessage(error, "Không thể tải lịch sử")}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => refetch()}
          sx={{ textTransform: "none" }}
        >
          Thử lại
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Paper
        sx={{
          p: 2,
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <HistoryIcon sx={{ color: "#ff5722", fontSize: 32 }} />
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Lịch sử chơi
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Theo dõi các lần chơi và đặt bàn của bạn
            </Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => refetch()}
          disabled={isFetching}
          sx={{ textTransform: "none" }}
        >
          Làm mới
        </Button>
      </Paper>

      <Paper sx={{ mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label={`Đã chơi (${history.playSessions.length})`} />
          <Tab label={`Đặt bàn (${history.bookings.length})`} />
        </Tabs>
      </Paper>

      {tab === 0 && (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã HĐ</TableCell>
                  <TableCell>Bàn</TableCell>
                  <TableCell>Thời gian</TableCell>
                  <TableCell align="right">Tiền bàn</TableCell>
                  <TableCell align="right">Dịch vụ</TableCell>
                  <TableCell align="right">Tổng</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.playSessions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        Chưa có lịch sử chơi (hóa đơn gắn với tài khoản của bạn)
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  history.playSessions.map((session) => (
                    <TableRow key={session.id} hover>
                      <TableCell>{session.orderNumber}</TableCell>
                      <TableCell>{session.tableName}</TableCell>
                      <TableCell>
                        {new Date(session.paidAt).toLocaleString("vi-VN")}
                        {session.durationMins > 0 && (
                          <Typography variant="caption" display="block" color="text.secondary">
                            {session.durationMins} phút
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(session.tablePrice)}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(session.servicesTotal)}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        {formatCurrency(session.total)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {tab === 1 && (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã đặt bàn</TableCell>
                  <TableCell>Bàn</TableCell>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Giờ</TableCell>
                  <TableCell align="center">Số khách</TableCell>
                  <TableCell align="center">Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        Chưa có lịch sử đặt bàn
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  history.bookings.map((booking) => (
                    <TableRow key={booking.id} hover>
                      <TableCell>{booking.bookingCode}</TableCell>
                      <TableCell>{booking.tableName}</TableCell>
                      <TableCell>{booking.bookingDate}</TableCell>
                      <TableCell>
                        {booking.startTime} – {booking.endTime}
                      </TableCell>
                      <TableCell align="center">{booking.guestCount}</TableCell>
                      <TableCell align="center">
                        <Chip
                          size="small"
                          label={getBookingStatusLabel(
                            booking.status as BookingStatus,
                          )}
                          color={statusColor(booking.status as BookingStatus)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
}
