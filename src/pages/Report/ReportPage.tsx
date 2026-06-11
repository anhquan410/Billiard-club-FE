import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import RefreshIcon from "@mui/icons-material/Refresh";
import type { ReportPeriod, ReportQueryParams } from "../../libs/types/report.type";
import { formatCurrency } from "../../libs/utils/format";
import { getCategoryLabel } from "../../libs/utils/productLabels";
import { getDateRangeForPeriod } from "../../libs/utils/reportDate";
import {
  useExportReport,
  useReportDashboard,
} from "../../libs/hooks/useReport";
import { useSnackbar } from "../../libs/context/SnackbarContext";
import { getApiErrorMessage } from "../../libs/utils/apiError";
import PageLoader from "../../components/common/PageLoader";
import ReportSummaryCards from "./components/ReportSummaryCards";
import RevenueChart from "./components/RevenueChart";
import PaymentMethodChart from "./components/PaymentMethodChart";
import ReportDataTable from "./components/ReportDataTable";

const periodOptions: { value: ReportPeriod; label: string }[] = [
  { value: "TODAY", label: "Hôm nay" },
  { value: "WEEK", label: "7 ngày qua" },
  { value: "MONTH", label: "Tháng này" },
  { value: "QUARTER", label: "Quý này" },
  { value: "YEAR", label: "Năm nay" },
];

const defaultRange = getDateRangeForPeriod("MONTH");

