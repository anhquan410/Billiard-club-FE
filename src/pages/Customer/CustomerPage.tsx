import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  Chip,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import { useAccount } from "../../libs/hooks/useAccount";
import { useUser } from "../../libs/hooks/useUser";
import type { Hr } from "../../libs/types";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import { useSnackbar } from "../../libs/context/SnackbarContext";

export default function CustomerPage() {
  const navigate = useNavigate();
  const { user } = useAccount();
  const { users, deleteUserById } = useUser();
  const { showSuccess, showError } = useSnackbar();

  // Lọc khách hàng theo tên, sđt
  const [nameFilter, setNameFilter] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");

  const customers = users?.filter(
    (u: { role: string }) => u.role === "CUSTOMER",
  );

  const filteredData = customers?.filter((customer: Hr) => {
    const matchName =
      nameFilter.trim() === ""
        ? true
        : customer.fullName
            ?.toLowerCase()
            .includes(nameFilter.trim().toLowerCase());
    const matchPhone =
      phoneFilter.trim() === ""
        ? true
        : customer.phone?.includes(phoneFilter.trim());
    return matchName && matchPhone;
  });

  // State for delete confirmation dialog
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleEdit = (id: string) => {
    navigate(`/profile/${id}`);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteUserById(deleteId, {
        onSuccess: (data) => {
          showSuccess(data?.message ?? "Xóa khách hàng thành công!");
          setOpenDialog(false);
          setDeleteId(null);
        },
        onError: () => {
          showError("Xóa khách hàng thất bại!");
        },
      });
    }
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
    setDeleteId(null);
  };

  return user?.role === "ADMIN" ? (
    <>
      <Paper elevation={2} sx={{ p: 2, my: 2, width: "100%" }}>
        {/* Header */}
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6" fontWeight={700}>
            Danh sách khách hàng
          </Typography>
        </Box>
        <Typography sx={{ mb: 0.5 }}>
          <Typography component="span" color="text.secondary" fontWeight={400}>
            Số lượng khách hàng:&nbsp;
          </Typography>
          <Typography
            variant="body2"
            component="span"
            color="#2ac65f"
            sx={{ fontWeight: 400, fontSize: 16 }}
          >
            {customers?.length}
          </Typography>
        </Typography>
        <Typography variant="body2" color="error" sx={{ mt: 0.5, mb: 2 }}>
          *Note: Mật khẩu khách hàng mặc định là: 123456
        </Typography>

        {/* Action bar */}
        <Box display="flex" gap={1} alignItems="center" mb={2} flexWrap="wrap">
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            sx={{ bgcolor: "#ff4081" }}
            component={Link}
            to="/create-user"
          >
            Thêm mới
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<VpnKeyIcon />}
            sx={{ bgcolor: "#ff4081" }}
          >
            Đổi mật khẩu
          </Button>
          <Box sx={{ flex: 1 }} />
          {/* Tìm kiếm nâng cao, option, search, etc */}
          <TextField
            size="small"
            sx={{ minWidth: 150, mr: 1 }}
            placeholder="IBall"
          />
          <TextField
            size="small"
            sx={{ minWidth: 190, mr: 1 }}
            placeholder="Nhập tên khách hàng"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
          <TextField
            size="small"
            sx={{ minWidth: 190, mr: 1 }}
            placeholder="Nhập sđt khách hàng"
            value={phoneFilter}
            onChange={(e) => setPhoneFilter(e.target.value)}
          />

          <FormControl size="small" sx={{ minWidth: 120, mr: 1 }}>
            <Select
              value={""}
              displayEmpty
              MenuProps={{ disableScrollLock: true }}
            >
              <MenuItem value="" disabled>
                Tất cả
              </MenuItem>
              {/* Thêm các option khác nếu có */}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            sx={{ bgcolor: "#ff4081", minWidth: 110, mr: 1, boxShadow: "none" }}
            startIcon={<SearchIcon />}
          >
            Tìm kiếm
          </Button>
          <IconButton
            color="secondary"
            sx={{ bgcolor: "#fff", border: "1px solid #eee", mr: 1 }}
          >
            <SettingsIcon />
          </IconButton>
        </Box>

        <TableContainer sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ minWidth: 48 }}>
                  STT
                </TableCell>
                <TableCell>Tên khách hàng</TableCell>
                <TableCell>Tổng hóa đơn</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Quyền</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData?.map((customer: Hr, idx: number) => (
                <TableRow key={customer.id}>
                  <TableCell align="center">{idx + 1}</TableCell>
                  <TableCell>
                    <Typography
                      component="span"
                      color="#050505"
                      fontWeight={500}
                    >
                      {customer.fullName}
                    </Typography>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>
                    <Chip
                      label={customer.role}
                      sx={{
                        bgcolor:
                          customer.role === "ADMIN" ? "#34be3b" : "#1cbfe7",
                        color: "#fff",
                      }}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      label={customer.status}
                      sx={{
                        bgcolor:
                          customer.status === "ACTIVE" ? "#34be3b" : "#f44336",
                        color: "#fff",
                      }}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Tooltip title="Sửa">
                      <IconButton size="small" color="primary">
                        <EditIcon onClick={() => handleEdit(customer.id)} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton size="small" color="error">
                        <DeleteIcon onClick={() => handleDelete(customer.id)} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {/* Dialog xác nhận xóa */}
      <Dialog open={openDialog} onClose={handleCancelDelete} disableScrollLock>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa khách hàng này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="inherit">
            Hủy
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </>
  ) : (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        🎧 Khách hàng
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="body1">
          Bạn không có quyền xem trang này!
        </Typography>
      </Paper>
    </Box>
  );
}
