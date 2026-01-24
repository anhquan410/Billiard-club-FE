import { Box, Typography, List, ListItem, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import type { OrderItem } from "../../libs/types/store.type";

type OrderItemListProps = {
  items: OrderItem[];
  onUpdateQuantity: (productId: number, delta: number) => void;
  onRemoveItem: (productId: number) => void;
};

export default function OrderItemList({
  items,
  onUpdateQuantity,
  onRemoveItem,
}: OrderItemListProps) {
  if (items.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
        <Typography>Chưa có sản phẩm nào</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "3fr 1fr 1fr 1fr 1fr 0.5fr",
          gap: 2,
          p: 1,
          bgcolor: "#f5f5f5",
          borderRadius: 1,
          mb: 1,
          fontSize: "13px",
          fontWeight: "bold",
        }}
      >
        <Typography variant="caption" fontWeight="bold">
          Sản phẩm & Dịch vụ
        </Typography>
        <Typography variant="caption" fontWeight="bold">
          Đơn vị
        </Typography>
        <Typography variant="caption" fontWeight="bold">
          SL
        </Typography>
        <Typography variant="caption" fontWeight="bold">
          Thành tiền
        </Typography>
        <Typography variant="caption" fontWeight="bold">
          Nhân viên
        </Typography>
        <Typography variant="caption" fontWeight="bold">
          Vị trí
        </Typography>
      </Box>

      <List sx={{ maxHeight: "calc(100% - 200px)", overflow: "auto" }}>
        {items.map((item) => (
          <ListItem
            key={item.productId}
            sx={{
              display: "grid",
              gridTemplateColumns: "3fr 1fr 1fr 1fr 1fr 0.5fr",
              gap: 2,
              py: 1,
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <Box>
              <Typography variant="body2" fontWeight="500">
                {item.productName}
              </Typography>
              <Typography variant="caption" color="warning.main">
                Giá trước VAT: {item.price.toLocaleString("vi-VN")}
              </Typography>
            </Box>
            <Typography variant="body2">-</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <IconButton
                size="small"
                onClick={() => onUpdateQuantity(item.productId, -1)}
                sx={{ bgcolor: "#f0f0f0" }}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography
                variant="body2"
                sx={{ minWidth: 30, textAlign: "center" }}
              >
                {item.quantity}
              </Typography>
              <IconButton
                size="small"
                onClick={() => onUpdateQuantity(item.productId, 1)}
                sx={{ bgcolor: "#2196f3", color: "white" }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="body2" fontWeight="500">
              {item.total.toLocaleString("vi-VN")}₫
            </Typography>
            <Typography variant="body2">Bàn 1</Typography>
            <IconButton
              size="small"
              onClick={() => onRemoveItem(item.productId)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </>
  );
}
