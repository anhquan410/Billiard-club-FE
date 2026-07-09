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
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import ProductDetailDialog from "../../components/WareHouse/ProductDetailDialog";
import { getCategoryLabel } from "../../libs/utils/productLabels";
import PageLoader from "../../components/common/PageLoader";
import { getProductImageUrl } from "../../libs/utils/productImage";

export default function InventoryManagementPage() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(
    null,
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const category = searchParams.get("category") || "ALL";
  const [categoryFilter, setCategoryFilter] = useState(category);

  // Khi mount lần đầu, nếu chưa có page/limit trên URL thì set mặc định chỉ với page/limit
  React.useEffect(() => {
    if (!searchParams.get("page") || !searchParams.get("limit")) {
      const params: Record<string, string> = {
        page: page.toString(),
        limit: limit.toString(),
      };
      if (category !== "ALL") {
        params.category = category;
      }
      setSearchParams(
        params,
        { replace: true },
      );
    }
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    setCategoryFilter(category);
  }, [category]);

  // Luôn truyền đủ 3 tham số cho useProduct, nếu không có category thì truyền rỗng chuỗi
  const { paginatedProducts, isLoadingProducts } = useProductPagination(
    page,
    limit,
    category !== "ALL" ? category : "",
  );

  if (isLoadingProducts || !paginatedProducts) {
    return <PageLoader color="#ff9800" />;
  }

  // Xử lý đổi trang
  const handlePageChange = (_e: React.ChangeEvent<unknown>, value: number) => {
    const params: Record<string, string> = {
      page: value.toString(),
      limit: limit.toString(),
    };
    if (category !== "ALL") {
      params.category = category;
    }
    setSearchParams(params);
  };

  // Xử lý đổi limit/trang
  const handleLimitChange = (e: any) => {
    const params: Record<string, string> = {
      page: "1",
      limit: e.target.value.toString(),
    };
    if (category !== "ALL") {
      params.category = category;
    }
    setSearchParams(params);
  };

  // Xử lý đổi category
  const handleCategoryChange = (e: any) => {
    setCategoryFilter(e.target.value);
  };

  const handleSearch = () => {
    const params: Record<string, string> = {
      page: "1",
      limit: limit.toString(),
    };
    if (categoryFilter !== "ALL") {
      params.category = categoryFilter;
    }
    setSearchParams(params);
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
            value={categoryFilter}
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
          onClick={handleSearch}
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
                      src={getProductImageUrl(item.imageUrl) ?? undefined}
                      sx={{
                        width: 50,
                        height: 50,
                        bgcolor: "#f5f5f5",
                        fontSize: "24px",
                        borderRadius: 2,
                      }}
                    >
                      {!item.imageUrl && (item.image || "📦")}
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
                        {Number(item.costPrice).toLocaleString("vi-VN")}
                        &nbsp;₫
                      </>
                    ) : (
                      0
                    )}
                  </TableCell>

                  <TableCell align="center">
                    {item.price > 0 ? (
                      <>
                        {Number(item.price).toLocaleString("vi-VN")}
                        &nbsp;₫
                      </>
                    ) : (
                      0
                    )}
                  </TableCell>

                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => setSelectedProduct(item)}
                    >
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

      <ProductDetailDialog
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onEdit={(productId) => navigate(`/warehouse/products/${productId}`)}
      />
    </Box>
  );
}
