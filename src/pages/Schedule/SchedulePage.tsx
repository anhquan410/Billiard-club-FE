import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { useAccount } from "../../libs/hooks/useAccount";
import {
  useAdminSaveSchedule,
  useApproveSchedule,
  useMySchedule,
  usePendingSchedules,
  useRegistrationWindow,
  useRejectSchedule,
  useSaveMySchedule,
  useScheduleOverview,
  useSubmitMySchedule,
} from "../../libs/hooks/useSchedule";
import { useSnackbar } from "../../libs/context/SnackbarContext";
import { getApiErrorMessage } from "../../libs/utils/apiError";
import PageLoader from "../../components/common/PageLoader";
import type { ShiftType, WorkScheduleStatus } from "../../libs/types/schedule.type";
import {
  addDays,
  DAY_LABELS,
  formatVnDate,
  getWeekDates,
  getWeekStart,
  SHIFT_LABELS,
  SHIFT_TYPES,
} from "../../libs/utils/scheduleUtils";
import { getRoleLabel } from "../../libs/utils/roleAccess";

const statusColor: Record<WorkScheduleStatus, "default" | "warning" | "info" | "success" | "error"> = {
  DRAFT: "default",
  SUBMITTED: "warning",
  APPROVED: "success",
  REJECTED: "error",
};

const statusLabel: Record<WorkScheduleStatus, string> = {
  DRAFT: "Nháp",
  SUBMITTED: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
};

type ShiftGridProps = {
  weekStart: string;
  selected: Set<string>;
  onToggle: (workDate: string, shiftType: ShiftType) => void;
  readOnly?: boolean;
};

function shiftKey(workDate: string, shiftType: ShiftType) {
  return `${workDate}:${shiftType}`;
}

