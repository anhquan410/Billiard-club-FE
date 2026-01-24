import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import TimerIcon from "@mui/icons-material/Timer";
import EditIcon from "@mui/icons-material/Edit";
import MessageIcon from "@mui/icons-material/Message";
import ReceiptIcon from "@mui/icons-material/Receipt";
import OrderItemList from "./OrderItemList";
import OrderSummary from "./OrderSummary";
import ProductList from "./ProductList";
import type {
  OrderItem,
  Product,
  TableData,
} from "../../libs/types/store.type";

type OrderModalProps = {
  open: boolean;
  table: TableData | null;
  orderItems: OrderItem[];
  products: Product[];
  onClose: () => void;
  onAddProduct: (product: Product) => void;
  onUpdateQuantity: (productId: number, delta: number) => void;
  onRemoveItem: (productId: number) => void;
  onOpenCustomerModal: () => void;
};

export default function OrderModal({
  open,
  table,
  orderItems,
  products,
  onClose,
  onAddProduct,
  onUpdateQuantity,
  onRemoveItem,
  onOpenCustomerModal,
}: OrderModalProps) {
  const [productSearch, setProductSearch] = React.useState("");
  const [productCategory, setProductCategory] = React.useState("Tất cả");

  const orderTotal = orderItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: "90vh",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "#f5f5f5",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {table?.name}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{ p: 0, display: "flex", height: "calc(100% - 120px)" }}
      >
        {/* Left side - Order items */}
        <Box sx={{ width: "60%", p: 3, borderRight: "1px solid #e0e0e0" }}>
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <Button size="small" startIcon={<SearchIcon />} variant="outlined">
              Tìm khách
            </Button>
            <Button size="small" startIcon={<NoteAddIcon />} variant="outlined">
              Thông tin thuê
            </Button>
            <Button
              size="small"
              startIcon={<PersonAddIcon />}
              variant="outlined"
              onClick={onOpenCustomerModal}
            >
              Thêm khách mới
            </Button>
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Button
              size="small"
              startIcon={<TimerIcon />}
              sx={{ color: "#2196f3" }}
            >
              Giờ hẹn
            </Button>
            <Button
              size="small"
              startIcon={<EditIcon />}
              sx={{ color: "#2196f3" }}
            >
              Ghi chú
            </Button>
            <Button
              size="small"
              startIcon={<NoteAddIcon />}
              sx={{ color: "#2196f3" }}
            >
              Tạo thủ công
            </Button>
            <Button
              size="small"
              startIcon={<MessageIcon />}
              sx={{ color: "#2196f3" }}
            >
              Ghi chú nhân viên
            </Button>
            <Button
              size="small"
              startIcon={<ReceiptIcon />}
              sx={{ color: "#2196f3" }}
            >
              Thu ngân
            </Button>
          </Box>

          <OrderItemList
            items={orderItems}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
          />

          <OrderSummary total={orderTotal} />
        </Box>

        {/* Right side - Products */}
        <Box sx={{ width: "40%", p: 3, bgcolor: "#fafafa" }}>
          <ProductList
            products={products}
            searchText={productSearch}
            onSearchChange={setProductSearch}
            category={productCategory}
            onCategoryChange={setProductCategory}
            onAddProduct={onAddProduct}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: "#f5f5f5", gap: 1 }}>
        <Button variant="contained" color="error" startIcon={<PersonAddIcon />}>
          Xếp nhân viên
        </Button>
        <Button variant="contained" color="warning" startIcon={<TimerIcon />}>
          Tính năng khác
        </Button>
        <Button variant="outlined" startIcon={<ReceiptIcon />}>
          In
        </Button>
        <Button variant="outlined" color="error" startIcon={<CloseIcon />}>
          Hủy hoá đơn
        </Button>
        <Button variant="outlined" color="primary" onClick={onClose}>
          Vực thanh toán
        </Button>
        <Button variant="contained" color="success" startIcon={<ReceiptIcon />}>
          Thanh toán
        </Button>
      </DialogActions>
    </Dialog>
  );
}
