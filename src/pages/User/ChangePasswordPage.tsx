/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate, useParams } from "react-router-dom";
// import { useAccount } from "../../libs/hooks/useAccount";
import { useState } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { usePassword } from "../../libs/hooks/usePassword";

function ChangePasswordPage() {
  const navigate = useNavigate();
  // const { user } = useAccount();
  const { id } = useParams();
  const { changeUserPassword } = usePassword();
  // const isEditable = user?.id === id || user?.role === "ADMIN";

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });


  // Form State
  const [formValue, setFormValue] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Handle form field changes
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const passwordData = { ...formValue };
    if (formValue.newPassword !== formValue.confirmNewPassword) {
      setSnackbar({
        open: true,
        message: "Mật khẩu mới và xác nhận không khớp!",
        severity: "error",
      });
      return;
    }
    changeUserPassword(
      { id: id!, passwordChangeRequest: passwordData },
      {
        onSuccess: () => {
          setSnackbar({
            open: true,
            message: "Đổi mật khẩu thành công!",
            severity: "success",
          });
          // Chỉ navigate sau khi snackbar đã hiển thị xong
          setTimeout(() => {
            navigate(`/profile/${id}/password-change`);
          }, 2000);
        },
        onError: (error: any) => {
          setSnackbar({
            open: true,
            message:
              error?.response?.data?.message ||
              "Đã xảy ra lỗi khi đổi mật khẩu.",
            severity: "error",
          });
        },
      },
    );
    setFormValue({
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
  };

  return (
    <>
      <Paper sx={{ borderRadius: 3, padding: 3 }}>
        <Typography variant="h5" gutterBottom color="primary" sx={{ mb: 3 }}>
          Bạn muốn thay đổi mật khẩu?
        </Typography>
        <Box
          component="form"
          display="flex"
          flexDirection="column"
          gap={3}
          onSubmit={handleSubmit}
        >
          <TextField
            name="oldPassword"
            label="Nhập mật khẩu cũ"
            value={formValue.oldPassword}
            onChange={handleInputChange}
          />
          <TextField
            name="newPassword"
            label="Nhập mật khẩu mới"
            value={formValue.newPassword}
            onChange={handleInputChange}
          />
          <TextField
            name="confirmNewPassword"
            label="Nhập lại mật khẩu mới"
            value={formValue.confirmNewPassword}
            onChange={handleInputChange}
            fullWidth
          />

          <Box display="flex" justifyContent="end" gap={3}>
            <Button color="inherit" component={Link} to={`/marketing`}>
              Cancel
            </Button>

            <Button type="submit" color="success" variant="contained">
              Change
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

export default ChangePasswordPage;
