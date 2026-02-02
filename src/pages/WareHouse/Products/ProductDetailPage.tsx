/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useProduct } from "../../../libs/hooks/useProduct";
import { useEffect, useState } from "react";
import { useAccount } from "../../../libs/hooks/useAccount";
import { Link, useNavigate, useParams } from "react-router-dom";

function ProductDetailPage() {
  const navigate = useNavigate();
  const { user } = useAccount();
  const { id } = useParams();
  const { product, isLoadingProduct, updateProduct } = useProduct(id);
  const isEditable = user?.role === "ADMIN";

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // Form State
  const [formValue, setFormValue] = useState({
    name: product?.name || "",
    category: product?.category || "",
    price: product?.price || "",
    status: product?.status || "",
    description: product?.description || "",
  });

  // Update form value when profile data loads (for edit mode)
  useEffect(() => {
    if (product && isEditable) {
      setFormValue({
        name: product.name || "",
        category: product.category || "",
        price: product.price || "",
        status: product.status || "",
        description: product.description || "",
      });
    }
  }, [product, isEditable]);

  // Handle form field changes
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      ...formValue,
      id: product.id,
      costPrice: product.costPrice,
      stock: product.stock,
      minStock: product.minStock,
      unit: product.unit,
      image: product.image,
      // Add any other required fields from ProductItem here if needed
    };
    updateProduct(
      { id: id as string, product: productData },
      {
        onSuccess: () => {
          setSnackbar({
            open: true,
            message: "Cập nhật thành công!",
            severity: "success",
          });
          navigate(`/warehouse/products`);
        },
        onError: (error, variable, context) => {
          setSnackbar({
            open: true,
            message: "Cập nhật thất bại!",
            severity: "error",
          });
          console.log(error, variable, context);
        },
      },
    );
  };

  if (isLoadingProduct) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Typography color="error">Không tìm thấy sản phẩm</Typography>
      </Box>
    );
  }

  return (
    <>
      <Paper sx={{ borderRadius: 3, padding: 3 }}>
        <Typography variant="h5" gutterBottom color="primary" sx={{ mb: 3 }}>
          Chi tiết sản phẩm
        </Typography>
        <Box
          component="form"
          display="flex"
          flexDirection="column"
          gap={3}
          onSubmit={handleSubmit}
        >
          <TextField
            name="name"
            label="Tên sản phẩm"
            value={formValue.name || ""}
            fullWidth
            onChange={handleInputChange}
          />
          <FormControl fullWidth>
            <InputLabel id="category-label">Danh mục</InputLabel>
            <Select
              labelId="category-label"
              name="category"
              label="Danh mục"
              value={formValue.category}
              onChange={handleInputChange}
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
          <TextField
            name="price"
            label="Giá bán"
            value={formValue.price?.toLocaleString("vi-VN") || ""}
            fullWidth
            onChange={handleInputChange}
          />

          <FormControl fullWidth>
            <InputLabel id="status-label">Trạng thái</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              label="Trạng thái"
              value={formValue.status}
              onChange={handleInputChange}
              MenuProps={{ disableScrollLock: true }}
            >
              <MenuItem value="AVAILABLE">Hàng có sẵn</MenuItem>
              <MenuItem value="OUT_OF_STOCK">Hết hàng</MenuItem>
              <MenuItem value="DISCONTINUED">Ngừng kinh doanh</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="description"
            label="Mô tả"
            value={formValue.description}
            multiline
            rows={4}
            fullWidth
            onChange={handleInputChange}
          />

          <Box display="flex" justifyContent="end" gap={2}>
            <Button
              type="button"
              color="primary"
              variant="contained"
              component={Link}
              to="/warehouse/products"
            >
              Quay lại
            </Button>
            <Button type="submit" color="success" variant="contained">
              Chỉnh sửa
            </Button>
          </Box>
        </Box>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ProductDetailPage;
