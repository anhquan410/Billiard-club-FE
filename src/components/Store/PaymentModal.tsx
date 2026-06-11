import { useEffect, useState } from "react";
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
  Chip,
  Alert,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useTableSession } from "../../libs/hooks/useTable";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../../libs/context/SnackbarContext";
import { getApiErrorMessage } from "../../libs/utils/apiError";
import {
  calculateBonusDiscount,
  getBonusProfile,
  getBonusSystemInfo,
} from "../../libs/api/bonus";
import { TIER_LABELS } from "../../libs/utils/bonusLabels";

export default function PaymentModal({
  open,
  onClose,
  total,
  sessionId,
  tableId,
  customerId,
}: {
  open: boolean;
  onClose: () => void;
  total: number;
  sessionId: string;
  tableId: string;
  customerId?: string | null;
}) {
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const { endTableSessionAsync, isEndingTableSession } =
    useTableSession(tableId);

  const [paymentMethod, setPaymentMethod] = useState<
    "CASH" | "BANK_TRANSFER" | "MOMO" | "VNPAY" | "OTHER"
  >("CASH");
  const [note, setNote] = useState("");
  const [discount, setDiscount] = useState<number>(0);
  const [useTierDiscount, setUseTierDiscount] = useState(true);
  const [bonusPointsToUse, setBonusPointsToUse] = useState(0);

  const amountBeforeBonus = Math.max(0, Number(total || 0) - (discount || 0));

  const { data: bonusProfile } = useQuery({
    queryKey: ["bonus-profile", customerId],
    queryFn: () => getBonusProfile(customerId!),
    enabled: open && !!customerId,
  });

  const { data: bonusSystemInfo } = useQuery({
    queryKey: ["bonus-system-info"],
    queryFn: getBonusSystemInfo,
    enabled: open && !!customerId,
    staleTime: 5 * 60 * 1000,
  });

  const { data: bonusPreview } = useQuery({
    queryKey: [
      "bonus-preview",
      customerId,
      amountBeforeBonus,
      bonusPointsToUse,
      useTierDiscount,
    ],
    queryFn: () =>
      calculateBonusDiscount({
        userId: customerId!,
        totalAmount: amountBeforeBonus,
        usePoints: bonusPointsToUse > 0 ? bonusPointsToUse : undefined,
        useTierDiscount: useTierDiscount && bonusPointsToUse === 0,
      }),
    enabled: open && !!customerId && amountBeforeBonus > 0,
  });

  const finalAmount = bonusPreview?.finalAmount ?? amountBeforeBonus;
  const pointsPerVnd = bonusSystemInfo?.pointsPerVnd ?? 10000;
  const pointsToEarn = Math.floor(finalAmount / pointsPerVnd);

  useEffect(() => {
    if (!open) {
      setDiscount(0);
      setNote("");
      setUseTierDiscount(true);
      setBonusPointsToUse(0);
    }
  }, [open]);

  const handlePayment = async () => {
    try {
      const result = await endTableSessionAsync({
        tableId,
        paymentData: {
          paymentMethod,
          discount: discount || 0,
          note: note || undefined,
          customerId: customerId ?? undefined,
          bonusPointsToUse: bonusPointsToUse > 0 ? bonusPointsToUse : undefined,
          useTierDiscount,
        },
      });

      const earned = result?.bonusPointsEarned ?? 0;
      showSuccess(
        earned > 0
          ? `Thanh toán thành công! Khách được tích ${earned} điểm.`
          : "Thanh toán thành công!",
      );
      onClose();
      navigate("/store");
    } catch (error) {
      showError(getApiErrorMessage(error, "Thanh toán thất bại. Vui lòng thử lại!"));
      console.error("Payment failed:", error);
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
          <Grid size={{ xs: 12, md: 7 }}>
            <TextField
              label="Mã hóa đơn *"
              value={sessionId}
              InputProps={{ readOnly: true }}
              size="small"
              margin="normal"
              fullWidth
            />

            {customerId && bonusProfile && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
                  <Typography variant="body2" fontWeight={600}>
                    {bonusProfile.fullName}
                  </Typography>
                  <Chip
                    size="small"
                    label={`Hạng ${TIER_LABELS[bonusProfile.membershipTier] ?? bonusProfile.membershipTier} (-${bonusProfile.tierDiscountPercentage}%)`}
                  />
                  <Chip
                    size="small"
                    color="secondary"
                    label={`${bonusProfile.bonusPoints} điểm`}
                  />
                </Box>
              </Alert>
            )}

            {!customerId && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Chưa gán khách — không tích điểm thưởng.
              </Alert>
            )}

            <Box sx={{ mb: 2, mt: 0.5 }}>
              <Typography fontWeight={500} sx={{ mb: 2 }}>
                Phương thức <span style={{ color: "red" }}>*</span>
              </Typography>

              <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
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
                  value={Number(total || 0).toLocaleString("vi-VN")}
                  InputProps={{ readOnly: true }}
                  sx={{ maxWidth: 180 }}
                />
                <TextField
                  label="Giảm giá (VNĐ)"
                  size="small"
                  type="number"
                  value={discount || ""}
                  onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                  sx={{ maxWidth: 180 }}
                />
              </Box>
            </Box>

            {customerId && bonusProfile && (
              <Box sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={useTierDiscount && bonusPointsToUse === 0}
                      disabled={bonusPointsToUse > 0}
                      onChange={(e) => setUseTierDiscount(e.target.checked)}
                    />
                  }
                  label={`Áp dụng giảm giá hạng (${bonusProfile.tierDiscountPercentage}%)`}
                />
                <TextField
                  label="Dùng điểm thưởng"
                  size="small"
                  type="number"
                  value={bonusPointsToUse || ""}
                  onChange={(e) => {
                    const val = Number(e.target.value) || 0;
                    setBonusPointsToUse(val);
                    if (val > 0) setUseTierDiscount(false);
                  }}
                  helperText={
                    bonusPreview
                      ? `Tối đa ${bonusPreview.maxUsablePoints} điểm (1 điểm = 1.000đ)`
                      : undefined
                  }
                  inputProps={{
                    min: 0,
                    max: bonusPreview?.maxUsablePoints ?? bonusProfile.bonusPoints,
                  }}
                  sx={{ maxWidth: 280 }}
                />
              </Box>
            )}

            <TextField
              label="Ghi chú"
              fullWidth
              size="small"
              sx={{ mt: 1 }}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                mt: 1,
              }}
            >
              <Divider sx={{ width: "100%", mb: 1 }} />
              <Box sx={{ width: "100%" }}>
                <Typography variant="body2" color="text.secondary">
                  Tạm tính: {amountBeforeBonus.toLocaleString("vi-VN")} đ
                </Typography>
                {bonusPreview && bonusPreview.tierDiscount > 0 && (
                  <Typography variant="body2" color="success.main">
                    Giảm hạng: -{bonusPreview.tierDiscount.toLocaleString("vi-VN")} đ
                  </Typography>
                )}
                {bonusPreview && bonusPreview.pointsDiscount > 0 && (
                  <Typography variant="body2" color="success.main">
                    Giảm điểm: -{bonusPreview.pointsDiscount.toLocaleString("vi-VN")} đ
                  </Typography>
                )}
                {customerId && pointsToEarn > 0 && (
                  <Typography variant="body2" color="primary.main" sx={{ mt: 1 }}>
                    Dự kiến tích: +{pointsToEarn} điểm
                  </Typography>
                )}
              </Box>
              <Box sx={{ textAlign: "right", width: "100%", mt: 2 }}>
                <Typography color="text.secondary" fontWeight={500}>
                  Thanh toán
                </Typography>
                <Typography
                  fontWeight={700}
                  fontSize={22}
                  color="#e91e63"
                  sx={{ letterSpacing: 1.2 }}
                >
                  {finalAmount.toLocaleString("vi-VN")} đ
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