export default function ReportPage() {
  const { showSnackbar } = useSnackbar();
  const [activeTab, setActiveTab] = useState(0);
  const [period, setPeriod] = useState<ReportPeriod>("MONTH");
  const [fromDate, setFromDate] = useState(defaultRange.fromDate);
  const [toDate, setToDate] = useState(defaultRange.toDate);
  const [appliedParams, setAppliedParams] = useState<ReportQueryParams>({
    fromDate: defaultRange.fromDate,
    toDate: defaultRange.toDate,
    period: "MONTH",
  });

  const { data, isLoading, isFetching, isError, error, refetch } =
    useReportDashboard(appliedParams);
  const { mutate: exportReportFile, isPending: isExporting } =
    useExportReport();

  const handlePeriodChange = (newPeriod: ReportPeriod) => {
    setPeriod(newPeriod);
    const range = getDateRangeForPeriod(newPeriod);
    setFromDate(range.fromDate);
    setToDate(range.toDate);
  };

  const handleApply = () => {
    setAppliedParams({ fromDate, toDate, period });
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleExport = () => {
    exportReportFile(appliedParams, {
      onSuccess: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `bao-cao-${appliedParams.fromDate}-${appliedParams.toDate}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
        showSnackbar("Xuất báo cáo thành công", "success");
      },
      onError: (err) => {
        showSnackbar(getApiErrorMessage(err, "Không thể xuất báo cáo"), "error");
      },
    });
  };

  if (isLoading) {
    return <PageLoader color="#607d8b" />;
  }

  if (isError || !data) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {getApiErrorMessage(error, "Không thể tải dữ liệu báo cáo")}
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
      {/* Header */}
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
          <BarChartIcon sx={{ color: "#607d8b", fontSize: 32 }} />
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Báo cáo
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data.periodLabel} · {data.fromDate} → {data.toDate}
            </Typography>
          </Box>
          {isFetching && !isLoading && (
            <CircularProgress size={18} sx={{ color: "#607d8b" }} />
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            sx={{ textTransform: "none" }}
            onClick={handleRefresh}
            disabled={isFetching}
          >
            Làm mới
          </Button>
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            sx={{
              textTransform: "none",
              bgcolor: "#607d8b",
              "&:hover": { bgcolor: "#455a64" },
            }}
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? "Đang xuất..." : "Xuất Excel"}
          </Button>
        </Box>
      </Paper>

      {/* Filters */}
      <Paper
        sx={{
          p: 2,
          mb: 2,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            value={period}
            onChange={(e) => handlePeriodChange(e.target.value as ReportPeriod)}
            MenuProps={{ disableScrollLock: true }}
          >
            {periodOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="Từ ngày"
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 160 }}
        />
        <TextField
          size="small"
          label="Đến ngày"
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 160 }}
        />

        <Button
          variant="contained"
          sx={{
            bgcolor: "#f06292",
            textTransform: "none",
            "&:hover": { bgcolor: "#ec407a" },
          }}
          onClick={handleApply}
          disabled={isFetching}
        >
          Áp dụng
        </Button>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(_e, v) => setActiveTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .Mui-selected": { color: "#607d8b !important" },
            "& .MuiTabs-indicator": { bgcolor: "#607d8b" },
          }}
        >
          <Tab label="Tổng quan" sx={{ textTransform: "none" }} />
          <Tab label="Doanh thu" sx={{ textTransform: "none" }} />
          <Tab label="Bàn & phiên chơi" sx={{ textTransform: "none" }} />
          <Tab label="Sản phẩm" sx={{ textTransform: "none" }} />
          <Tab label="Kho hàng" sx={{ textTransform: "none" }} />
        </Tabs>
      </Paper>

      {/* Tab: Tổng quan */}
      {activeTab === 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <ReportSummaryCards summary={data.summary} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 7 }}>
              <RevenueChart data={data.revenueByDay} />
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <PaymentMethodChart data={data.revenueByPaymentMethod} />
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Tab: Doanh thu */}
      {activeTab === 1 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 7 }}>
              <RevenueChart data={data.revenueByDay} />
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <PaymentMethodChart data={data.revenueByPaymentMethod} />
            </Grid>
          </Grid>
          <ReportDataTable
            title="Chi tiết doanh thu theo ngày"
            rows={[...data.revenueByDay].reverse()}
            columns={[
              { key: "date", label: "Ngày", render: (r) => r.date },
              {
                key: "table",
                label: "Tiền bàn",
                align: "right",
                render: (r) => formatCurrency(r.tableRevenue),
              },
              {
                key: "product",
                label: "Sản phẩm",
                align: "right",
                render: (r) => formatCurrency(r.productRevenue),
              },
              {
                key: "total",
                label: "Tổng",
                align: "right",
                render: (r) => (
                  <Typography fontWeight={600}>
                    {formatCurrency(r.total)}
                  </Typography>
                ),
              },
            ]}
          />
        </Box>
      )}

      {/* Tab: Bàn & phiên chơi */}
      {activeTab === 2 && (
        <ReportDataTable
          title="Hiệu suất sử dụng bàn"
          rows={data.tableUsage}
          columns={[
            { key: "stt", label: "STT", render: (_r, i) => i + 1 },
            { key: "name", label: "Bàn", render: (r) => r.tableName },
            {
              key: "sessions",
              label: "Số phiên",
              align: "center",
              render: (r) => r.sessionCount,
            },
            {
              key: "hours",
              label: "Tổng giờ",
              align: "center",
              render: (r) => `${r.totalHours}h`,
            },
            {
              key: "tableFee",
              label: "Tiền bàn",
              align: "right",
              render: (r) => formatCurrency(r.tableFeeRevenue),
            },
            {
              key: "product",
              label: "Sản phẩm",
              align: "right",
              render: (r) => formatCurrency(r.productRevenue),
            },
            {
              key: "total",
              label: "Tổng DT",
              align: "right",
              render: (r) => (
                <Typography fontWeight={600}>
                  {formatCurrency(r.totalRevenue)}
                </Typography>
              ),
            },
            {
              key: "totalAfterDiscount",
              label: "Tổng DT sau giảm giá",
              align: "right",
              render: (r) => (
                <Typography fontWeight={600} color="success.main">
                  {formatCurrency(r.totalRevenueAfterDiscount)}
                </Typography>
              ),
            },
          ]}
        />
      )}

      {/* Tab: Sản phẩm */}
      {activeTab === 3 && (
        <ReportDataTable
          title="Top sản phẩm bán chạy"
          rows={data.topProducts}
          columns={[
            { key: "stt", label: "STT", render: (_r, i) => i + 1 },
            { key: "name", label: "Sản phẩm", render: (r) => r.productName },
            {
              key: "category",
              label: "Danh mục",
              render: (r) => getCategoryLabel(r.category),
            },
            {
              key: "qty",
              label: "SL bán",
              align: "center",
              render: (r) => r.quantitySold,
            },
            {
              key: "revenue",
              label: "Doanh thu",
              align: "right",
              render: (r) => formatCurrency(r.revenue),
            },
            {
              key: "cost",
              label: "Giá vốn",
              align: "right",
              render: (r) => formatCurrency(r.cost),
            },
            {
              key: "profit",
              label: "Lợi nhuận",
              align: "right",
              render: (r) => (
                <Typography fontWeight={600} color="success.main">
                  {formatCurrency(r.profit)}
                </Typography>
              ),
            },
          ]}
        />
      )}

      {/* Tab: Kho hàng */}
      {activeTab === 4 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper sx={{ p: 2, borderTop: "4px solid #4caf50" }}>
                <Typography variant="body2" color="text.secondary">
                  Tổng nhập kho
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {formatCurrency(data.inventorySummary.totalImportValue)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {data.inventorySummary.importReceiptCount} phiếu nhập
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper sx={{ p: 2, borderTop: "4px solid #f44336" }}>
                <Typography variant="body2" color="text.secondary">
                  Tổng xuất kho
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {formatCurrency(data.inventorySummary.totalExportValue)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {data.inventorySummary.exportReceiptCount} phiếu xuất
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper sx={{ p: 2, borderTop: "4px solid #ff9800" }}>
                <Typography variant="body2" color="text.secondary">
                  Sắp hết hàng
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {data.inventorySummary.lowStockProductCount}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  sản phẩm dưới tồn tối thiểu
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper sx={{ p: 2, borderTop: "4px solid #9e9e9e" }}>
                <Typography variant="body2" color="text.secondary">
                  Hết hàng
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {data.inventorySummary.outOfStockProductCount}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  sản phẩm tồn = 0
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <ReportDataTable
            title="Sản phẩm cần nhập thêm"
            rows={data.lowStockProducts}
            columns={[
              { key: "stt", label: "STT", render: (_r, i) => i + 1 },
              { key: "name", label: "Sản phẩm", render: (r) => r.productName },
              {
                key: "stock",
                label: "Tồn hiện tại",
                align: "center",
                render: (r) => (
                  <Typography
                    fontWeight={600}
                    color={r.currentStock === 0 ? "error.main" : "warning.main"}
                  >
                    {r.currentStock}
                  </Typography>
                ),
              },
              {
                key: "min",
                label: "Tồn tối thiểu",
                align: "center",
                render: (r) => r.minStock,
              },
              {
                key: "unit",
                label: "Đơn vị",
                align: "center",
                render: (r) => r.unit,
              },
            ]}
          />
        </Box>
      )}
    </Box>
  );
}
