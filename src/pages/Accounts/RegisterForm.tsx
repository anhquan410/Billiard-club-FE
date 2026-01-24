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
} from "@mui/icons-material";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [info, setInfo] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e: { target: { name: string; value: string } }) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const handleShowPassword = () => setShowPassword((show) => !show);
  const handleShowConfirm = () => setShowConfirm((show) => !show);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (info.password !== info.confirm) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    // TODO: Add register logic here (call API, etc.)
    alert("Đăng ký với: " + JSON.stringify(info));
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
            name="username"
            placeholder="Full Name"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="action" />
                </InputAdornment>
              ),
            }}
            value={info.username}
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
