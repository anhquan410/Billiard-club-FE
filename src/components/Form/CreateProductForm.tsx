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
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAccount } from "../../libs/hooks/useAccount";
import { useProduct } from "../../libs/hooks/useProduct";
import type {
  ProductCategory,
  ProductStatus,
} from "../../libs/types/warehouse.type";

function CreateProductForm() {
  const navigate = useNavigate();
  const { user } = useAccount();
  const isEditable = user?.role === "ADMIN";
  const { createProduct, isLoadingProduct } = useProduct();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // Form State
  const [formValue, setFormValue] = useState({
    name: "",
    description: "",
    category: "OTHER",
    costPrice: "",
    price: "",
    stock: "",
    status: "AVAILABLE",
  });

  // Handle form field changes
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name: formValue.name,
      description: formValue.description,
      category: formValue.category as ProductCategory,
      costPrice: Number(formValue.costPrice),
      price: Number(formValue.price),
      stock: Number(formValue.stock),
      minStock: 0,
      unit: "Cái",
      image: "",
      status: formValue.status as ProductStatus,
    };
    createProduct(
      { product: productData },
      {
        onSuccess: () => {
          setSnackbar({
            open: true,
            message: "Tạo sản phẩm thành công!",
            severity: "success",
          });
          navigate(`/warehouse/products`);
        },
        onError: (error, variable, context) => {
          setSnackbar({
            open: true,
            message: "Tạo sản phẩm thất bại!",
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

  if (isEditable) {
    return (
      <>
        <Paper sx={{ borderRadius: 3, padding: 3, pb: 7 }}>
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
              fullWidth
              onChange={handleInputChange}
            />
            <FormControl fullWidth>
              <InputLabel id="category-label">Danh mục</InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={formValue.category}
                label="Danh mục"
                onChange={handleInputChange}
                MenuProps={{ disableScrollLock: true }}
              >
                <MenuItem value="FOOD">Đồ ăn</MenuItem>
                <MenuItem value="BEVERAGE">Đồ uống</MenuItem>
                <MenuItem value="CIGARETTE">Thuốc lá</MenuItem>
                <MenuItem value="SERVICE">Dịch vụ</MenuItem>
                <MenuItem value="EQUIPMENT">Thiết bị</MenuItem>
                <MenuItem value="CIGARETTE">Thuốc lá</MenuItem>
                <MenuItem value="OTHER">Khác</MenuItem>
              </Select>
            </FormControl>
            <TextField
              name="costPrice"
              label="Giá nhập"
              fullWidth
              onChange={handleInputChange}
            />
            <TextField
              name="price"
              label="Giá bán"
              fullWidth
              onChange={handleInputChange}
            />
            <TextField
              name="stock"
              label="Số lượng"
              fullWidth
              onChange={handleInputChange}
            />
            <TextField
              name="unit"
              label="Đơn vị (cái, chai, lon...)"
              fullWidth
              onChange={handleInputChange}
            />
            <TextField
              name="imageUrl"
              label="Ảnh sản phẩm"
              fullWidth
              onChange={handleInputChange}
            />

            <FormControl fullWidth>
              <InputLabel id="status-label">Trạng thái</InputLabel>
              <Select
                labelId="status-label"
                name="status"
                value={formValue.status}
                label="Trạng thái"
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
                Thêm sản phẩm
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
}

export default CreateProductForm;
