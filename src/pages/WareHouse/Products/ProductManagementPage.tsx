/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import {
  Box,
  Button,
  TextField,
  InputAdornment,
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
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  Menu,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SettingsIcon from "@mui/icons-material/Settings";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  useProduct,
  useProductPagination,
} from "../../../libs/hooks/useProduct";
import type { ProductItem } from "../../../libs/types/warehouse.type";
import DeleteProductDialog from "../../../components/WareHouse/DeleteProductDialog";
import { getCategoryLabel } from "../../../libs/utils/productLabels";
import { useSnackbar } from "../../../libs/context/SnackbarContext";
import PageLoader from "../../../components/common/PageLoader";

export default function ProductManagementPage() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const [searchText, setSearchText] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const { deleteProductById } = useProduct();

  // State for delete confirmation dialog
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteProductById(deleteId, {
        onSuccess: () => {
          showSuccess("Xóa sản phẩm thành công!");
          setOpenDialog(false);
          setDeleteId(null);
        },
        onError: () => {
          showError("Xóa sản phẩm thất bại!");
        },
      });
    }
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
    setDeleteId(null);
  };

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

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedProducts(
        paginatedProducts.items.map((p: ProductItem) => p.id),
      );
    } else {
      setSelectedProducts([]);
    }
  };

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

  const handleSelectOne = (id: string) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter((pid) => pid !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLElement>,
    productId: string,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedProductId(productId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedProductId(null);
  };

  const isAllSelected =
    selectedProducts.length === paginatedProducts.items.length &&
    paginatedProducts.items.length > 0;
  const isSomeSelected =
    selectedProducts.length > 0 &&
    selectedProducts.length < paginatedProducts.items.length;

  return (
    <>
      <Box>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            bgcolor: "white",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Quản lý sản phẩm
          </Typography>

          <IconButton
            sx={{
              bgcolor: "#f5f5f5",
              "&:hover": { bgcolor: "#e0e0e0" },
            }}
          >
            <SettingsIcon />
          </IconButton>
        </Box>

        {/* Actions & Search */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            bgcolor: "white",
            borderBottom: "1px solid #e0e0e0",
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
              to="/warehouse/products/create-product"
            >
              Thêm mới
            </Button>
          </Box>

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
        </Box>

        {/* Table */}
        <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
          <Table>
            <TableHead sx={{ bgcolor: "#f5f5f5" }}>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isSomeSelected}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>STT</TableCell>
                <TableCell>Ảnh</TableCell>
                <TableCell>Sản phẩm</TableCell>
                <TableCell>Danh mục</TableCell>
                <TableCell align="right">Giá bán</TableCell>
                <TableCell align="center">Sử dụng</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProducts?.items.map(
                (product: ProductItem, index: number) => (
                  <TableRow
                    key={product.id}
                    hover
                    sx={{
                      "&:hover": {
                        bgcolor: "#fafafa",
                      },
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectOne(product.id)}
                      />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Avatar
                        sx={{
                          width: 60,
                          height: 60,
                          bgcolor: "#f5f5f5",
                          fontSize: "28px",
                          borderRadius: 2,
                        }}
                      >
                        {product.image}
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={500}>{product.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {getCategoryLabel(product.category)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight={500}>
                        {Number(product.price).toLocaleString("vi-VN")}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        sx={{
                          color: "#4caf50",
                        }}
                      >
                        {product.status === "AVAILABLE" ? (
                          <CheckCircleIcon fontSize="small" />
                        ) : (
                          <CancelIcon fontSize="small" color="error" />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.5,
                          justifyContent: "center",
                        }}
                      >
                        <IconButton
                          onClick={() =>
                            navigate(`/warehouse/products/${product.id}`)
                          }
                          size="small"
                          sx={{
                            border: "1px solid #e0e0e0",
                            borderRadius: 1,
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => handleOpenMenu(e, product.id)}
                          sx={{
                            border: "1px solid #e0e0e0",
                            borderRadius: 1,
                          }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          disableScrollLock={true}
        >
          <MenuItem
            onClick={() => navigate(`/warehouse/products/${selectedProductId}`)}
          >
            <ListItemIcon>
              <VisibilityIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Xem chi tiết</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => navigate(`/warehouse/products/${selectedProductId}`)}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Chỉnh sửa</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleDelete(selectedProductId!.toString())}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText sx={{ color: "error.main" }}>Xóa</ListItemText>
          </MenuItem>
        </Menu>

        {/* Pagination */}
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
            1 - {limit} of {paginatedProducts?.total} items
          </Typography>
          <Pagination
            count={Math.ceil(paginatedProducts?.total / limit)}
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
      <DeleteProductDialog
        open={openDialog}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
