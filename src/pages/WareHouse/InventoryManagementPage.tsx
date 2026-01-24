import * as React from "react";
import {
  Box,
  Button,
  TextField,
  InputAdornment,
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
  Avatar,
  IconButton,
  Pagination,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SettingsIcon from "@mui/icons-material/Settings";
import type { InventoryItem } from "../../libs/types/warehouse.type";

export default function InventoryManagementPage() {
  const [searchText, setSearchText] = React.useState("");
  const [warehouse, setWarehouse] = React.useState("all");
  const [page, setPage] = React.useState(1);

  // Mock data
  const inventoryItems: InventoryItem[] = [
    {
      id: 1,
      name: "Khăn lạnh",
      image: "🧻",
      warehouse: "Kho iBall",
      unit: "",
      quantity: -4,
      exportedQuantity: 0,
      averageImportPrice: 0,
      actualQuantity: -4,
    },
    {
      id: 2,
      name: "Bò húc",
      image: "🥫",
      warehouse: "Kho iBall",
      unit: "",
      quantity: 0,
      exportedQuantity: 0,
      averageImportPrice: 0,
      actualQuantity: 0,
    },
    {
      id: 3,
      name: "7 up",
      image: "🥤",
      warehouse: "Kho iBall",
      unit: "",
      quantity: 54,
      exportedQuantity: 0,
      averageImportPrice: 6428,
      actualQuantity: 54,
    },
    {
      id: 4,
      name: "Ô Long",
      image: "🍵",
      warehouse: "Kho iBall",
      unit: "",
      quantity: -3,
      exportedQuantity: 0,
      averageImportPrice: 7291,
      actualQuantity: -3,
    },
    {
      id: 5,
      name: "Trà xanh 0 độ",
      image: "🍵",
      warehouse: "Kho iBall",
      unit: "",
      quantity: 0,
      exportedQuantity: 0,
      averageImportPrice: 7339,
      actualQuantity: 0,
    },
    {
      id: 6,
      name: "Coca - Pepsi",
      image: "🥤",
      warehouse: "Kho iBall",
      unit: "",
      quantity: 6,
      exportedQuantity: 0,
      averageImportPrice: 8088,
      actualQuantity: 6,
    },
    {
      id: 7,
      name: "Sting vàng",
      image: "⚡",
      warehouse: "Kho iBall",
      unit: "",
      quantity: 36,
      exportedQuantity: 0,
      averageImportPrice: 7334,
      actualQuantity: 36,
    },
  ];

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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            bgcolor: "#f06292",
            "&:hover": { bgcolor: "#ec407a" },
            textTransform: "none",
          }}
        >
          Thêm phiếu nhập
        </Button>

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
        }}
      >
        <TextField
          size="small"
          placeholder="Tên"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ flexGrow: 1, maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={{ minWidth: 200 }}>
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

        <Button
          variant="contained"
          startIcon={<SearchIcon />}
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
              <TableCell>Ảnh</TableCell>
              <TableCell>Sản phẩm</TableCell>
              <TableCell>Tên kho</TableCell>
              <TableCell>Đơn vị</TableCell>
              <TableCell align="right">Số lượng</TableCell>
              <TableCell align="right">Số lượng chờ xuất</TableCell>
              <TableCell align="right">Giá nhập trung bình</TableCell>
              <TableCell align="right">SL dụng tích</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventoryItems.map((item, index) => (
              <TableRow key={item.id} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Avatar
                    sx={{
                      width: 50,
                      height: 50,
                      bgcolor: "#f5f5f5",
                      fontSize: "24px",
                    }}
                  >
                    {item.image}
                  </Avatar>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={500}>{item.name}</Typography>
                </TableCell>
                <TableCell>{item.warehouse}</TableCell>
                <TableCell>{item.unit || "-"}</TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color: item.quantity < 0 ? "error.main" : "text.primary",
                    fontWeight: 500,
                  }}
                >
                  {item.quantity}
                </TableCell>
                <TableCell align="right">{item.exportedQuantity}</TableCell>
                <TableCell align="right">
                  {item.averageImportPrice > 0 ? (
                    <>
                      {item.averageImportPrice.toLocaleString("vi-VN")}
                      <IconButton size="small" color="error">
                        <Typography fontSize="12px">🗑</Typography>
                      </IconButton>
                    </>
                  ) : (
                    0
                  )}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color:
                      item.actualQuantity < 0 ? "error.main" : "text.primary",
                  }}
                >
                  {item.actualQuantity} (chi? c)
                </TableCell>
                <TableCell>
                  <IconButton size="small">
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          bgcolor: "white",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          1 - 10 of 48 items
        </Typography>
        <Pagination
          count={5}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
          sx={{
            "& . Mui-selected": {
              bgcolor: "#f06292 !important",
            },
          }}
        />
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <Select defaultValue={10}>
            <MenuItem value={10}>10 / trang</MenuItem>
            <MenuItem value={20}>20 / trang</MenuItem>
            <MenuItem value={50}>50 / trang</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
