/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAccount } from "../../libs/hooks/useAccount";
import { useProfile } from "../../libs/hooks/useProfile";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import type { Profile } from "../../libs/types";

function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAccount();
  const { id } = useParams();
  const { profile, updateProfile } = useProfile(id);
  const isEditable = user?.id === id || user?.role === "ADMIN";

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // Form State
  const [formValue, setFormValue] = useState({
    fullName: profile?.fullName || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    username: profile?.username || "",
    password: profile?.password || "",
    role: profile?.role || "CUSTOMER",
  });

  // Update form value when profile data loads (for edit mode)
  useEffect(() => {
    if (profile && isEditable) {
      setFormValue({
        fullName: profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        username: profile.username || "",
        password: profile.password || "",
        role: profile.role || "CUSTOMER",
      });
    }
  }, [profile, isEditable]);

  // Handle form field changes
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profileData = { ...formValue };
    updateProfile(
      { id: id as string, profile: profileData as unknown as Profile },
      {
        onSuccess: () => {
          setSnackbar({
            open: true,
            message: "Cập nhật thành công!",
            severity: "success",
          });
          if (profileData.role === "CUSTOMER") {
            navigate("/customers");
          } else {
            navigate("/hr");
          }
        },
        onError: (error, variable, context) => {
          setSnackbar({
            open: true,
            message: "Cập nhật thất bại!",
            severity: "error",
          });
          console.log(error, variable, context);
        },
      },
    );
  };

  return (
    <>
      <Paper sx={{ borderRadius: 3, padding: 3 }}>
        <Typography variant="h5" gutterBottom color="primary" sx={{ mb: 3 }}>
          Edit Profile
        </Typography>
        <Box
          component="form"
          display="flex"
          flexDirection="column"
          gap={3}
          onSubmit={handleSubmit}
        >
          <TextField
            name="username"
            label="User Name"
            value={formValue.username}
            onChange={handleInputChange}
          />
          <TextField
            name="fullName"
            label="Full Name"
            value={formValue.fullName}
            onChange={handleInputChange}
          />
          <TextField
            name="phone"
            label="Phone number"
            value={formValue.phone}
            onChange={handleInputChange}
          />
          <TextField
            name="email"
            label="Email"
            value={formValue.email}
            InputProps={{ readOnly: true }}
            fullWidth
          />

          {user?.role === "ADMIN" ? (
            <FormControl fullWidth>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                name="role"
                label="Role"
                value={formValue.role}
                onChange={handleInputChange}
                MenuProps={{ disableScrollLock: true }}
              >
                <MenuItem value="ADMIN">ADMIN</MenuItem>
                <MenuItem value="STAFF">STAFF</MenuItem>
                <MenuItem value="CUSTOMER">CUSTOMER</MenuItem>
              </Select>
            </FormControl>
          ) : (
            <TextField
              name="role"
              label="Role"
              value={formValue.role}
              InputProps={{ readOnly: true }}
              fullWidth
            />
          )}

          <Box display="flex" justifyContent="end" gap={3}>
            <Button
              type="button"
              color="error"
              variant="contained"
              component={Link}
              to={`/marketing`}
            >
              Cancel
            </Button>
            <Button
              type="button"
              color="primary"
              variant="contained"
              component={Link}
              to={`/profile/${id}/password-change`}
            >
              Đổi mật khẩu
            </Button>
            <Button type="submit" color="success" variant="contained">
              Submit
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

export default ProfilePage;
