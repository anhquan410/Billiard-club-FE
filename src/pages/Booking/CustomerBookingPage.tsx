import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import RefreshIcon from "@mui/icons-material/Refresh";
import PageLoader from "../../components/common/PageLoader";
import { formatCurrency } from "../../libs/utils/format";
import { getBookingStatusLabel } from "../../libs/utils/moduleLabels";
import type { BookingStatus } from "../../libs/types/booking.type";
import {
  useCancelBooking,
  useCreateCustomerBooking,
  useMyBookings,
} from "../../libs/hooks/useBooking";
import { useSnackbar } from "../../libs/context/SnackbarContext";
import { getApiErrorMessage } from "../../libs/utils/apiError";

const today = new Date().toISOString().slice(0, 10);

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

export default function CustomerBookingPage() {
  const { showSnackbar } = useSnackbar();
  const { data, isLoading, isError, error, refetch, isFetching } =
    useMyBookings();
  const { mutate: createBooking, isPending: isCreating } =
    useCreateCustomerBooking();
  const { mutate: cancelBooking } = useCancelBooking();
  const [openCreate, setOpenCreate] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<{
    id: string;
    bookingCode: string;
  } | null>(null);
  const [form, setForm] = useState({
    tableId: "",
    bookingDate: today,
    startTime: "18:00",
    endTime: "21:00",
    guestCount: "2",
    note: "",
  });

  const handleCreate = () => {
    if (!form.tableId) {
      showSnackbar("Vui lòng chọn bàn", "warning");
      return;
    }

    createBooking(
      {
        tableId: form.tableId,
        bookingDate: form.bookingDate,
        startTime: form.startTime,
        endTime: form.endTime,
        guestCount: Number(form.guestCount) || 1,
        note: form.note.trim() || undefined,
      },
      {
        onSuccess: () => {
          showSnackbar("Đặt bàn thành công, chờ xác nhận", "success");
          setOpenCreate(false);
        },
        onError: (err) => {
          showSnackbar(getApiErrorMessage(err, "Không thể đặt bàn"), "error");
        },
      },
    );
  };

  const handleCancelConfirm = () => {
    if (!cancelTarget) return;

    cancelBooking(cancelTarget.id, {
      onSuccess: () => {
        showSnackbar("Đã hủy đặt bàn", "success");
        setCancelTarget(null);
      },
      onError: (err) =>
        showSnackbar(getApiErrorMessage(err, "Không thể hủy đặt bàn"), "error"),
    });
  };

  if (isLoading) {
    return <PageLoader color="#9c27b0" />;
  }

  if (isError || !data) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {getApiErrorMessage(error, "Không thể tải dữ liệu đặt bàn")}
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
          <EventSeatIcon sx={{ color: "#9c27b0", fontSize: 32 }} />
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Đặt bàn
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Đặt bàn chơi trước cho tài khoản của bạn
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
            disabled={isFetching}
            sx={{ textTransform: "none" }}
          >
            Làm mới
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreate(true)}
            sx={{
              bgcolor: "#9c27b0",
              textTransform: "none",
              "&:hover": { bgcolor: "#7b1fa2" },
            }}
          >
            Đặt bàn mới
          </Button>
        </Box>
      </Paper>

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
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      Bạn chưa có đặt bàn nào
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                data.bookings.map((booking) => (
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
                        label={getBookingStatusLabel(booking.status)}
                        color={statusColor(booking.status)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {booking.canCancel ? (
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<CancelIcon />}
                          onClick={() =>
                            setCancelTarget({
                              id: booking.id,
                              bookingCode: booking.bookingCode,
                            })
                          }
                          sx={{ textTransform: "none", whiteSpace: "nowrap" }}
                        >
                          Hủy đặt bàn
                        </Button>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          —
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Xác nhận hủy đặt bàn</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc muốn hủy đặt bàn?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelTarget(null)}>Không</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleCancelConfirm}
          >
            Hủy đặt bàn
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Đặt bàn mới</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Chọn bàn</InputLabel>
                <Select
                  value={form.tableId}
                  label="Chọn bàn"
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, tableId: e.target.value }))
                  }
                >
                  {data.availableTables.map((table) => (
                    <MenuItem key={table.id} value={table.id}>
                      {table.tableName} — {formatCurrency(table.hourlyRate)}/giờ
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Ngày đặt"
                type="date"
                value={form.bookingDate}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, bookingDate: e.target.value }))
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                fullWidth
                label="Bắt đầu"
                type="time"
                value={form.startTime}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, startTime: e.target.value }))
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                fullWidth
                label="Kết thúc"
                type="time"
                value={form.endTime}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, endTime: e.target.value }))
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Số khách"
                type="number"
                value={form.guestCount}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, guestCount: e.target.value }))
                }
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Ghi chú"
                multiline
                rows={2}
                value={form.note}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, note: e.target.value }))
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={isCreating}
            sx={{ bgcolor: "#9c27b0", "&:hover": { bgcolor: "#7b1fa2" } }}
          >
            Xác nhận đặt bàn
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
