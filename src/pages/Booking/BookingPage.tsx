import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
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
  Chip,
} from "@mui/material";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import PhoneIcon from "@mui/icons-material/Phone";
import RefreshIcon from "@mui/icons-material/Refresh";
import { formatCurrency } from "../../libs/utils/format";
import { getBookingStatusLabel } from "../../libs/utils/moduleLabels";
import type { BookingStatus, TableBooking } from "../../libs/types/booking.type";
import type { BookingQueryParams } from "../../libs/api/booking";
import {
  useBookingDashboard,
  useCancelBooking,
  useConfirmBooking,
  useCreateBooking,
  useMarkNoShowBooking,
  useReassignBookingTable,
  useReassignTableOptions,
} from "../../libs/hooks/useBooking";
import { useSnackbar } from "../../libs/context/SnackbarContext";
import { getApiErrorMessage } from "../../libs/utils/apiError";
import PageLoader from "../../components/common/PageLoader";

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

export default function BookingPage() {
  const { showSnackbar } = useSnackbar();
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "ALL">("ALL");
  const [selectedDate, setSelectedDate] = useState(today);
  const [search, setSearch] = useState("");
  const [appliedParams, setAppliedParams] = useState<BookingQueryParams>({
    date: today,
  });
  const [openCreate, setOpenCreate] = useState(false);
  const [reassignBookingId, setReassignBookingId] = useState<string | null>(null);
  const [reassignTableId, setReassignTableId] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    tableId: "",
    bookingDate: today,
    startTime: "18:00",
    endTime: "21:00",
    guestCount: "2",
    depositAmount: "",
    note: "",
  });

  const { data, isLoading, isFetching, isError, error, refetch } =
    useBookingDashboard(appliedParams);
  const { mutate: createBooking, isPending: isCreating } = useCreateBooking();
  const { mutate: confirmBooking } = useConfirmBooking();
  const { mutate: cancelBooking } = useCancelBooking();
  const { mutate: markNoShow } = useMarkNoShowBooking();
  const { mutate: reassignTable, isPending: isReassigning } =
    useReassignBookingTable();
  const {
    data: reassignOptions,
    isLoading: isLoadingReassignOptions,
    isError: isReassignOptionsError,
    error: reassignOptionsError,
  } = useReassignTableOptions(reassignBookingId);

  const filteredBookings =
    statusFilter === "ALL"
      ? (data?.bookings ?? [])
      : (data?.bookings ?? []).filter((b) => b.status === statusFilter);

  const handleSearch = () => {
    setAppliedParams({
      date: selectedDate,
      search: search.trim() || undefined,
      status: statusFilter === "ALL" ? undefined : statusFilter,
    });
  };

  const handleCreate = () => {
    if (!form.customerName || !form.customerPhone || !form.tableId) {
      showSnackbar("Vui lòng nhập đầy đủ thông tin đặt bàn", "warning");
      return;
    }

    createBooking(
      {
        customerName: form.customerName.trim(),
        customerPhone: form.customerPhone.trim(),
        tableId: form.tableId,
        bookingDate: form.bookingDate,
        startTime: form.startTime,
        endTime: form.endTime,
        guestCount: Number(form.guestCount) || 1,
        depositAmount: form.depositAmount ? Number(form.depositAmount) : 0,
        note: form.note.trim() || undefined,
      },
      {
        onSuccess: () => {
          showSnackbar("Tạo đặt bàn thành công", "success");
          setOpenCreate(false);
        },
        onError: (err) => {
          showSnackbar(getApiErrorMessage(err, "Không thể tạo đặt bàn"), "error");
        },
      },
    );
  };

  const handleConfirm = (id: string) => {
    confirmBooking(id, {
      onSuccess: () => showSnackbar("Đã xác nhận đặt bàn", "success"),
      onError: (err) =>
        showSnackbar(getApiErrorMessage(err, "Không thể xác nhận"), "error"),
    });
  };

  const handleCancel = (id: string) => {
    cancelBooking(id, {
      onSuccess: () => showSnackbar("Đã hủy đặt bàn", "success"),
      onError: (err) =>
        showSnackbar(getApiErrorMessage(err, "Không thể hủy đặt bàn"), "error"),
    });
  };

  const handleNoShow = (id: string) => {
    markNoShow(id, {
      onSuccess: () =>
        showSnackbar("Đã đánh dấu khách không đến, bàn đã được trả trống", "success"),
      onError: (err) =>
        showSnackbar(getApiErrorMessage(err, "Không thể cập nhật"), "error"),
    });
  };

  const openReassignDialog = (booking: TableBooking) => {
    setReassignBookingId(booking.id);
    setReassignTableId("");
  };

  const closeReassignDialog = () => {
    setReassignBookingId(null);
    setReassignTableId("");
  };

  const handleReassign = () => {
    if (!reassignBookingId || !reassignTableId) {
      showSnackbar("Vui lòng chọn bàn mới", "warning");
      return;
    }

    reassignTable(
      { bookingId: reassignBookingId, tableId: reassignTableId },
      {
        onSuccess: (updated) => {
          showSnackbar(
            `Đã chuyển ${updated.bookingCode} sang ${updated.tableName}`,
            "success",
          );
          closeReassignDialog();
        },
        onError: (err) =>
          showSnackbar(getApiErrorMessage(err, "Không thể đổi bàn"), "error"),
      },
    );
  };

  const canReassign = (booking: TableBooking) =>
    (booking.status === "PENDING" || booking.status === "CONFIRMED") &&
    !booking.hasCheckedIn;

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
              Quản lý đặt bàn trước
            </Typography>
          </Box>
          {isFetching && <CircularProgress size={18} sx={{ color: "#9c27b0" }} />}
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
            Tạo đặt bàn
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {[
          { label: "Hôm nay", value: data.summary.todayBookings, color: "#9c27b0" },
          { label: "Chờ xác nhận", value: data.summary.pending, color: "#ff9800" },
          { label: "Đã xác nhận", value: data.summary.confirmed, color: "#4caf50" },
          { label: "Hoàn thành", value: data.summary.completed, color: "#2196f3" },
          { label: "Đã hủy", value: data.summary.cancelled, color: "#9e9e9e" },
        ].map((item) => (
          <Grid key={item.label} size={{ xs: 6, sm: 4, md: 2 }}>
            <Paper sx={{ p: 2, borderTop: `4px solid ${item.color}`, textAlign: "center" }}>
              <Typography variant="h5" fontWeight={700}>
                {item.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ mb: 2, p: 2 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
          <TextField
            size="small"
            label="Ngày đặt"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            size="small"
            placeholder="Tên / SĐT khách"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Trạng thái"
              onChange={(e) =>
                setStatusFilter(e.target.value as BookingStatus | "ALL")
              }
              MenuProps={{ disableScrollLock: true }}
            >
              <MenuItem value="ALL">Tất cả</MenuItem>
              <MenuItem value="PENDING">Chờ xác nhận</MenuItem>
              <MenuItem value="CONFIRMED">Đã xác nhận</MenuItem>
              <MenuItem value="COMPLETED">Hoàn thành</MenuItem>
              <MenuItem value="CANCELLED">Đã hủy</MenuItem>
              <MenuItem value="NO_SHOW">Không đến</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            sx={{ bgcolor: "#9c27b0", textTransform: "none" }}
            onClick={handleSearch}
            disabled={isFetching}
          >
            Tìm kiếm
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 9 }}>
          <Paper>
            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell>Mã đặt</TableCell>
                    <TableCell>Khách hàng</TableCell>
                    <TableCell>Bàn</TableCell>
                    <TableCell>Ngày</TableCell>
                    <TableCell>Giờ</TableCell>
                    <TableCell align="center">Số khách</TableCell>
                    <TableCell align="right">Cọc</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          Không có đặt bàn nào
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBookings.map((booking: TableBooking) => (
                      <TableRow key={booking.id} hover>
                        <TableCell>
                          <Typography fontWeight={600} variant="body2">
                            {booking.bookingCode}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight={500}>
                            {booking.customerName}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="flex"
                            alignItems="center"
                            gap={0.5}
                          >
                            <PhoneIcon sx={{ fontSize: 12 }} />
                            {booking.customerPhone}
                          </Typography>
                        </TableCell>
                        <TableCell>{booking.tableName}</TableCell>
                        <TableCell>{booking.bookingDate}</TableCell>
                        <TableCell>
                          {booking.startTime} - {booking.endTime}
                        </TableCell>
                        <TableCell align="center">{booking.guestCount}</TableCell>
                        <TableCell align="right">
                          {booking.depositAmount > 0
                            ? formatCurrency(booking.depositAmount)
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getBookingStatusLabel(booking.status)}
                            size="small"
                            color={statusColor(booking.status)}
                          />
                        </TableCell>
                        <TableCell align="center">
                          {booking.status === "PENDING" && (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 0.5,
                              }}
                            >
                              <IconButton
                                size="small"
                                color="success"
                                title="Xác nhận"
                                onClick={() => handleConfirm(booking.id)}
                              >
                                <CheckCircleIcon fontSize="small" />
                              </IconButton>
                              {canReassign(booking) && (
                                <IconButton
                                  size="small"
                                  color="primary"
                                  title="Đổi bàn"
                                  onClick={() => openReassignDialog(booking)}
                                >
                                  <SwapHorizIcon fontSize="small" />
                                </IconButton>
                              )}
                              <IconButton
                                size="small"
                                color="error"
                                title="Hủy"
                                onClick={() => handleCancel(booking.id)}
                              >
                                <CancelIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          )}
                          {booking.status === "CONFIRMED" &&
                            booking.hasCheckedIn && (
                              <Chip
                                label="Đã check-in"
                                size="small"
                                color="info"
                                variant="outlined"
                              />
                            )}
                          {booking.status === "CONFIRMED" &&
                            !booking.hasCheckedIn && (
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  gap: 0.5,
                                }}
                              >
                                <IconButton
                                  size="small"
                                  color="primary"
                                  title="Đổi bàn"
                                  onClick={() => openReassignDialog(booking)}
                                >
                                  <SwapHorizIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="warning"
                                  title="Khách không đến"
                                  onClick={() => handleNoShow(booking.id)}
                                >
                                  <PersonOffIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="error"
                                  title="Hủy đặt bàn"
                                  onClick={() => handleCancel(booking.id)}
                                >
                                  <CancelIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Bàn trống hôm nay
            </Typography>
            {data.availableTables.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Không có bàn trống
              </Typography>
            ) : (
              data.availableTables.map((table) => (
                <Box
                  key={table.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    py: 1,
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <Typography variant="body2">{table.tableName}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatCurrency(table.hourlyRate)}/h
                  </Typography>
                </Box>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        maxWidth="sm"
        fullWidth
        disableScrollLock
      >
        <DialogTitle>Tạo đặt bàn mới</DialogTitle>
        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <TextField
            label="Tên khách hàng"
            fullWidth
            size="small"
            value={form.customerName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, customerName: e.target.value }))
            }
          />
          <TextField
            label="Số điện thoại"
            fullWidth
            size="small"
            value={form.customerPhone}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, customerPhone: e.target.value }))
            }
          />
          <FormControl fullWidth size="small">
            <InputLabel>Chọn bàn</InputLabel>
            <Select
              label="Chọn bàn"
              value={form.tableId}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, tableId: e.target.value }))
              }
              MenuProps={{ disableScrollLock: true }}
            >
              {data.availableTables.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.tableName} — {formatCurrency(t.hourlyRate)}/h
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Ngày đặt"
            type="date"
            fullWidth
            size="small"
            value={form.bookingDate}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, bookingDate: e.target.value }))
            }
            InputLabelProps={{ shrink: true }}
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Giờ bắt đầu"
              type="time"
              fullWidth
              size="small"
              value={form.startTime}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, startTime: e.target.value }))
              }
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Giờ kết thúc"
              type="time"
              fullWidth
              size="small"
              value={form.endTime}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, endTime: e.target.value }))
              }
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <TextField
            label="Số khách"
            type="number"
            fullWidth
            size="small"
            value={form.guestCount}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, guestCount: e.target.value }))
            }
          />
          <TextField
            label="Tiền cọc"
            type="number"
            fullWidth
            size="small"
            value={form.depositAmount}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, depositAmount: e.target.value }))
            }
          />
          <TextField
            label="Ghi chú"
            multiline
            rows={2}
            fullWidth
            size="small"
            value={form.note}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, note: e.target.value }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Hủy</Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "#9c27b0" }}
            onClick={handleCreate}
            disabled={isCreating}
          >
            {isCreating ? "Đang tạo..." : "Tạo đặt bàn"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!reassignBookingId}
        onClose={closeReassignDialog}
        maxWidth="sm"
        fullWidth
        disableScrollLock
      >
        <DialogTitle>Đổi bàn đặt</DialogTitle>
        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          {isLoadingReassignOptions && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress size={28} />
            </Box>
          )}

          {isReassignOptionsError && (
            <Alert severity="error">
              {getApiErrorMessage(reassignOptionsError, "Không thể tải danh sách bàn")}
            </Alert>
          )}

          {reassignOptions && (
            <>
              {reassignOptions.currentTableOccupied && (
                <Alert severity="warning">
                  {reassignOptions.currentTable.tableName} đang có khách chơi (walk-in).
                  Hãy chuyển lịch đặt sang bàn trống khác để khách đặt bàn không bị miss lịch.
                </Alert>
              )}

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Mã đặt: <strong>{reassignOptions.bookingCode}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Bàn hiện tại: <strong>{reassignOptions.currentTable.tableName}</strong>
                </Typography>
              </Box>

              {reassignOptions.eligibleTables.length === 0 ? (
                <Alert severity="info">
                  Không có bàn trống khung giờ này. Vui lòng hủy hoặc liên hệ khách để đổi giờ.
                </Alert>
              ) : (
                <FormControl fullWidth size="small">
                  <InputLabel>Chọn bàn mới</InputLabel>
                  <Select
                    label="Chọn bàn mới"
                    value={reassignTableId}
                    onChange={(e) => setReassignTableId(e.target.value)}
                    MenuProps={{ disableScrollLock: true }}
                  >
                    {reassignOptions.eligibleTables.map((table) => (
                      <MenuItem key={table.id} value={table.id}>
                        {table.tableName} — {formatCurrency(table.hourlyRate)}/h
                        {table.isOccupied ? " (đang có khách)" : ""}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeReassignDialog}>Hủy</Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "#9c27b0" }}
            onClick={handleReassign}
            disabled={
              isReassigning ||
              isLoadingReassignOptions ||
              !reassignTableId ||
              !reassignOptions?.eligibleTables.length
            }
          >
            {isReassigning ? "Đang đổi..." : "Xác nhận đổi bàn"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
