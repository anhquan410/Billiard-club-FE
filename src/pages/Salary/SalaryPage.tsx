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
import PaymentsIcon from "@mui/icons-material/Payments";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import { useAccount } from "../../libs/hooks/useAccount";
import {
  useAdminPayrollSummary,
  useCreatePayrollAdjustment,
  useMyPayroll,
} from "../../libs/hooks/usePayroll";
import { useStaffForAssignment } from "../../libs/hooks/useTask";
import { useSnackbar } from "../../libs/context/SnackbarContext";
import { getApiErrorMessage } from "../../libs/utils/apiError";
import { formatCurrency } from "../../libs/utils/format";
import { formatVnDate, getCurrentMonth } from "../../libs/utils/scheduleUtils";
import PageLoader from "../../components/common/PageLoader";
import type { PayrollAdjustmentType } from "../../libs/types/payroll.type";
import { getRoleLabel } from "../../libs/utils/roleAccess";

function SummaryCards({
  totalShifts,
  shiftSalary,
  bonuses,
  penalties,
  netSalary,
}: {
  totalShifts: number;
  shiftSalary: number;
  bonuses: number;
  penalties: number;
  netSalary: number;
}) {
  const cards = [
    { label: "Số công", value: String(totalShifts), color: "#1976d2" },
    { label: "Lương ca", value: formatCurrency(shiftSalary), color: "#2e7d32" },
    { label: "Thưởng", value: formatCurrency(bonuses), color: "#ed6c02" },
    { label: "Phạt", value: formatCurrency(penalties), color: "#d32f2f" },
    { label: "Thực nhận", value: formatCurrency(netSalary), color: "#6a1b9a" },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {cards.map((c) => (
        <Grid key={c.label} size={{ xs: 6, md: 2.4 }}>
          <Paper sx={{ p: 2, borderTop: `4px solid ${c.color}` }}>
            <Typography variant="caption" color="text.secondary">
              {c.label}
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              {c.value}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

function PayrollDetail({ month }: { month: string }) {
  const { data, isLoading, isError } = useMyPayroll(month);

  if (isLoading) return <PageLoader />;
  if (isError || !data) {
    return <Alert severity="error">Không tải được dữ liệu lương</Alert>;
  }

  return (
    <Box>
      <SummaryCards
        totalShifts={data.totalShifts}
        shiftSalary={data.shiftSalary}
        bonuses={data.bonuses}
        penalties={data.penalties}
        netSalary={data.netSalary}
      />

      <Typography variant="h6" gutterBottom>
        Chi tiết theo ca
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Loại ca</TableCell>
              <TableCell align="right">Số ca</TableCell>
              <TableCell align="right">Đơn giá</TableCell>
              <TableCell align="right">Thành tiền</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.shiftBreakdown.map((row) => (
              <TableRow key={row.shiftType}>
                <TableCell>{row.label}</TableCell>
                <TableCell align="right">{row.count}</TableCell>
                <TableCell align="right">{formatCurrency(row.rate)}</TableCell>
                <TableCell align="right">{formatCurrency(row.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" gutterBottom>
        Ca đã duyệt trong tháng
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Ngày</TableCell>
              <TableCell>Ca</TableCell>
              <TableCell align="right">Đơn giá</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.approvedShifts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Chưa có ca nào được duyệt
                </TableCell>
              </TableRow>
            ) : (
              data.approvedShifts.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{formatVnDate(s.workDate)}</TableCell>
                  <TableCell>{s.label}</TableCell>
                  <TableCell align="right">{formatCurrency(s.rate)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" gutterBottom>
        Thưởng / Phạt
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Loại</TableCell>
              <TableCell>Số tiền</TableCell>
              <TableCell>Lý do</TableCell>
              <TableCell>Ngày ghi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.adjustments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Không có thưởng/phạt
                </TableCell>
              </TableRow>
            ) : (
              data.adjustments.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>
                    <Chip
                      size="small"
                      label={a.type === "BONUS" ? "Thưởng" : "Phạt"}
                      color={a.type === "BONUS" ? "success" : "error"}
                    />
                  </TableCell>
                  <TableCell>{formatCurrency(a.amount)}</TableCell>
                  <TableCell>{a.reason}</TableCell>
                  <TableCell>
                    {new Date(a.createdAt).toLocaleDateString("vi-VN")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function AdminSummaryTab({ month }: { month: string }) {
  const { data, isLoading } = useAdminPayrollSummary(month);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [form, setForm] = useState({
    userId: "",
    type: "BONUS" as PayrollAdjustmentType,
    amount: "",
    reason: "",
  });
  const { data: staff = [] } = useStaffForAssignment();
  const createAdj = useCreatePayrollAdjustment();
  const { showSuccess, showError } = useSnackbar();

  const employees = staff.filter((s) => s.role !== "ADMIN");

  const handleCreateAdjustment = async () => {
    try {
      await createAdj.mutateAsync({
        userId: form.userId,
        type: form.type,
        amount: Number(form.amount),
        reason: form.reason,
        month,
      });
      showSuccess("Đã ghi nhận thưởng/phạt");
      setAdjustOpen(false);
      setForm({ userId: "", type: "BONUS", amount: "", reason: "" });
    } catch (e) {
      showError(getApiErrorMessage(e));
    }
  };

  if (isLoading) return <PageLoader />;
  if (!data) return <Alert severity="error">Không tải được dữ liệu</Alert>;

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <SummaryCards
          totalShifts={data.totals.totalShifts}
          shiftSalary={data.totals.shiftSalary}
          bonuses={data.totals.bonuses}
          penalties={data.totals.penalties}
          netSalary={data.totals.netSalary}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAdjustOpen(true)}
        >
          Thưởng / Phạt
        </Button>
        <Button component={Link} to="/settings/payroll" variant="outlined">
          Cài đặt mức lương ca
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nhân viên</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell align="right">Công</TableCell>
              <TableCell align="right">Lương ca</TableCell>
              <TableCell align="right">Thưởng</TableCell>
              <TableCell align="right">Phạt</TableCell>
              <TableCell align="right">Thực nhận</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.employees.map((emp) => (
              <TableRow key={emp.user.id}>
                <TableCell>{emp.user.fullName}</TableCell>
                <TableCell>{getRoleLabel(emp.user.role)}</TableCell>
                <TableCell align="right">{emp.totalShifts}</TableCell>
                <TableCell align="right">{formatCurrency(emp.shiftSalary)}</TableCell>
                <TableCell align="right">{formatCurrency(emp.bonuses)}</TableCell>
                <TableCell align="right">{formatCurrency(emp.penalties)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  {formatCurrency(emp.netSalary)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={adjustOpen} onClose={() => setAdjustOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Thưởng / Phạt nhân viên</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Nhân viên</InputLabel>
            <Select
              label="Nhân viên"
              value={form.userId}
              onChange={(e) => setForm((f) => ({ ...f, userId: e.target.value }))}
            >
              {employees.map((e) => (
                <MenuItem key={e.id} value={e.id}>
                  {e.fullName} ({getRoleLabel(e.role)})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Loại</InputLabel>
            <Select
              label="Loại"
              value={form.type}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  type: e.target.value as PayrollAdjustmentType,
                }))
              }
            >
              <MenuItem value="BONUS">Thưởng</MenuItem>
              <MenuItem value="PENALTY">Phạt</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Số tiền (VNĐ)"
            type="number"
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
          />
          <TextField
            label="Lý do"
            multiline
            minRows={2}
            value={form.reason}
            onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdjustOpen(false)}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleCreateAdjustment}
            disabled={createAdj.isPending || !form.userId || !form.reason || !form.amount}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function SalaryPage() {
  const { user } = useAccount();
  const isAdmin = user?.role === "ADMIN";
  const isEmployee = user?.role === "STAFF" || user?.role === "CASHIER";
  const [month, setMonth] = useState(getCurrentMonth());
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <PaymentsIcon color="primary" />
        <Typography variant="h5" fontWeight={700}>
          Lương
        </Typography>
      </Box>

      <TextField
        type="month"
        label="Tháng"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        sx={{ mb: 2, minWidth: 200 }}
        slotProps={{ inputLabel: { shrink: true } }}
      />

      {isAdmin ? (
        <>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
            <Tab label="Tổng hợp" />
            <Tab label="Lương của tôi" />
          </Tabs>
          {tab === 0 ? (
            <AdminSummaryTab month={month} />
          ) : (
            <PayrollDetail month={month} />
          )}
        </>
      ) : isEmployee ? (
        <PayrollDetail month={month} />
      ) : (
        <Alert severity="warning">Bạn không có quyền xem lương</Alert>
      )}
    </Box>
  );
}
