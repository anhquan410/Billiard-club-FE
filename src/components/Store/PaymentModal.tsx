import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Divider,
} from "@mui/material";
import { useTableSession } from "../../libs/hooks/useTable";
import { useNavigate } from "react-router-dom";

export default function PaymentModal({
  open,
  onClose,
  total,
  sessionId,
  tableId,
}: {
  open: boolean;
  onClose: () => void;
  total: number;
  sessionId: string;
  tableId: string;
}) {
  const navigate = useNavigate();
  const { endTableSessionAsync, isEndingTableSession } =
    useTableSession(tableId);

  const [paymentMethod, setPaymentMethod] = useState<
    "CASH" | "BANK_TRANSFER" | "MOMO" | "VNPAY" | "OTHER"
  >("CASH");
  const [note, setNote] = useState("");
  const [discount, setDiscount] = useState<number>(0);

  const handlePayment = async () => {
    try {
      // Await mutation để đảm bảo API complete và queries được invalidate
      await endTableSessionAsync({
        tableId,
        paymentData: {
          paymentMethod,
          discount: discount || 0,
          note: note || undefined,
          customerId: undefined, // Có thể thêm field chọn customer sau
        },
      });

      onClose();
      // Navigate về trang store sau khi thanh toán thành công
      navigate("/store");
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Thanh toán thất bại. Vui lòng thử lại!");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, minWidth: 650 },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Thanh toán</DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 2, pb: 1 }}>
        <Grid container spacing={2}>
          {/* LEFT COL: Thông tin hóa đơn */}
          <Grid size={{ xs: 12, md: 7 }}>
            <TextField
              label="Mã hóa đơn *"
              value={sessionId}
              InputProps={{ readOnly: true }}
              size="small"
              margin="normal"
              fullWidth
            />

            <Box sx={{ mb: 2, mt: 0.5 }}>
              <Typography fontWeight={500} sx={{ mb: 2 }}>
                Phương thức <span style={{ color: "red" }}>*</span>
              </Typography>

              <Box display="flex" alignItems="center" gap={1}>
                <Select
                  value={paymentMethod}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value as typeof paymentMethod)
                  }
                  size="small"
                  sx={{ minWidth: 200, bgcolor: "#fafcff" }}
                >
                  <MenuItem value="CASH">Tiền mặt</MenuItem>
                  <MenuItem value="BANK_TRANSFER">Chuyển khoản</MenuItem>
                  <MenuItem value="MOMO">Momo</MenuItem>
                  <MenuItem value="VNPAY">VNPay</MenuItem>
                </Select>

                <TextField
                  label="Tổng hóa đơn"
                  size="small"
                  value={Number(total || 0).toLocaleString("vi-VN", {
                    maximumFractionDigits: 0,
                  })}
                  sx={{ maxWidth: 180 }}
                />
                <TextField
                  label="Giảm giá"
                  size="small"
                  value={Number(discount || 0).toLocaleString("vi-VN", {
                    maximumFractionDigits: 0,
                  })}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  sx={{ maxWidth: 180 }}
                />
              </Box>
            </Box>
            <TextField
              label="Ghi chú"
              fullWidth
              size="small"
              sx={{ mt: 2 }}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <Box mt={1}>
              <FormControlLabel
                label="Gửi SMS"
                control={<Checkbox defaultChecked color="secondary" />}
              />
              <FormControlLabel
                label="VietQr không nhận thông báo ngân hàng"
                control={<Checkbox />}
              />
            </Box>
          </Grid>

          {/* RIGHT COL: QR + Tổng */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                mt: 1,
              }}
            >
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=135x135&data=http://example.com/pay"
                alt="QR"
                style={{
                  width: 130,
                  height: 130,
                  border: "1px solid #eee",
                  borderRadius: 5,
                  marginBottom: 4,
                }}
              />
              <Typography
                fontSize={13}
                color="text.secondary"
                sx={{ textAlign: "center", mb: 2 }}
              >
                * mã không nhận thông báo
              </Typography>
              <Divider sx={{ width: "100%", mb: 2 }} />
              <Box sx={{ textAlign: "right", width: "100%", mb: 2 }}>
                <Typography color="text.secondary" fontWeight={500}>
                  Tổng hóa đơn
                </Typography>
                <Typography
                  fontWeight={700}
                  fontSize={22}
                  color="#e91e63"
                  sx={{ letterSpacing: 1.2 }}
                >
                  {Number(total * (1 - (discount || 0) / 100)).toLocaleString(
                    "vi-VN",
                    {
                      maximumFractionDigits: 0,
                    },
                  )}{" "}
                  VNĐ
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button
          variant="contained"
          color="secondary"
          sx={{ bgcolor: "#f56f9c", minWidth: 120 }}
        >
          In hóa đơn
        </Button>

        <Button
          variant="contained"
          color="secondary"
          sx={{ bgcolor: "#f56f9c", minWidth: 120 }}
          onClick={handlePayment}
          disabled={isEndingTableSession}
        >
          {isEndingTableSession ? "Đang xử lý..." : "Thanh toán"}
        </Button>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{ minWidth: 80, bgcolor: "#56ade7" }}
        >
          Thoát
        </Button>
      </DialogActions>
    </Dialog>
  );
}