function ShiftGrid({ weekStart, selected, onToggle, readOnly }: ShiftGridProps) {
  const weekDates = getWeekDates(weekStart);

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Ca / Ngày</TableCell>
            {weekDates.map((date, i) => (
              <TableCell key={date} align="center">
                <Typography variant="caption" display="block">
                  {DAY_LABELS[i]}
                </Typography>
                <Typography variant="body2">{formatVnDate(date)}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {SHIFT_TYPES.map((shiftType) => (
            <TableRow key={shiftType}>
              <TableCell sx={{ minWidth: 140 }}>
                <Typography variant="body2">{SHIFT_LABELS[shiftType]}</Typography>
              </TableCell>
              {weekDates.map((date) => {
                const key = shiftKey(date, shiftType);
                const checked = selected.has(key);
                return (
                  <TableCell key={key} align="center" padding="checkbox">
                    <Checkbox
                      checked={checked}
                      disabled={readOnly}
                      onChange={() => onToggle(date, shiftType)}
                    />
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function selectedToShifts(selected: Set<string>) {
  return Array.from(selected).map((key) => {
    const [workDate, shiftType] = key.split(":");
    return { workDate, shiftType: shiftType as ShiftType };
  });
}

function shiftsToSelected(shifts: { workDate: string; shiftType: ShiftType }[]) {
  return new Set(shifts.map((s) => shiftKey(s.workDate, s.shiftType)));
}

function EmployeeScheduleTab() {
  const { data: registrationWindow } = useRegistrationWindow();
  const [navigatedWeekStart, setNavigatedWeekStart] = useState<string | null>(null);
  const [editedSelected, setEditedSelected] = useState<Set<string> | null>(null);

  const registrationWeekStart =
    registrationWindow?.isOpen && registrationWindow.weekStart
      ? registrationWindow.weekStart
      : null;

  const weekStart =
    navigatedWeekStart ?? registrationWeekStart ?? getWeekStart();

  const { data: schedule, isLoading } = useMySchedule(weekStart);
  const saveMutation = useSaveMySchedule();
  const submitMutation = useSubmitMySchedule();
  const { showSuccess, showError } = useSnackbar();

  const selected = useMemo(
    () => editedSelected ?? shiftsToSelected(schedule?.shifts ?? []),
    [editedSelected, schedule?.shifts],
  );

  const changeWeek = (nextWeekStart: string) => {
    setNavigatedWeekStart(nextWeekStart);
    setEditedSelected(null);
  };

  const canEdit =
    registrationWindow?.isOpen &&
    registrationWindow.weekStart === weekStart &&
    schedule &&
    (schedule.status === "DRAFT" || schedule.status === "REJECTED");

  const handleToggle = (workDate: string, shiftType: ShiftType) => {
    if (!canEdit) return;
    setEditedSelected((prev) => {
      const base = prev ?? shiftsToSelected(schedule?.shifts ?? []);
      const next = new Set(base);
      const key = shiftKey(workDate, shiftType);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleSave = async () => {
    try {
      await saveMutation.mutateAsync({
        weekStart,
        shifts: selectedToShifts(selected),
      });
      showSuccess("Đã lưu lịch làm việc");
    } catch (e) {
      showError(getApiErrorMessage(e));
    }
  };

  const handleSubmit = async () => {
    try {
      await saveMutation.mutateAsync({
        weekStart,
        shifts: selectedToShifts(selected),
      });
      await submitMutation.mutateAsync(weekStart);
      showSuccess("Đã gửi lịch chờ Admin duyệt");
    } catch (e) {
      showError(getApiErrorMessage(e));
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <Box>
      {registrationWindow && (
        <Alert severity={registrationWindow.isOpen ? "info" : "warning"} sx={{ mb: 2 }}>
          {registrationWindow.message}
        </Alert>
      )}

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <IconButton onClick={() => changeWeek(addDays(weekStart, -7))}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography>
          Tuần bắt đầu <strong>{formatVnDate(weekStart)}</strong>
        </Typography>
        <IconButton onClick={() => changeWeek(addDays(weekStart, 7))}>
          <ChevronRightIcon />
        </IconButton>
        {schedule && (
          <Chip
            label={statusLabel[schedule.status]}
            color={statusColor[schedule.status]}
            size="small"
            sx={{ ml: 1 }}
          />
        )}
      </Box>

      {schedule?.status === "REJECTED" && schedule.rejectReason && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Bị từ chối: {schedule.rejectReason}
        </Alert>
      )}

      <ShiftGrid
        weekStart={weekStart}
        selected={selected}
        onToggle={handleToggle}
        readOnly={!canEdit}
      />

      {canEdit && (
        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={saveMutation.isPending}
          >
            Lưu nháp
          </Button>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleSubmit}
            disabled={submitMutation.isPending || selected.size === 0}
          >
            Gửi duyệt
          </Button>
        </Box>
      )}
    </Box>
  );
}

function AdminPendingTab() {
  const { data: pending = [], isLoading } = usePendingSchedules();
  const approveMutation = useApproveSchedule();
  const rejectMutation = useRejectSchedule();
  const { showSuccess, showError } = useSnackbar();
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = async (weekId: string) => {
    try {
      await approveMutation.mutateAsync(weekId);
      showSuccess("Đã duyệt lịch làm việc");
    } catch (e) {
      showError(getApiErrorMessage(e));
    }
  };

  const handleReject = async () => {
    if (!rejectId || !rejectReason.trim()) return;
    try {
      await rejectMutation.mutateAsync({
        weekId: rejectId,
        rejectReason: rejectReason.trim(),
      });
      showSuccess("Đã từ chối lịch");
      setRejectId(null);
      setRejectReason("");
    } catch (e) {
      showError(getApiErrorMessage(e));
    }
  };

  if (isLoading) return <PageLoader />;

  if (pending.length === 0) {
    return <Alert severity="info">Không có lịch chờ duyệt</Alert>;
  }

  return (
    <Box>
      {pending.map((item) => (
        <Paper key={item.id} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Box>
              <Typography fontWeight={600}>{item.user?.fullName}</Typography>
              <Typography variant="body2" color="text.secondary">
                Tuần {formatVnDate(item.weekStart)} · {item.shifts.length} ca
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                size="small"
                variant="contained"
                color="success"
                startIcon={<CheckIcon />}
                onClick={() => handleApprove(item.id)}
              >
                Duyệt
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                startIcon={<CloseIcon />}
                onClick={() => setRejectId(item.id)}
              >
                Từ chối
              </Button>
            </Box>
          </Box>
          <Typography variant="body2">
            {item.shifts
              .map((s) => `${formatVnDate(s.workDate)} – ${SHIFT_LABELS[s.shiftType]}`)
              .join(" · ")}
          </Typography>
        </Paper>
      ))}

      <Dialog open={!!rejectId} onClose={() => setRejectId(null)}>
        <DialogTitle>Từ chối lịch làm việc</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            minRows={2}
            label="Lý do"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectId(null)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={handleReject}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function AdminManageTab() {
  const [weekStart, setWeekStart] = useState(getWeekStart());
  const { data: overview, isLoading } = useScheduleOverview(weekStart);
  const adminSave = useAdminSaveSchedule();
  const rejectMutation = useRejectSchedule();
  const { showSuccess, showError } = useSnackbar();

  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [editUserName, setEditUserName] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [approveOnSave, setApproveOnSave] = useState(true);

  const openEdit = (
    userId: string,
    fullName: string,
    shifts: { workDate: string; shiftType: ShiftType }[],
  ) => {
    setEditUserId(userId);
    setEditUserName(fullName);
    setSelected(shiftsToSelected(shifts));
    setApproveOnSave(true);
  };

  const handleSave = async () => {
    if (!editUserId) return;
    try {
      await adminSave.mutateAsync({
        userId: editUserId,
        payload: {
          weekStart,
          shifts: selectedToShifts(selected),
          approve: approveOnSave,
        },
      });
      showSuccess(approveOnSave ? "Đã lưu và duyệt lịch" : "Đã lưu lịch");
      setEditUserId(null);
    } catch (e) {
      showError(getApiErrorMessage(e));
    }
  };

  const handleRejectApproved = async (weekId: string) => {
    const reason = window.prompt("Lý do từ chối lịch đã duyệt:");
    if (!reason?.trim()) return;
    try {
      await rejectMutation.mutateAsync({
        weekId,
        rejectReason: reason.trim(),
        approved: true,
      });
      showSuccess("Đã từ chối lịch đã duyệt");
    } catch (e) {
      showError(getApiErrorMessage(e));
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <IconButton onClick={() => setWeekStart(addDays(weekStart, -7))}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography>
          Tuần <strong>{formatVnDate(weekStart)}</strong>
        </Typography>
        <IconButton onClick={() => setWeekStart(addDays(weekStart, 7))}>
          <ChevronRightIcon />
        </IconButton>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nhân viên</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Số ca</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {overview?.employees.map(({ user, schedule }) => (
              <TableRow key={user.id}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{getRoleLabel(user.role)}</TableCell>
                <TableCell>
                  {schedule ? (
                    <Chip
                      size="small"
                      label={statusLabel[schedule.status]}
                      color={statusColor[schedule.status]}
                    />
                  ) : (
                    <Chip size="small" label="Chưa có" />
                  )}
                </TableCell>
                <TableCell>{schedule?.shifts.length ?? 0}</TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() =>
                      openEdit(user.id, user.fullName, schedule?.shifts ?? [])
                    }
                  >
                    {schedule ? "Sửa" : "Tạo"}
                  </Button>
                  {schedule?.status === "APPROVED" && (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleRejectApproved(schedule.id)}
                      sx={{ ml: 1 }}
                    >
                      Thu hồi
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={!!editUserId}
        onClose={() => setEditUserId(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Lịch làm việc — {editUserName}</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Checkbox
                checked={approveOnSave}
                onChange={(e) => setApproveOnSave(e.target.checked)}
              />
            }
            label="Duyệt luôn sau khi lưu (dùng khi NV bỏ lỡ Chủ nhật)"
          />
          <ShiftGrid
            weekStart={weekStart}
            selected={selected}
            onToggle={(date, type) => {
              setSelected((prev) => {
                const next = new Set(prev);
                const key = shiftKey(date, type);
                if (next.has(key)) next.delete(key);
                else next.add(key);
                return next;
              });
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUserId(null)}>Hủy</Button>
          <Button variant="contained" onClick={handleSave} disabled={adminSave.isPending}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function SchedulePage() {
  const { user } = useAccount();
  const isAdmin = user?.role === "ADMIN";
  const isEmployee = user?.role === "STAFF" || user?.role === "CASHIER";
  const [tab, setTab] = useState(0);

  const adminTabs = useMemo(
    () => [
      { label: "Chờ duyệt", content: <AdminPendingTab /> },
      { label: "Quản lý lịch", content: <AdminManageTab /> },
      ...(isEmployee ? [{ label: "Lịch của tôi", content: <EmployeeScheduleTab /> }] : []),
    ],
    [isEmployee],
  );

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <CalendarMonthIcon color="primary" />
        <Typography variant="h5" fontWeight={700}>
          Lịch làm việc
        </Typography>
      </Box>

      {isAdmin ? (
        <>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
            {adminTabs.map((t) => (
              <Tab key={t.label} label={t.label} />
            ))}
          </Tabs>
          {adminTabs[tab]?.content}
        </>
      ) : isEmployee ? (
        <EmployeeScheduleTab />
      ) : (
        <Alert severity="warning">Bạn không có quyền truy cập lịch làm việc</Alert>
      )}
    </Box>
  );
}
