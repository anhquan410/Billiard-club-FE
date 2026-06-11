/* eslint-disable @typescript-eslint/no-explicit-any */
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Pagination,
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
import { format } from "date-fns";
import * as React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useReceiptPagination } from "../../../libs/hooks/useReceipt";
import { vi } from "date-fns/locale";
import PageLoader from "../../../components/common/PageLoader";

export default function ImportReceipts() {
  const [searchText, setSearchText] = React.useState("");
  const [branch, setBranch] = React.useState("iBall");
  const [warehouse, setWarehouse] = React.useState("Kho iBall");
  const [status, setStatus] = React.useState("all");
  const [category, setCategory] = React.useState("import");
  const [dateRange, setDateRange] = React.useState(
    "13/01/2026 00:01 → 13/01/2026 23:59",
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const { paginatedStockMovements, isLoadingStockMovements } =
    useReceiptPagination(page, limit, "IMPORT");

  // Khi mount lần đầu, nếu chưa có page/limit trên URL thì set mặc định chỉ với page/limit
  React.useEffect(() => {
    if (!searchParams.get("page") || !searchParams.get("limit")) {
      setSearchParams(
        { page: page.toString(), limit: limit.toString(), type: "IMPORT" },
        { replace: true },
      );
    }
    // eslint-disable-next-line
  }, []);

  if (isLoadingStockMovements) {
    return <PageLoader color="#ff9800" />;
  }

  // Format ngày giờ theo định dạng Việt Nam
  const formatVietnameseDateTime = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm:ss", { locale: vi });
  };

  // Xử lý đổi trang
  const handlePageChange = (_e: React.ChangeEvent<unknown>, value: number) => {
    const params: Record<string, string> = {
      page: value.toString(),
      limit: limit.toString(),
      type: "IMPORT",
    };
    setSearchParams(params);
  };

  // Xử lý đổi limit/trang
  const handleLimitChange = (e: any) => {
    const params: Record<string, string> = {
      page: "1",
      limit: e.target.value.toString(),
      type: "IMPORT",
    };
    setSearchParams(params);
  };

  return (
    <Box>
      {/* Header Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          bgcolor: "white",
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<MoreVertIcon />}
            sx={{
              borderColor: "#f06292",
              color: "#f06292",
              textTransform: "none",
              "&:hover": {
                borderColor: "#ec407a",
                bgcolor: "#fce4ec",
              },
            }}
          >
            Chức năng khác
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              bgcolor: "#f06292",
              "&:hover": { bgcolor: "#ec407a" },
              textTransform: "none",
            }}
            component={Link}
            to="create"
          >
            Thêm mới phiếu
          </Button>
        </Box>

        <IconButton
          sx={{
            bgcolor: "#f5f5f5",
            "&:hover": { bgcolor: "#e0e0e0" },
          }}
        >
          <SettingsIcon />
        </IconButton>
      </Box>

      {/* Filters */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          p: 2,
          bgcolor: "white",
          borderTop: "1px solid #e0e0e0",
          flexWrap: "wrap",
        }}
      >
        <TextField
          size="small"
          placeholder="Mã phiếu xuất, mã hóa đơn"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ flexGrow: 1, minWidth: 200 }}
        />

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            MenuProps={{ disableScrollLock: true }}
          >
            <MenuItem value="iBall">iBall</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select
            value={warehouse}
            onChange={(e) => setWarehouse(e.target.value)}
            displayEmpty
            MenuProps={{ disableScrollLock: true }}
          >
            <MenuItem value="Kho iBall">Kho iBall</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            displayEmpty
            MenuProps={{ disableScrollLock: true }}
          >
            <MenuItem value="all">Trạng thái phiếu</MenuItem>
            <MenuItem value="completed">Hoàn thành</MenuItem>
            <MenuItem value="pending">Đang xử lý</MenuItem>
            <MenuItem value="cancelled">Đã hủy</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            displayEmpty
            MenuProps={{ disableScrollLock: true }}
          >
            <MenuItem value="import">Nhập hàng</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size="small"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          sx={{ minWidth: 280 }}
        />

        <Button
          variant="contained"
          sx={{
            bgcolor: "#f06292",
            "&:hover": { bgcolor: "#ec407a" },
            textTransform: "none",
          }}
        >
          Tìm kiếm
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ mt: 0 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Mã phiếu</TableCell>
              <TableCell>Người tạo</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Sản phẩm </TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Tổng giá nhập</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedStockMovements?.stockItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} align="center" sx={{ py: 8 }}>
                  <Box sx={{ textAlign: "center", color: "text.secondary" }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      📦
                    </Typography>
                    <Typography>Trống</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paginatedStockMovements?.stockItems.map(
                (receipt: any, index: number) => (
                  <TableRow key={receipt.id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{receipt.id}</TableCell>
                    <TableCell>{receipt.user.fullName}</TableCell>
                    <TableCell>
                      {formatVietnameseDateTime(receipt.createdAt)}
                    </TableCell>
                    <TableCell>{receipt.product.name}</TableCell>
                    <TableCell>{receipt.quantity}</TableCell>
                    <TableCell>
                      {Number(receipt.totalValue).toLocaleString("vi-VN")}đ
                    </TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ),
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          bgcolor: "white",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          1 - {limit} of {paginatedStockMovements?.total} items
        </Typography>
        <Pagination
          count={Math.ceil(paginatedStockMovements?.total / limit)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          sx={{
            "& . Mui-selected": {
              bgcolor: "#f06292 !important",
              color: "white",
            },
          }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={limit}
            onChange={handleLimitChange}
            MenuProps={{ disableScrollLock: true }}
          >
            <MenuItem value={10}>10 / trang</MenuItem>
            <MenuItem value={20}>20 / trang</MenuItem>
            <MenuItem value={50}>50 / trang</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
