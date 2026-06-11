import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { useSnackbar } from "../../libs/context/SnackbarContext";
import { useAdjustBonusPoints } from "../../libs/hooks/useBonus";
import { getApiErrorMessage } from "../../libs/utils/apiError";

type Props = {
  open: boolean;
  onClose: () => void;
  userId: string;
  fullName: string;
  currentPoints: number;
};

export default function AdjustPointsDialog({
  open,
  onClose,
  userId,
  fullName,
  currentPoints,
}: Props) {
  const [points, setPoints] = useState("");
  const [reason, setReason] = useState("");
  const { showSuccess, showError } = useSnackbar();
  const { mutate, isPending } = useAdjustBonusPoints();

  const handleClose = () => {
    setPoints("");
    setReason("");
    onClose();
  };

  const handleSubmit = () => {
    const parsed = Number(points);
    if (!points.trim() || Number.isNaN(parsed) || parsed === 0) {
      showError("Nhập số điểm khác 0 (dương để cộng, âm để trừ)");
      return;
    }
    if (!reason.trim()) {
      showError("Vui lòng nhập lý do điều chỉnh");
      return;
    }
    if (currentPoints + parsed < 0) {
      showError("Số điểm sau điều chỉnh không được âm");
      return;
    }

    mutate(
      { userId, points: parsed, reason: reason.trim() },
      {
        onSuccess: (data) => {
          showSuccess(data.message ?? "Điều chỉnh điểm thành công");
          handleClose();
        },
        onError: (err) => {
          showError(getApiErrorMessage(err, "Điều chỉnh điểm thất bại"));
        },
      },
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth disableScrollLock>
      <DialogTitle>Điều chỉnh điểm</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Khách hàng: <strong>{fullName}</strong> — Hiện có{" "}
          <strong>{currentPoints.toLocaleString("vi-VN")}</strong> điểm
        </Typography>
        <TextField
          fullWidth
          label="Số điểm (+ cộng / − trừ)"
          type="number"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          sx={{ mb: 2 }}
          placeholder="VD: 100 hoặc -50"
        />
        <TextField
          fullWidth
          label="Lý do"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          multiline
          minRows={2}
          placeholder="VD: Bù điểm sự kiện, sửa sai..."
        />
        {points.trim() && !Number.isNaN(Number(points)) && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Sau điều chỉnh:{" "}
              <strong>
                {(currentPoints + Number(points)).toLocaleString("vi-VN")} điểm
              </strong>
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isPending}>
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isPending}
          sx={{ bgcolor: "#ff4081" }}
        >
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
}
