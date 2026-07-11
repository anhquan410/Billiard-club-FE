import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Link,
  Paper,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person,
  Lock,
  Email,
  Phone,
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import { useAccount } from "../../libs/hooks/useAccount";
import { useSnackbar } from "../../libs/context/SnackbarContext";
import { getApiErrorMessage } from "../../libs/utils/apiError";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [info, setInfo] = useState({
    fullName: "",
    email: "",
    password: "",
    confirm: "",
    phone: "",
  });

  const { registerUser } = useAccount();
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();

  const handleChange = (e: { target: { name: string; value: string } }) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const handleShowPassword = () => setShowPassword((show) => !show);
  const handleShowConfirm = () => setShowConfirm((show) => !show);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (info.password !== info.confirm) {
      showError("Mật khẩu không khớp");
      return;
    }

    try {
      await registerUser.mutateAsync({
        fullName: info.fullName,
        email: info.email,
        password: info.password,
        phone: info.phone,
      });
      showSuccess("Đăng ký thành công!");
      navigate("/auth/login");
    } catch (error) {
      showError(getApiErrorMessage(error, "Đăng ký thất bại!"));
      console.error("Đăng ký thất bại", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "85vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#fafbfc",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 5,
          width: "100%",
          maxWidth: 800,
          borderRadius: 1,
          boxShadow: 6,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
          Đăng ký
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: 15, color: "#888" }}>
            Bạn đã có tài khoản?&nbsp;
            <Link
              href="/auth/login"
              underline="hover"
              sx={{ color: "#f27ca6", fontWeight: 600 }}
            >
              Đăng nhập
            </Link>
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Typography sx={{ mb: 1, color: "#f27ca6", fontSize: 15 }}>
            * Full Name
          </Typography>
          <TextField
            required
            fullWidth
            name="fullName"
            placeholder="Full Name"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="action" />
                </InputAdornment>
              ),
            }}
            value={info.fullName}
            onChange={handleChange}
            sx={{ background: "#f4f8fd", mb: 2 }}
          />

          <Typography sx={{ mb: 1, color: "#f27ca6", fontSize: 15 }}>
            * Email
          </Typography>
          <TextField
            required
            fullWidth
            name="email"
            type="email"
            placeholder="Email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
            value={info.email}
            onChange={handleChange}
            sx={{ background: "#f4f8fd", mb: 2 }}
          />

          <Typography sx={{ mb: 1, color: "#f27ca6", fontSize: 15 }}>
            * Số điện thoại
          </Typography>
          <TextField
            required
            fullWidth
            name="phone"
            type="phone"
            placeholder="Số điện thoại"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone color="action" />
                </InputAdornment>
              ),
            }}
            value={info.phone}
            onChange={handleChange}
            sx={{ background: "#f4f8fd", mb: 2 }}
          />

          <Typography sx={{ mb: 1, color: "#f27ca6", fontSize: 15 }}>
            * Mật khẩu
          </Typography>
          <TextField
            required
            fullWidth
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} tabIndex={-1}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            value={info.password}
            onChange={handleChange}
            sx={{ background: "#f4f8fd", mb: 2 }}
          />

          <Typography sx={{ mb: 1, color: "#f27ca6", fontSize: 15 }}>
            * Nhập lại mật khẩu
          </Typography>
          <TextField
            required
            fullWidth
            name="confirm"
            type={showConfirm ? "text" : "password"}
            placeholder="Nhập lại mật khẩu"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowConfirm} tabIndex={-1}>
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            value={info.confirm}
            onChange={handleChange}
            sx={{ background: "#f4f8fd", mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={registerUser.isPending}
            sx={{
              background: "linear-gradient(90deg, #f27ca6, #fa9864)",
              mt: 1,
              fontWeight: "bold",
              fontSize: 16,
              ":hover": {
                background: "linear-gradient(90deg, #fa9864, #f27ca6)",
              },
            }}
          >
            Đăng ký
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
