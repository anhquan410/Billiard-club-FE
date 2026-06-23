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
import { getRoleLabel, STAFF_ROLES } from "../../libs/utils/roleAccess";

const roleChipColor: Record<string, string> = {
  ADMIN: "#34be3b",
  CASHIER: "#2196f3",
  STAFF: "#d6d436",
};

export default function StaffPage() {
  const navigate = useNavigate();
  const { user } = useAccount();
  const { users, deleteUserById } = useUser();
  const { showSuccess, showError } = useSnackbar();
  // State cho select quyền
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [nameFilter, setNameFilter] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");

  // Lọc nhân sự theo quyền, tên, sđt
  const hres = users?.filter((u: { role: string }) =>
    STAFF_ROLES.includes(u.role as (typeof STAFF_ROLES)[number]),
  );
  const filteredData = hres?.filter((hr: Hr) => {
    const matchRole = roleFilter === "ALL" ? true : hr.role === roleFilter;
    const matchName =
      nameFilter.trim() === ""
        ? true
        : hr.fullName?.toLowerCase().includes(nameFilter.trim().toLowerCase());
    const matchPhone =
      phoneFilter.trim() === "" ? true : hr.phone?.includes(phoneFilter.trim());
    return matchRole && matchName && matchPhone;
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
          showSuccess(data?.message ?? "Xóa nhân viên thành công!");
          setOpenDialog(false);
          setDeleteId(null);
        },
        onError: () => {
          showError("Xóa nhân viên thất bại!");
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
            Danh sách nhân sự
          </Typography>
        </Box>
        <Typography sx={{ mb: 0.5 }}>
          <Typography component="span" color="text.secondary" fontWeight={400}>
            Số lượng nhân sự:&nbsp;
          </Typography>
          <Typography
            variant="body2"
            component="span"
            color="#2ac65f"
            sx={{ fontWeight: 400, fontSize: 16 }}
          >
            {hres?.length}
          </Typography>
        </Typography>
        <Typography variant="body2" color="error" sx={{ mt: 0.5, mb: 2 }}>
          *Note: Mật khẩu nhân sự mặc định là: 123456
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
            placeholder="Nhập tên nhân viên"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
          <TextField
            size="small"
            sx={{ minWidth: 190, mr: 1 }}
            placeholder="Nhập sđt nhân viên"
            value={phoneFilter}
            onChange={(e) => setPhoneFilter(e.target.value)}
          />
          <FormControl size="small" sx={{ minWidth: 140, mr: 1 }}>
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              displayEmpty
              MenuProps={{ disableScrollLock: true }}
            >
              <MenuItem value="ALL">Tất cả</MenuItem>
              <MenuItem value="ADMIN">{getRoleLabel("ADMIN")}</MenuItem>
              <MenuItem value="CASHIER">{getRoleLabel("CASHIER")}</MenuItem>
              <MenuItem value="STAFF">{getRoleLabel("STAFF")}</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            sx={{ bgcolor: "#ff4081", minWidth: 110, mr: 1, boxShadow: "none" }}
            startIcon={<SearchIcon />}
            // onClick={handleSearch}
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
                <TableCell>Tên nhân viên</TableCell>
                <TableCell>Tên chi nhánh</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Quyền</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData?.map((hr: Hr, idx: number) => (
                <TableRow key={hr.id}>
                  <TableCell align="center">{idx + 1}</TableCell>
                  <TableCell>
                    <Typography
                      component="span"
                      color="#050505"
                      fontWeight={500}
                    >
                      {hr.fullName}
                    </Typography>
                  </TableCell>
                  <TableCell>Iball</TableCell>
                  <TableCell>{hr.phone}</TableCell>
                  <TableCell>
                    <Chip
                      label={getRoleLabel(hr.role)}
                      sx={{
                        bgcolor: roleChipColor[hr.role] ?? "#9e9e9e",
                        color: "#fff",
                      }}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      label={hr.status}
                      sx={{
                        bgcolor: hr.status === "ACTIVE" ? "#34be3b" : "#f44336",
                        color: "#fff",
                      }}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Tooltip title="Sửa">
                      <IconButton size="small" color="primary">
                        <EditIcon onClick={() => handleEdit(hr.id)} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton size="small" color="error">
                        <DeleteIcon onClick={() => handleDelete(hr.id)} />
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
            Bạn có chắc chắn muốn xóa nhân viên này không?
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
        🎧 Nhân sự
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="body1">
          Bạn không có quyền xem trang này!
        </Typography>
      </Paper>
    </Box>
  );
}
