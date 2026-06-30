/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from "react-router-dom";
import { useAccount } from "../../libs/hooks/useAccount";
import { useState } from "react";
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
} from "@mui/material";
import { useUser } from "../../libs/hooks/useUser";
import { useSnackbar } from "../../libs/context/SnackbarContext";
import { getRoleLabel } from "../../libs/utils/roleAccess";

function CreateUserForm() {
  const navigate = useNavigate();
  const { user } = useAccount();
  const isEditable = user?.role === "ADMIN";
  const { createUser } = useUser();
  const { showSuccess, showError } = useSnackbar();

  // Form State
  const [formValue, setFormValue] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "CUSTOMER",
  });

  // Handle form field changes
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profileData = { ...formValue, password: "123456" };
    // console.log(profileData);
    createUser(profileData, {
      onSuccess: () => {
        showSuccess("Tạo người dùng thành công!");
        if (profileData.role === "CUSTOMER") {
          navigate("/customers");
        } else {
          navigate("/hr");
        }
      },
      onError: (error) => {
        showError("Tạo người dùng thất bại!");
        console.error(error);
      },
    });
  };

  if (isEditable) {
    return (
      <Paper sx={{ borderRadius: 3, padding: 3 }}>
          <Typography variant="h5" gutterBottom color="primary" sx={{ mb: 3 }}>
            Create User
          </Typography>
          <Box
            component="form"
            display="flex"
            flexDirection="column"
            gap={3}
            onSubmit={handleSubmit}
          >
            <TextField
              name="fullName"
              label="Full Name"
              onChange={handleInputChange}
            />
            <TextField
              name="email"
              label="Email"
              fullWidth
              onChange={handleInputChange}
            />
            <TextField
              name="phone"
              label="Phone number"
              onChange={handleInputChange}
            />

            {user?.role === "ADMIN" ? (
              <FormControl fullWidth>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  name="role"
                  value={formValue.role}
                  label="Role"
                  onChange={handleInputChange}
                  MenuProps={{ disableScrollLock: true }}
                >
                  <MenuItem value="ADMIN">{getRoleLabel("ADMIN")}</MenuItem>
                  <MenuItem value="CASHIER">{getRoleLabel("CASHIER")}</MenuItem>
                  <MenuItem value="STAFF">{getRoleLabel("STAFF")}</MenuItem>
                  <MenuItem value="CUSTOMER">{getRoleLabel("CUSTOMER")}</MenuItem>
                </Select>
              </FormControl>
            ) : (
              <TextField
                name="role"
                label="Role"
                value={formValue.role}
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

              <Button type="submit" color="success" variant="contained">
                Create
              </Button>
            </Box>
          </Box>
      </Paper>
    );
  }
}

export default CreateUserForm;
