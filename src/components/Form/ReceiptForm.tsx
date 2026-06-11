/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Autocomplete,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAccount } from "../../libs/hooks/useAccount";
import { useProduct } from "../../libs/hooks/useProduct";
import { useSnackbar } from "../../libs/context/SnackbarContext";
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
  const { showSuccess, showError } = useSnackbar();

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
      showError("Vui lòng chọn sản phẩm");
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
          showSuccess("Tạo phiếu nhập thành công!");
          navigate("/warehouse/import");
        },
        onError: (error) => {
          showError("Tạo phiếu nhập thất bại!");
          console.error(error);
        },
      },
    );
  };

  if (isEditable) {
    return (
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
    );
  }
}

export default ReceiptForm;
