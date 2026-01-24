import { Lock, Person, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAccount } from "../../libs/hooks/useAccount";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const { loginUser } = useAccount();
  const navigate = useNavigate();

  const handleChange = (e: { target: { name: string; value: string } }) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await loginUser.mutateAsync(credentials);
      navigate("/marketing");
    } catch (error) {
      // Xử lý lỗi đăng nhập ở đây (ví dụ: hiển thị thông báo)
      console.error("Đăng nhập thất bại", error);
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
          Đăng nhập
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: 15, color: "#888" }}>
            Bạn chưa có tài khoản?&nbsp;
            <Link
              href="/auth/register"
              underline="hover"
              sx={{ color: "#f27ca6", fontWeight: 600 }}
            >
              Đăng ký
            </Link>
          </Typography>
        </Box>

        <form onSubmit={handleLogin}>
          <Typography sx={{ mb: 1, color: "#f27ca6", fontSize: 15 }}>
            * Email
          </Typography>
          <TextField
            autoFocus
            fullWidth
            name="email"
            placeholder="Email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="action" />
                </InputAdornment>
              ),
            }}
            value={credentials.email}
            onChange={handleChange}
            sx={{ background: "#f4f8fd", mb: 2 }}
          />

          <Typography sx={{ mb: 1, color: "#f27ca6", fontSize: 15 }}>
            * Mật khẩu
          </Typography>
          <TextField
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
                  <IconButton onClick={handleClickShowPassword} tabIndex={-1}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            value={credentials.password}
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
              mb: 2,
              fontWeight: "bold",
              fontSize: 16,
              ":hover": {
                background: "linear-gradient(90deg, #fa9864, #f27ca6)",
              },
            }}
          >
            Đăng nhập
          </Button>
        </form>

        <Box className="flex justify-between mt-5">
          <Link
            href="/auth/register"
            underline="hover"
            sx={{ color: "#6193f5" }}
          >
            Bạn chưa có tài khoản? Đăng ký ngay!
          </Link>
        </Box>
      </Paper>
    </Box>
  );
}
