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
import DeleteIcon from "@mui/icons-material/Delete";
import { useAccount } from "../../libs/hooks/useAccount";
import {
  useAdminSaveSchedule,
  useApproveSchedule,
  useMySchedule,
  usePendingSchedules,
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
  getNextWeekStart,
  getWeekDates,
  getWeekStart,
  isFutureWeekStart,
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
  embedded?: boolean;
};

function shiftKey(workDate: string, shiftType: ShiftType) {
  return `${workDate}:${shiftType}`;
}

function ShiftGrid({ weekStart, selected, onToggle, readOnly, embedded }: ShiftGridProps) {
  const weekDates = getWeekDates(weekStart);

  const table = (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Ca / Ngày</TableCell>
          {weekDates.map((date, i) => (
            <TableCell key={date} align="center" sx={{ minWidth: embedded ? 88 : undefined, px: embedded ? 0.5 : 2 }}>
              <Typography variant="caption" display="block" noWrap>
                {DAY_LABELS[i]}
              </Typography>
              <Typography variant="body2" noWrap>
                {formatVnDate(date)}
              </Typography>
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
  );

  if (embedded) {
    return (
      <TableContainer
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          width: "100%",
          mt: 1,
        }}
      >
        {table}
      </TableContainer>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      {table}
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
  const [navigatedWeekStart, setNavigatedWeekStart] = useState<string | null>(null);
  const [editedSelected, setEditedSelected] = useState<Set<string> | null>(null);

  const weekStart = navigatedWeekStart ?? getNextWeekStart();

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
    isFutureWeekStart(weekStart) &&
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
      <Alert severity="info" sx={{ mb: 2 }}>
        Bạn chỉ có thể đăng ký lịch cho các tuần trong tương lai.
      </Alert>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <IconButton onClick={() => changeWeek(addDays(weekStart, -7))}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography>
          Tuần <strong>{formatVnDate(weekStart)}</strong> - <strong>{formatVnDate(addDays(weekStart, 6))}</strong>
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
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {pending.map((item) => (
        <Paper key={item.id} variant="outlined" sx={{ overflow: "hidden" }}>
          <Box
            sx={{
              px: 2,
              py: 1.5,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              bgcolor: "grey.50",
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                <Typography fontWeight={700}>{item.user?.fullName}</Typography>
                {item.user?.role && (
                  <Chip
                    size="small"
                    label={getRoleLabel(item.user.role)}
                    variant="outlined"
                  />
                )}
                <Chip size="small" label="Chờ duyệt" color="warning" />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Tuần bắt đầu {formatVnDate(item.weekStart)} · {item.shifts.length} ca
                {item.submittedAt &&
                  ` · Gửi lúc ${new Date(item.submittedAt).toLocaleString("vi-VN")}`}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
              <Button
                size="small"
                variant="contained"
                color="success"
                startIcon={<CheckIcon />}
                onClick={() => handleApprove(item.id)}
                disabled={approveMutation.isPending}
              >
                Duyệt
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                startIcon={<CloseIcon />}
                onClick={() => setRejectId(item.id)}
                disabled={rejectMutation.isPending}
              >
                Từ chối
              </Button>
            </Box>
          </Box>

          <Box sx={{ p: 2 }}>
            <ShiftGrid
              weekStart={item.weekStart}
              selected={shiftsToSelected(item.shifts)}
              onToggle={() => {}}
              readOnly
              embedded
            />
          </Box>
        </Paper>
      ))}

      <Dialog open={!!rejectId} onClose={() => setRejectId(null)} fullWidth maxWidth="sm">
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
          <Button
            variant="contained"
            color="error"
            onClick={handleReject}
            disabled={!rejectReason.trim() || rejectMutation.isPending}
          >
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

  const openEdit = (
    userId: string,
    fullName: string,
    shifts: { workDate: string; shiftType: ShiftType }[],
  ) => {
    setEditUserId(userId);
    setEditUserName(fullName);
    setSelected(shiftsToSelected(shifts));
  };

  const handleSave = async () => {
    if (!editUserId) return;
    try {
      await adminSave.mutateAsync({
        userId: editUserId,
        payload: {
          weekStart,
          shifts: selectedToShifts(selected),
          approve: true,
        },
      });
      showSuccess("Đã lưu và duyệt lịch");
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
          Tuần <strong>{formatVnDate(weekStart)}</strong> - <strong>{formatVnDate(addDays(weekStart, 6))}</strong>
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
                      startIcon={<DeleteIcon />}
                      color="error"
                      onClick={() => handleRejectApproved(schedule.id)}
                      sx={{ ml: 1 }}
                    >
                      Xóa
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
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { width: "min(1100px, 96vw)" } }}
      >
        <DialogTitle>Lịch làm việc — {editUserName}</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <ShiftGrid
            weekStart={weekStart}
            selected={selected}
            embedded
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
            Lưu và duyệt
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
