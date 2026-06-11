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
  Chip,
} from "@mui/material";
import CalculateIcon from "@mui/icons-material/Calculate";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import { formatCurrency } from "../../libs/utils/format";
import {
  getDebtStatusLabel,
  getDebtTypeLabel,
  getTransactionCategoryLabel,
} from "../../libs/utils/moduleLabels";
import type {
  AccountingTransaction,
  DebtRecord,
  TransactionCategory,
  TransactionType,
} from "../../libs/types/accounting.type";
import { getDateRangeForPeriod } from "../../libs/utils/reportDate";
import {
  useAccountingDashboard,
  useCreateAccountingTransaction,
} from "../../libs/hooks/useAccounting";
import { useSnackbar } from "../../libs/context/SnackbarContext";
import { getApiErrorMessage } from "../../libs/utils/apiError";
import PageLoader from "../../components/common/PageLoader";
import type { AccountingQueryParams } from "../../libs/api/accounting";

const defaultRange = getDateRangeForPeriod("MONTH");

function SummaryCard({
  title,
  value,
  subtitle,
  color,
}: {
  title: string;
  value: string;
  subtitle?: string;
  color: string;
}) {
  return (
    <Paper sx={{ p: 2, height: "100%", borderTop: `4px solid ${color}` }}>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5 }}>
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Paper>
  );
}

const statusColor = (status: DebtRecord["status"]) => {
  switch (status) {
    case "PAID":
      return "success";
    case "OVERDUE":
      return "error";
    case "PARTIAL":
      return "warning";
    default:
      return "default";
  }
};

const categoryOptions: TransactionCategory[] = [
  "TABLE_REVENUE",
  "PRODUCT_SALES",
  "IMPORT_COST",
  "SALARY",
  "UTILITIES",
  "MAINTENANCE",
  "OTHER",
];

