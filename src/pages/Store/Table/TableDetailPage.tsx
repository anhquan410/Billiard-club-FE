/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  TextField,
  Tabs,
  Tab,
  InputAdornment,
  Chip,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PageLoader from "../../../components/common/PageLoader";
import AddIcon from "@mui/icons-material/Add";
import PrintIcon from "@mui/icons-material/Print";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useProduct } from "../../../libs/hooks/useProduct";
import RemoveIcon from "@mui/icons-material/Remove";
import type { ProductItem } from "../../../libs/types/warehouse.type";
import { useParams } from "react-router-dom";
import { useTable, useTableSession } from "../../../libs/hooks/useTable";
import PaymentModal from "../../../components/Store/PaymentModal";
import { useSnackbar } from "../../../libs/context/SnackbarContext";

// Mock data (thay bằng API sau)

export default function TableDetailPage() {
  const [productTab, setProductTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const { products } = useProduct();
  const { showSuccess, showError } = useSnackbar();
  const { id } = useParams<{ id: string }>();
  const { table, isLoadingTable } = useTable(id);

  // console.log(products)

  // Fetch real-time session data từ API - luôn gọi hook
  const {
    sessionData,
    isLoadingSession,
    addServiceToTable,
    removeServiceFromTable,
    updateServiceQuantity,
    isUpdatingServiceQuantity,
  } = useTableSession(id ?? "");

  const service = sessionData?.session?.services || [];

  // console.log("Session data:", sessionData);

  // Handler để thêm sản phẩm vào bàn
  const handleAddService = (productId: string) => {
    if (!sessionData?.session) {
      console.error("No active session for this table.");
      return;
    }
    addServiceToTable(
      {
        sessionId: sessionData.session.id,
        productId,
        quantity: 1,
      },
      {
        onError: () => {
          showError("Thêm món thất bại!");
        },
      },
    );
  };

  // Handle để xóa sản phẩm khỏi bàn
  const handleRemoveService = (serviceId: string) => {
    setDeleteId(serviceId);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      removeServiceFromTable(
        {
          sessionId: sessionData?.session.id ?? "",
          serviceId: deleteId,
        },
        {
          onSuccess: () => {
            showSuccess("Đã xóa món khỏi đơn!");
            setOpenDialog(false);
            setDeleteId(null);
          },
          onError: () => {
            showError("Xóa món thất bại!");
          },
        },
      );
    }
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
    setDeleteId(null);
  };

  const handleUpdateQuantity = (
    serviceId: string,
    currentQty: number,
    delta: number,
  ) => {
    if (!sessionData?.session) return;

    const newQty = currentQty + delta;
    if (newQty <= 0) {
      handleRemoveService(serviceId);
      return;
    }

    updateServiceQuantity(
      {
        sessionId: sessionData.session.id,
        serviceId,
        quantity: newQty,
      },
      {
        onError: () => {
          showError("Cập nhật số lượng thất bại!");
        },
      },
    );
  };

  if (isLoadingTable || isLoadingSession) {
    return <PageLoader color="#4caf50" />;
  }

  if (!id) {
    return <div>Invalid table ID</div>;
  }
  return (
    <>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {table?.tableName}
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          {/* Left: Order detail */}
          <Box sx={{ flex: 2, minWidth: 580 }}>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 1,
                  mb: 1.5,
                }}
              >
                <Button startIcon={<SearchIcon />}>Tìm khách</Button>
                <Button
                  startIcon={<PersonAddIcon />}
                  onClick={() => window.open("/create-user", "_blank")}
                >
                  Thêm khách mới
                </Button>
                <Button>
                  Ghi chú <EditIcon sx={{ fontSize: 16, ml: 0.5 }} />
                </Button>
              </Box>
              {/* Order Table */}
              <Box sx={{ bgcolor: "#f8f8f8", borderRadius: 1, py: 1, mb: 1.5 }}>
                <Typography fontWeight={500} sx={{ px: 2, py: 0.8, pb: 3 }}>
                  Sản phẩm & Dịch vụ
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên</TableCell>
                      <TableCell align="center">Đơn vị</TableCell>
                      <TableCell align="center">SL</TableCell>
                      <TableCell align="center">Thành tiền</TableCell>
                      <TableCell align="center">Nhân viên</TableCell>
                      <TableCell align="center">Vị trí</TableCell>
                      <TableCell align="center">Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Dòng giờ chơi - luôn hiển thị */}
                    <TableRow>
                      <TableCell>
                        <Typography fontWeight={500}>Giờ chơi</Typography>
                        <Typography color="orange" fontWeight={400}>
                          {table?.hourlyRate?.toLocaleString()} đ
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          color="green"
                          fontWeight={500}
                          fontSize={15}
                        >
                          {sessionData?.durationMins} phút
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={1}
                          justifyContent="center"
                        >
                          <TextField
                            size="small"
                            value={1}
                            type="number"
                            disabled
                            inputProps={{
                              style: { width: 36, textAlign: "center" },
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 500 }}>
                        {table?.hourlyRate?.toLocaleString()}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          size="small"
                          label={
                            sessionData?.session?.staff?.fullName || "Admin"
                          }
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip size="small" label={table?.tableName} />
                      </TableCell>
                      <TableCell align="center">
                        {/* Không có nút xóa cho giờ chơi */}
                      </TableCell>
                    </TableRow>

                    {/* Danh sách sản phẩm/dịch vụ */}
                    {service.map((item: any, idx: number) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <Typography fontWeight={500}>
                            {item.product.name}
                          </Typography>
                          <Typography color="orange" fontWeight={400}>
                            {item.price.toLocaleString()} đ{" "}
                            <EditIcon
                              fontSize="small"
                              color="disabled"
                              sx={{
                                verticalAlign: "middle",
                                cursor: "pointer",
                              }}
                            />
                          </Typography>
                          <Typography
                            color="green"
                            fontWeight={500}
                            fontSize={15}
                          >
                            {item.elapsed}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {item.product.unit}
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            justifyContent="center"
                          >
                            <IconButton
                              size="small"
                              disabled={isUpdatingServiceQuantity}
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.id,
                                  item.quantity,
                                  -1,
                                )
                              }
                            >
                              <RemoveIcon />
                            </IconButton>
                            <TextField
                              size="small"
                              value={item.quantity}
                              type="number"
                              disabled
                              inputProps={{
                                style: { width: 36, textAlign: "center" },
                              }}
                            />
                            <IconButton
                              size="small"
                              disabled={isUpdatingServiceQuantity}
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity, 1)
                              }
                            >
                              <AddIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 500 }}>
                          {item.subtotal}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            size="small"
                            label={sessionData?.session?.staff?.fullName || "Admin"}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            size="small"
                            label={sessionData.table.tableName}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              handleRemoveService(item?.id);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Paper>
            {/* Thanh toán summary */}
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography fontWeight={500}>Thời gian chơi</Typography>
                <Typography color="green" fontWeight={500}>
                  {sessionData?.durationMins} phút
                </Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: 2 }}
              >
                <Typography fontWeight={500}>
                  Thành tiền thời gian chơi
                </Typography>
                <Typography>
                  {Number(sessionData?.currentTablePrice || 0).toLocaleString(
                    "vi-VN",
                    { maximumFractionDigits: 0 },
                  )}{" "}
                  VNĐ
                </Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: 2 }}
              >
                <Typography fontWeight={500}>Thành tiền dịch vụ</Typography>
                <Typography>
                  {Number(sessionData?.servicesTotal || 0).toLocaleString(
                    "vi-VN",
                    { maximumFractionDigits: 0 },
                  )}{" "}
                  VNĐ
                </Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: 2 }}
              >
                <Typography fontWeight={500}>Tổng thanh toán</Typography>
                <Typography>
                  {Number(sessionData?.estimatedTotal || 0).toLocaleString(
                    "vi-VN",
                    { maximumFractionDigits: 0 },
                  )}{" "}
                  VNĐ
                </Typography>
              </Box>

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                gap={2}
                sx={{ mt: 5 }}
              >
                <Button variant="contained" sx={{ bgcolor: "#fb85a6" }}>
                  Tính năng khác
                </Button>
                <Button
                  variant="contained"
                  sx={{ bgcolor: "#fb85a6" }}
                  startIcon={<PrintIcon />}
                >
                  In hóa đơn
                </Button>
                <Button variant="contained" sx={{ bgcolor: "#fb85a6" }}>
                  Y/c thanh toán
                </Button>
                <Button variant="contained" sx={{ bgcolor: "#fb3449" }}>
                  Hủy hóa đơn
                </Button>
                <Button
                  variant="contained"
                  sx={{ bgcolor: "#35d87a" }}
                  onClick={() => setOpen(true)}
                >
                  Thanh toán
                </Button>
                <PaymentModal
                  open={open}
                  onClose={() => setOpen(false)}
                  total={sessionData?.estimatedTotal || 0}
                  sessionId={sessionData?.session?.id || ""}
                  tableId={sessionData?.table.id || ""}
                />
              </Box>
            </Paper>
          </Box>

          {/* Right: Product List panel */}
          <Box sx={{ flex: 1.15, minWidth: 280 }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Tìm kiếm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <Tabs
                value={productTab}
                onChange={(_, val) => {
                  setProductTab(val);
                  setSelectedCategory(val === 0 ? "ALL" : "EQUIPMENT");
                }}
                sx={{ minHeight: 36 }}
              >
                <Tab label="Sản phẩm" />
                <Tab label="Dịch vụ" />
              </Tabs>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", my: 1 }}>
                {[
                  { label: "Tất cả", value: "ALL" },
                  { label: "Đồ ăn", value: "FOOD" },
                  { label: "Bia", value: "BEER" },
                  { label: "Nước ngọt có gas", value: "SODA" },
                  { label: "Nước ngọt không gas", value: "BEVERAGE" },
                  { label: "Thuốc lá", value: "CIGARETTE" },
                  { label: "Cà phê", value: "COFFEE" },
                  { label: "Khác", value: "OTHER" },
                ].map((cat, i) => (
                  <Button
                    key={i}
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setSelectedCategory(cat.value);
                      setProductTab(0);
                    }}
                    sx={{
                      borderRadius: 5,
                      borderColor:
                        selectedCategory === cat.value ? "#fb85a6" : "#ddd",
                      color:
                        selectedCategory === cat.value ? "#fb85a6" : "#666",
                      bgcolor:
                        selectedCategory === cat.value
                          ? "#fff5f7"
                          : "transparent",
                      px: 2,
                      minWidth: 60,
                      minHeight: 28,
                      fontWeight: selectedCategory === cat.value ? 600 : 500,
                    }}
                  >
                    {cat.label}
                  </Button>
                ))}
              </Box>
              <Box sx={{ maxHeight: 370, overflowY: "auto", pr: 1 }}>
                {products
                  ?.filter((p: ProductItem) => {
                    // Filter by category
                    const categoryMatch =
                      selectedCategory === "ALL" ||
                      p.category === selectedCategory;
                    // Filter by search term
                    const searchMatch =
                      searchTerm === "" ||
                      p.name.toLowerCase().includes(searchTerm.toLowerCase());
                    return categoryMatch && searchMatch;
                  })
                  .map((p: ProductItem) => (
                    <Box
                      key={p.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        py: 1.2,
                        borderBottom: "1px dashed #f2b0c3",
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontWeight: 500 }}>
                          {p.name}
                        </Typography>
                        <Typography color="#fb85a6" fontWeight={500}>
                          {p.price.toLocaleString()} đ&nbsp;&nbsp;
                          {p.stock > 0 ? (
                            <Typography
                              component="span"
                              color="success.main"
                              fontSize={14}
                            >
                              Còn : {p.stock}
                            </Typography>
                          ) : (
                            <Typography
                              component="span"
                              color="error"
                              fontSize={14}
                            >
                              Hết hàng
                            </Typography>
                          )}
                        </Typography>
                      </Box>
                      <IconButton
                        onClick={() => {
                          handleAddService(p.id);
                        }}
                        disabled={p.stock <= 0}
                        sx={{
                          bgcolor: "#fb85a6",
                          color: "#fff",
                          "&:hover": { bgcolor: "#1976d2" },
                          "&:disabled": { bgcolor: "#ccc" },
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  ))}
              </Box>
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() =>
                  window.open("/warehouse/products/create-product", "_blank")
                }
              >
                <IconButton>
                  <AddIcon />
                </IconButton>
                <Typography color="gray" sx={{ ml: 1, fontSize: 15 }}>
                  Tạo sản phẩm mới
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
      {/* Dialog xác nhận xóa */}
      <Dialog open={openDialog} onClose={handleCancelDelete} disableScrollLock>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>Bạn có chắc chắn muốn xóa ?</DialogContentText>
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
  );
}
