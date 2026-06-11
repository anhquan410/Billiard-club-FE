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
} from "@mui/material";
import { usePassword } from "../../libs/hooks/usePassword";
import { useSnackbar } from "../../libs/context/SnackbarContext";
import { getApiErrorMessage } from "../../libs/utils/apiError";

function ChangePasswordPage() {
  const navigate = useNavigate();
  // const { user } = useAccount();
  const { id } = useParams();
  const { changeUserPassword } = usePassword();
  const { showSuccess, showError } = useSnackbar();

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
      showError("Mật khẩu mới và xác nhận không khớp!");
      return;
    }
    changeUserPassword(
      { id: id!, passwordChangeRequest: passwordData },
      {
        onSuccess: () => {
          showSuccess("Đổi mật khẩu thành công!");
          navigate(`/profile/${id}`);
        },
        onError: (error) => {
          showError(getApiErrorMessage(error, "Đã xảy ra lỗi khi đổi mật khẩu."));
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
  );
}

export default ChangePasswordPage;