export default function AccountingPage() {
  const { showSnackbar } = useSnackbar();
  const [activeTab, setActiveTab] = useState(0);
  const [fromDate, setFromDate] = useState(defaultRange.fromDate);
  const [toDate, setToDate] = useState(defaultRange.toDate);
  const [typeFilter, setTypeFilter] = useState<"ALL" | TransactionType>("ALL");
  const [appliedParams, setAppliedParams] = useState<AccountingQueryParams>({
    fromDate: defaultRange.fromDate,
    toDate: defaultRange.toDate,
  });
  const [openCreate, setOpenCreate] = useState(false);
  const [form, setForm] = useState({
    type: "INCOME" as TransactionType,
    category: "OTHER" as TransactionCategory,
    description: "",
    amount: "",
    paymentMethod: "CASH",
  });

  const { data, isLoading, isFetching, isError, error, refetch } =
    useAccountingDashboard(appliedParams);
  const { mutate: createTransaction, isPending: isCreating } =
    useCreateAccountingTransaction();

  const filteredTransactions =
    typeFilter === "ALL"
      ? (data?.transactions ?? [])
      : (data?.transactions ?? []).filter((t) => t.type === typeFilter);

  const handleApply = () => {
    setAppliedParams({ fromDate, toDate });
  };

  const handleCreate = () => {
    const amount = Number(form.amount);
    if (!form.description.trim() || !amount || amount <= 0) {
      showSnackbar("Vui lòng nhập đầy đủ thông tin phiếu", "warning");
      return;
    }

    createTransaction(
      {
        type: form.type,
        category: form.category,
        description: form.description.trim(),
        amount,
        paymentMethod: form.paymentMethod as
          | "CASH"
          | "BANK_TRANSFER"
          | "MOMO"
          | "VNPAY"
          | "OTHER",
      },
      {
        onSuccess: () => {
          showSnackbar("Tạo phiếu thành công", "success");
          setOpenCreate(false);
          setForm({
            type: "INCOME",
            category: "OTHER",
            description: "",
            amount: "",
            paymentMethod: "CASH",
          });
        },
        onError: (err) => {
          showSnackbar(getApiErrorMessage(err, "Không thể tạo phiếu"), "error");
        },
      },
    );
  };

  if (isLoading) {
    return <PageLoader color="#3f51b5" />;
  }

  if (isError || !data) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {getApiErrorMessage(error, "Không thể tải dữ liệu kế toán")}
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
          <CalculateIcon sx={{ color: "#3f51b5", fontSize: 32 }} />
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Kế toán
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data.fromDate} → {data.toDate}
            </Typography>
          </Box>
          {isFetching && <CircularProgress size={18} sx={{ color: "#3f51b5" }} />}
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
              bgcolor: "#3f51b5",
              textTransform: "none",
              "&:hover": { bgcolor: "#303f9f" },
            }}
          >
            Thêm phiếu thu/chi
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            title="Tổng thu"
            value={formatCurrency(data.summary.totalIncome)}
            color="#4caf50"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            title="Tổng chi"
            value={formatCurrency(data.summary.totalExpense)}
            color="#f44336"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            title="Lợi nhuận ròng"
            value={formatCurrency(data.summary.netProfit)}
            color="#3f51b5"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            title="Quỹ tiền mặt"
            value={formatCurrency(data.summary.cashBalance)}
            subtitle={`${data.summary.transactionCount} giao dịch`}
            color="#ff9800"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <SummaryCard
            title="Công nợ phải thu"
            value={formatCurrency(data.summary.receivableTotal)}
            color="#2196f3"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <SummaryCard
            title="Công nợ phải trả"
            value={formatCurrency(data.summary.payableTotal)}
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(_e, v) => setActiveTab(v)}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .Mui-selected": { color: "#3f51b5 !important" },
            "& .MuiTabs-indicator": { bgcolor: "#3f51b5" },
          }}
        >
          <Tab label="Sổ thu chi" sx={{ textTransform: "none" }} />
          <Tab label="Công nợ" sx={{ textTransform: "none" }} />
        </Tabs>
      </Paper>

      {activeTab === 0 && (
        <Paper>
          <Box
            sx={{
              p: 2,
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <TextField
              size="small"
              label="Từ ngày"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              size="small"
              label="Đến ngày"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <Select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(e.target.value as typeof typeFilter)
                }
                MenuProps={{ disableScrollLock: true }}
              >
                <MenuItem value="ALL">Tất cả</MenuItem>
                <MenuItem value="INCOME">Phiếu thu</MenuItem>
                <MenuItem value="EXPENSE">Phiếu chi</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              sx={{ bgcolor: "#3f51b5", textTransform: "none" }}
              onClick={handleApply}
              disabled={isFetching}
            >
              Áp dụng
            </Button>
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell>Mã phiếu</TableCell>
                  <TableCell>Loại</TableCell>
                  <TableCell>Danh mục</TableCell>
                  <TableCell>Diễn giải</TableCell>
                  <TableCell>PTTT</TableCell>
                  <TableCell align="right">Số tiền</TableCell>
                  <TableCell>Người tạo</TableCell>
                  <TableCell>Thời gian</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        Chưa có giao dịch trong khoảng thời gian này
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((row: AccountingTransaction) => (
                    <TableRow key={row.id} hover>
                      <TableCell>{row.code}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.type === "INCOME" ? "Thu" : "Chi"}
                          size="small"
                          color={row.type === "INCOME" ? "success" : "error"}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {getTransactionCategoryLabel(row.category)}
                      </TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell>{row.paymentMethod}</TableCell>
                      <TableCell align="right">
                        <Typography
                          fontWeight={600}
                          color={
                            row.type === "INCOME" ? "success.main" : "error.main"
                          }
                        >
                          {row.type === "INCOME" ? "+" : "-"}
                          {formatCurrency(row.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell>{row.createdBy}</TableCell>
                      <TableCell>
                        {new Date(row.createdAt).toLocaleString("vi-VN")}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {activeTab === 1 && (
        <Paper>
          <TableContainer>
            <Table size="small">
              <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell>Loại</TableCell>
                  <TableCell>Đối tác</TableCell>
                  <TableCell>SĐT</TableCell>
                  <TableCell align="right">Tổng nợ</TableCell>
                  <TableCell align="right">Đã trả</TableCell>
                  <TableCell align="right">Còn lại</TableCell>
                  <TableCell>Hạn thanh toán</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Ghi chú</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.debts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        Chưa có công nợ nào
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.debts.map((row: DebtRecord) => (
                    <TableRow key={row.id} hover>
                      <TableCell>
                        <Chip
                          label={getDebtTypeLabel(row.type)}
                          size="small"
                          color={row.type === "RECEIVABLE" ? "info" : "warning"}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={500}>{row.partnerName}</Typography>
                      </TableCell>
                      <TableCell>{row.phone || "-"}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(row.totalAmount)}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(row.paidAmount)}
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={600} color="error.main">
                          {formatCurrency(row.remainingAmount)}
                        </Typography>
                      </TableCell>
                      <TableCell>{row.dueDate}</TableCell>
                      <TableCell>
                        <Chip
                          label={getDebtStatusLabel(row.status)}
                          size="small"
                          color={statusColor(row.status)}
                        />
                      </TableCell>
                      <TableCell>{row.note || "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Dialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        maxWidth="sm"
        fullWidth
        disableScrollLock
      >
        <DialogTitle>Thêm phiếu thu/chi</DialogTitle>
        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Loại phiếu</InputLabel>
            <Select
              label="Loại phiếu"
              value={form.type}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  type: e.target.value as TransactionType,
                }))
              }
              MenuProps={{ disableScrollLock: true }}
            >
              <MenuItem value="INCOME">Phiếu thu</MenuItem>
              <MenuItem value="EXPENSE">Phiếu chi</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Danh mục</InputLabel>
            <Select
              label="Danh mục"
              value={form.category}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  category: e.target.value as TransactionCategory,
                }))
              }
              MenuProps={{ disableScrollLock: true }}
            >
              {categoryOptions.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {getTransactionCategoryLabel(cat)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Diễn giải"
            fullWidth
            size="small"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
          />
          <TextField
            label="Số tiền"
            type="number"
            fullWidth
            size="small"
            value={form.amount}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, amount: e.target.value }))
            }
          />
          <FormControl fullWidth size="small">
            <InputLabel>Phương thức thanh toán</InputLabel>
            <Select
              label="Phương thức thanh toán"
              value={form.paymentMethod}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, paymentMethod: e.target.value }))
              }
              MenuProps={{ disableScrollLock: true }}
            >
              <MenuItem value="CASH">Tiền mặt</MenuItem>
              <MenuItem value="BANK_TRANSFER">Chuyển khoản</MenuItem>
              <MenuItem value="MOMO">MoMo</MenuItem>
              <MenuItem value="VNPAY">VNPay</MenuItem>
              <MenuItem value="OTHER">Khác</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Hủy</Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "#3f51b5" }}
            onClick={handleCreate}
            disabled={isCreating}
          >
            {isCreating ? "Đang lưu..." : "Lưu phiếu"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
