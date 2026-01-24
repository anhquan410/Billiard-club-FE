import * as React from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import SettingsIcon from "@mui/icons-material/Settings";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import type { ExportReceipt } from "../../libs/types/warehouse.type";

export default function ExportReceipts() {
  const [searchText, setSearchText] = React.useState("");
  const [branch, setBranch] = React.useState("iBall");
  const [warehouse, setWarehouse] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [category, setCategory] = React.useState("all");
  const [dateRange, setDateRange] = React.useState(
    "13/01/2026 00:01 → 13/01/2026 23:59",
  );

  // Mock data (empty)
  const receipts: ExportReceipt[] = [];

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
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              bgcolor: "#f06292",
              "&:hover": { bgcolor: "#ec407a" },
              textTransform: "none",
            }}
          >
            Thêm mới phiếu
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            sx={{
              borderColor: "#f06292",
              color: "#f06292",
              textTransform: "none",
            }}
          >
            Import excel
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
          <Select value={branch} onChange={(e) => setBranch(e.target.value)}>
            <MenuItem value="iBall">iBall</MenuItem>
            <MenuItem value="branch2">Chi nhánh 2</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select
            value={warehouse}
            onChange={(e) => setWarehouse(e.target.value)}
            displayEmpty
          >
            <MenuItem value="all">Chọn kho</MenuItem>
            <MenuItem value="iball">Kho iBall</MenuItem>
            <MenuItem value="main">Kho chính</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            displayEmpty
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
          >
            <MenuItem value="all">Phân loại</MenuItem>
            <MenuItem value="export">Xuất hàng</MenuItem>
            <MenuItem value="return">Trả hàng</MenuItem>
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
              <TableCell>Mã hóa đơn</TableCell>
              <TableCell>Chi nhánh</TableCell>
              <TableCell>Kho xuất</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Phân loại</TableCell>
              <TableCell>Tình trạng</TableCell>
              <TableCell>Sản phẩm imei</TableCell>
              <TableCell>Diễn giải</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {receipts.length === 0 ? (
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
              receipts.map((receipt, index) => (
                <TableRow key={receipt.id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{receipt.code}</TableCell>
                  <TableCell>{receipt.invoiceCode || "-"}</TableCell>
                  <TableCell>{receipt.branch}</TableCell>
                  <TableCell>{receipt.exportWarehouse}</TableCell>
                  <TableCell>{receipt.createdDate}</TableCell>
                  <TableCell>{receipt.category}</TableCell>
                  <TableCell>{receipt.status}</TableCell>
                  <TableCell>{receipt.products.join(", ")}</TableCell>
                  <TableCell>{receipt.note || "-"}</TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
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
