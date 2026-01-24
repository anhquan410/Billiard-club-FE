import * as React from "react";
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Pagination,
  Typography,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  Menu,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SettingsIcon from "@mui/icons-material/Settings";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { ProductItem } from "../../libs/types/warehouse.type";

export default function ProductManagementPage() {
  const [searchText, setSearchText] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [selectedProducts, setSelectedProducts] = React.useState<number[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedProductId, setSelectedProductId] = React.useState<
    number | null
  >(null);

  // Mock data
  const products: ProductItem[] = [
    {
      id: 1,
      name: "Khăn lạnh",
      code: "KL001",
      image: "🧻",
      category: "Phụ kiện",
      unit: "Cái",
      price: 5000,
      cost: 3000,
      stock: -4,
      status: "active",
    },
    {
      id: 2,
      name: "Bò húc",
      code: "BH001",
      image: "🥫",
      category: "Nước ngọt",
      unit: "Lon",
      price: 30000,
      cost: 20000,
      stock: 0,
      status: "active",
    },
    {
      id: 3,
      name: "7 up",
      code: "7UP001",
      image: "🥤",
      category: "Nước ngọt",
      unit: "Lon",
      price: 25000,
      cost: 15000,
      stock: 54,
      status: "active",
    },
    {
      id: 4,
      name: "Ô Long",
      code: "OL001",
      image: "🍵",
      category: "Trà",
      unit: "Chai",
      price: 25000,
      cost: 18000,
      stock: -3,
      status: "active",
    },
    {
      id: 5,
      name: "Trà xanh 0 độ",
      code: "TX001",
      image: "🍵",
      category: "Trà",
      unit: "Chai",
      price: 25000,
      cost: 18000,
      stock: 0,
      status: "active",
    },
    {
      id: 6,
      name: "Coca - Pepsi",
      code: "CP001",
      image: "🥤",
      category: "Nước ngọt",
      unit: "Lon",
      price: 25000,
      cost: 16000,
      stock: 6,
      status: "active",
    },
    {
      id: 7,
      name: "Sting vàng",
      code: "ST001",
      image: "⚡",
      category: "Nước tăng lực",
      unit: "Lon",
      price: 25000,
      cost: 17000,
      stock: 36,
      status: "active",
    },
  ];

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedProducts(products.map((p) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectOne = (id: number) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter((pid) => pid !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLElement>,
    productId: number,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedProductId(productId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedProductId(null);
  };

  const isAllSelected =
    selectedProducts.length === products.length && products.length > 0;
  const isSomeSelected =
    selectedProducts.length > 0 && selectedProducts.length < products.length;

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          bgcolor: "white",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Quản lý sản phẩm
        </Typography>

        <IconButton
          sx={{
            bgcolor: "#f5f5f5",
            "&:hover": { bgcolor: "#e0e0e0" },
          }}
        >
          <SettingsIcon />
        </IconButton>
      </Box>

      {/* Actions & Search */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          bgcolor: "white",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<MoreVertIcon />}
            sx={{
              borderColor: "#f06292",
              color: "#f06292",
              textTransform: "none",
              "&:hover": {
                borderColor: "#ec407a",
                bgcolor: "#fce4ec",
              },
            }}
          >
            Chức năng khác
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              bgcolor: "#f06292",
              "&:hover": { bgcolor: "#ec407a" },
              textTransform: "none",
            }}
          >
            Thêm mới
          </Button>
        </Box>

        <TextField
          size="small"
          placeholder="Tên"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ width: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    bgcolor: "#f06292",
                    "&: hover": { bgcolor: "#ec407a" },
                    textTransform: "none",
                  }}
                >
                  Tìm kiếm
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isSomeSelected}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>STT</TableCell>
              <TableCell>Ảnh</TableCell>
              <TableCell>Sản phẩm</TableCell>
              <TableCell>Nhà sản xuất</TableCell>
              <TableCell align="right">Giá bán</TableCell>
              <TableCell align="center">Sử dụng</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product, index) => (
              <TableRow
                key={product.id}
                hover
                sx={{
                  "&:hover": {
                    bgcolor: "#fafafa",
                  },
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelectOne(product.id)}
                  />
                </TableCell>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      bgcolor: "#f5f5f5",
                      fontSize: "28px",
                      borderRadius: 2,
                    }}
                  >
                    {product.image}
                  </Avatar>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={500}>{product.name}</Typography>
                  <IconButton size="small" color="error" sx={{ ml: 1 }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text. secondary">
                    -
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography fontWeight={500}>
                    {product.price.toLocaleString("vi-VN")}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    sx={{
                      color: "#4caf50",
                    }}
                  >
                    <CheckCircleIcon />
                  </IconButton>
                </TableCell>
                <TableCell align="center">
                  <Box
                    sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}
                  >
                    <IconButton
                      size="small"
                      sx={{
                        border: "1px solid #e0e0e0",
                        borderRadius: 1,
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => handleOpenMenu(e, product.id)}
                      sx={{
                        border: "1px solid #e0e0e0",
                        borderRadius: 1,
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Xem chi tiết</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCloseMenu}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Chỉnh sửa</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCloseMenu}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Sao chép</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCloseMenu}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: "error.main" }}>Xóa</ListItemText>
        </MenuItem>
      </Menu>

      {/* Pagination */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          bgcolor: "white",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          1 - 10 of 65 items
        </Typography>
        <Pagination
          count={7}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
          sx={{
            "& . Mui-selected": {
              bgcolor: "#f06292 !important",
              color: "white",
            },
          }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select defaultValue={10}>
            <MenuItem value={10}>10 / trang</MenuItem>
            <MenuItem value={20}>20 / trang</MenuItem>
            <MenuItem value={50}>50 / trang</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
