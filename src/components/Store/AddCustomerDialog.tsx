import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { createUser } from "../../libs/api/user";
import { getApiErrorMessage } from "../../libs/utils/apiError";
import type { CustomerOption } from "./FindCustomerDialog";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (customer: CustomerOption) => void;
  onError: (message: string) => void;
};

const DEFAULT_PASSWORD = "123456";

export default function AddCustomerDialog({
  open,
  onClose,
  onCreated,
  onError,
}: Props) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      createUser({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        role: "CUSTOMER",
        password: DEFAULT_PASSWORD,
      }),
    onSuccess: (user) => {
      onCreated({
        id: user.id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        bonusPoints: user.bonusPoints ?? 0,
        membershipTier: user.membershipTier ?? "BRONZE",
      });
      setForm({ fullName: "", email: "", phone: "" });
      onClose();
    },
    onError: (err) => {
      onError(getApiErrorMessage(err, "Không thể tạo khách hàng"));
    },
  });

  const handleSubmit = () => {
    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()) {
      onError("Vui lòng nhập đầy đủ họ tên, email và số điện thoại");
      return;
    }
    mutate();
  };

  const handleClose = () => {
    setForm({ fullName: "", email: "", phone: "" });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Thêm khách mới</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
        <TextField
          label="Họ và tên"
          value={form.fullName}
          onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
          fullWidth
          required
        />
        <TextField
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          fullWidth
          required
        />
        <TextField
          label="Số điện thoại"
          value={form.phone}
          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          placeholder="0xxxxxxxxx"
          fullWidth
          required
        />
        <Typography variant="caption" color="text.secondary">
          Tài khoản sẽ được tạo với mật khẩu mặc định: {DEFAULT_PASSWORD}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isPending}>
          Hủy
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isPending}>
          Thêm & gán khách
        </Button>
      </DialogActions>
    </Dialog>
  );
}
