/* eslint-disable @typescript-eslint/no-explicit-any */
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import type { ProductItem } from "../../libs/types/warehouse.type";
import { useProductPagination } from "../../libs/hooks/useProduct";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";

export default function InventoryManagementPage() {
  const [searchText, setSearchText] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  // Khi mount lần đầu, nếu chưa có page/limit trên URL thì set mặc định chỉ với page/limit
  React.useEffect(() => {
    if (!searchParams.get("page") || !searchParams.get("limit")) {
      setSearchParams(
        { page: page.toString(), limit: limit.toString() },
        { replace: true },
      );
    }
    // eslint-disable-next-line
  }, []);

  // Lấy category từ URL nếu có
  const category = searchParams.get("category") || "ALL";

  // Luôn truyền đủ 3 tham số cho useProduct, nếu không có category thì truyền rỗng chuỗi
  const { paginatedProducts } = useProductPagination(
    page,
    limit,
    category !== "ALL" ? category : "",
  );

  if (!paginatedProducts) return <div>Loading...</div>;

  // Xử lý đổi trang
  const handlePageChange = (e: React.ChangeEvent<unknown>, value: number) => {
    setSearchParams({
      page: value.toString(),
      limit: limit.toString(),
    });
  };

  // Xử lý đổi limit/trang
  const handleLimitChange = (e: any) => {
    setSearchParams({ page: "1", limit: e.target.value.toString() });
  };

  // Xử lý đổi category
  const handleCategoryChange = (e: any) => {
    const newCategory = e.target.value;
    if (newCategory === "ALL") {
      // Xóa category khỏi URL, chỉ giữ page/limit
      setSearchParams({ page: "1", limit: limit.toString() });
    } else {
      setSearchParams({
        page: "1",
        limit: limit.toString(),
        category: newCategory,
      });
    }
  };

  // Hàm chuyển category code sang tên hiển thị
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "FOOD":
        return "Đồ ăn";
      case "BEVERAGE":
        return "Nước ngọt không gas";
      case "SERVICE":
        return "Dịch vụ";
      case "CIGARETTE":
        return "Thuốc lá";
      case "OTHER":
        return "Khác";
      case "EQUIPMENT":
        return "Thiết bị";
      case "SODA":
        return "Nước ngọt có gas";
      case "COFFEE":
        return "Cà phê";
      case "BEER":
        return "Bia";
      default:
        return category;
    }
  };

  return (
    <Box>
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
            value={category}
            onChange={handleCategoryChange}
            displayEmpty
            MenuProps={{ disableScrollLock: true }}
          >
            <MenuItem value="ALL">Tất cả</MenuItem>
            <MenuItem value="FOOD">Đồ ăn</MenuItem>
            <MenuItem value="BEVERAGE">Nước ngọt không gas</MenuItem>
            <MenuItem value="SODA">Nước ngọt có gas</MenuItem>
            <MenuItem value="COFFEE">Cà phê</MenuItem>
            <MenuItem value="BEER">Bia</MenuItem>
            <MenuItem value="SERVICE">Dịch vụ</MenuItem>
            <MenuItem value="EQUIPMENT">Thiết bị</MenuItem>
            <MenuItem value="CIGARETTE">Thuốc lá</MenuItem>
            <MenuItem value="OTHER">Khác</MenuItem>
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
              <TableCell>Danh mục</TableCell>
              <TableCell align="center">Đơn vị</TableCell>
              <TableCell align="center">Số lượng </TableCell>
              <TableCell align="center">Giá nhập trung bình</TableCell>
              <TableCell align="center">Giá nhập bán</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts?.items.map(
              (item: ProductItem, index: number) => (
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
                  <TableCell>{getCategoryLabel(item.category)}</TableCell>
                  <TableCell align="center">{item.unit || "-"}</TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: item.stock < 0 ? "error.main" : "text.primary",
                      fontWeight: 500,
                    }}
                  >
                    {item.stock}
                  </TableCell>
                  <TableCell align="center">
                    {item.costPrice > 0 ? (
                      <>
                        {item.costPrice.toLocaleString("vi-VN")}
                        &nbsp;₫
                      </>
                    ) : (
                      0
                    )}
                  </TableCell>

                  <TableCell align="center">
                    {item.price > 0 ? (
                      <>
                        {item.price.toLocaleString("vi-VN")}
                        &nbsp;₫
                      </>
                    ) : (
                      0
                    )}
                  </TableCell>

                  <TableCell align="center">
                    <IconButton size="small">
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ),
            )}
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
          1 - {limit} of {paginatedProducts?.total} items
        </Typography>
        <Pagination
          count={Math.ceil(paginatedProducts?.total / limit)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          sx={{
            "& .Mui-selected": {
              bgcolor: "#f06292 !important",
            },
          }}
        />
        <FormControl size="small" sx={{ minWidth: 100 }}>
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
