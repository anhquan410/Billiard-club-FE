import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import type { ProductItem } from "../../libs/types/warehouse.type";
import {
  getCategoryLabel,
  getStatusLabel,
} from "../../libs/utils/productLabels";

type ProductDetailDialogProps = {
  product: ProductItem | null;
  open: boolean;
  onClose: () => void;
  onEdit: (productId: string) => void;
};

export default function ProductDetailDialog({
  product,
  open,
  onClose,
  onEdit,
}: ProductDetailDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disableScrollLock
    >
      <DialogTitle>Chi tiết sản phẩm</DialogTitle>
      <DialogContent dividers>
        {product && (
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 2,
              }}
            >
              <Avatar
                sx={{
                  width: 72,
                  height: 72,
                  bgcolor: "#f5f5f5",
                  fontSize: "32px",
                }}
              >
                {product.image}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {getCategoryLabel(product.category)}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary">
                  Đơn vị
                </Typography>
                <Typography fontWeight={500}>{product.unit || "-"}</Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary">
                  Số lượng tồn
                </Typography>
                <Typography
                  fontWeight={500}
                  color={product.stock < 0 ? "error.main" : "text.primary"}
                >
                  {product.stock}
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary">
                  Tồn tối thiểu
                </Typography>
                <Typography fontWeight={500}>
                  {product.minStock ?? "-"}
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary">
                  Trạng thái
                </Typography>
                <Typography fontWeight={500}>
                  {getStatusLabel(product.status)}
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary">
                  Giá nhập trung bình
                </Typography>
                <Typography fontWeight={500}>
                  {product.costPrice > 0
                    ? `${Number(product.costPrice).toLocaleString("vi-VN")} ₫`
                    : "0"}
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary">
                  Giá bán
                </Typography>
                <Typography fontWeight={500}>
                  {product.price > 0
                    ? `${Number(product.price).toLocaleString("vi-VN")} ₫`
                    : "0"}
                </Typography>
              </Grid>
              {product.description && (
                <Grid size={12}>
                  <Typography variant="body2" color="text.secondary">
                    Mô tả
                  </Typography>
                  <Typography fontWeight={500}>
                    {product.description}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            minWidth: 100,
            px: 3,
            py: 1,
            borderRadius: 1,
            border: "1px solid #e0e0e0",
            color: "text.primary",
            fontWeight: 600,
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              borderColor: "#bdbdbd",
              bgcolor: "#f5f5f5",
              boxShadow: "none",
            },
          }}
        >
          Đóng
        </Button>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          sx={{
            minWidth: 100,
            px: 3,
            py: 1,
            borderRadius: 1,
            textTransform: "none",
            boxShadow: "0 2px 4px rgba(240, 98, 146, 0.3)",
            bgcolor: "#f06292",
            "&:hover": {
              bgcolor: "#ec407a",
              boxShadow: "0 4px 8px rgba(240, 98, 146, 0.35)",
            },
          }}
          onClick={() => {
            if (product) {
              onEdit(product.id);
            }
          }}
        >
          Sửa
        </Button>
      </DialogActions>
    </Dialog>
  );
}
