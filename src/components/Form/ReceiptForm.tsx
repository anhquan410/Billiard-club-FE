/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAccount } from "../../libs/hooks/useAccount";
import { useProduct } from "../../libs/hooks/useProduct";
import type {
  MovementType,
  ProductItem,
} from "../../libs/types/warehouse.type";
import { useReceipt } from "../../libs/hooks/useReceipt";

function ReceiptForm() {
  const navigate = useNavigate();
  const { user } = useAccount();
  const isEditable = user?.role === "ADMIN";
  const { products, isLoadingProducts } = useProduct();
  const { createImportStockMovement } = useReceipt();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // Form State
  const [formValue, setFormValue] = useState({
    name: "",
    type: "IMPORT",
    quantity: 0,
    unitPrice: 0,
    reason: "",
    staffId: user?.id || "",
  });

  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(
    null,
  );

  // Handle form field changes
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!selectedProduct) {
      setSnackbar({
        open: true,
        message: "Vui lòng chọn sản phẩm",
        severity: "error",
      });
      return;
    }

    const totalValue = Number(formValue.quantity) * Number(formValue.unitPrice);
    const receiptData = {
      productId: selectedProduct.id,
      quantity: Number(formValue.quantity),
      unitPrice: Number(formValue.unitPrice),
      reason: formValue.reason,
      totalValue: totalValue,
      type: "IMPORT" as MovementType,
    };
    createImportStockMovement(
      { data: receiptData, staffId: user?.id || "" },
      {
        onSuccess: () => {
          setSnackbar({
            open: true,
            message: "Cập nhật thành công!",
            severity: "success",
          });
          // Đợi 1.5 giây để người dùng nhìn thấy thông báo trước khi navigate
          setTimeout(() => {
            navigate("/warehouse/import");
          }, 1000);
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

  if (isEditable) {
    return (
      <>
        <Paper sx={{ borderRadius: 3, padding: 3, pb: 7 }}>
          <Typography variant="h5" gutterBottom color="primary" sx={{ mb: 3 }}>
            Tạo phiếu nhập
          </Typography>
          <Box
            component="form"
            display="flex"
            flexDirection="column"
            gap={3}
            onSubmit={handleSubmit}
          >
            <Autocomplete
              options={products || []}
              getOptionLabel={(option) => option.name}
              value={selectedProduct}
              onChange={(_, newValue) => {
                setSelectedProduct(newValue);
                setFormValue((prev) => ({
                  ...prev,
                  name: newValue?.name || "",
                }));
              }}
              loading={isLoadingProducts}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tên sản phẩm"
                  placeholder="Gõ để tìm kiếm sản phẩm..."
                  required
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  <Box>
                    <Typography variant="body1">{option.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Giá nhập: {option.costPrice.toLocaleString("vi-VN")}đ
                    </Typography>
                  </Box>
                </li>
              )}
              noOptionsText="Không tìm thấy sản phẩm"
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />

            <TextField
              name="unitPrice"
              label="Giá nhập"
              fullWidth
              onChange={handleInputChange}
            />

            <TextField
              name="quantity"
              label="Số lượng"
              fullWidth
              onChange={handleInputChange}
            />

            <TextField
              label="Tổng giá trị"
              fullWidth
              value={
                (
                  Number(formValue.quantity) * Number(formValue.unitPrice)
                ).toLocaleString("vi-VN") + " đ"
              }
              disabled
              sx={{
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#000000",
                  fontWeight: "500",
                  fontSize: "1.1rem",
                },
              }}
            />

            <TextField
              name="reason"
              label="Lý do"
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
                to="/warehouse/import"
              >
                Quay lại
              </Button>
              <Button type="submit" color="success" variant="contained">
                Tạo phiếu nhập
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

export default ReceiptForm;
