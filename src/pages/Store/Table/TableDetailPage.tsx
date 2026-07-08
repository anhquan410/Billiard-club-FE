/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Avatar,
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
  Divider,
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
import RemoveIcon from "@mui/icons-material/Remove";
import PrintIcon from "@mui/icons-material/Print";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useProduct } from "../../../libs/hooks/useProduct";
import type { ProductItem } from "../../../libs/types/warehouse.type";
import { useParams } from "react-router-dom";
import { useTable, useTableSession } from "../../../libs/hooks/useTable";
import PaymentModal from "../../../components/Store/PaymentModal";
import FindCustomerDialog, {
  type CustomerOption,
} from "../../../components/Store/FindCustomerDialog";
import AddCustomerDialog from "../../../components/Store/AddCustomerDialog";
import { useSnackbar } from "../../../libs/context/SnackbarContext";
import {
  matchesStoreProductCategory,
  STORE_PRODUCT_CATEGORIES,
} from "../../../libs/utils/productCategories";
import type { ProductCategory } from "../../../libs/types/warehouse.type";
import { getTierLabel } from "../../../libs/utils/bonusLabels";

function getCustomerInitials(fullName: string) {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

const quantityFieldSx = {
  width: 88,
  minWidth: 88,
  "& .MuiInputBase-input": {
    textAlign: "center",
    py: 0.75,
    px: 1,
  },
  "& input[type=number]": {
    MozAppearance: "textfield",
  },
  "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
    {
      WebkitAppearance: "none",
      margin: 0,
    },
};

const quantityInputProps = {
  min: 1,
  step: 1,
};

export default function TableDetailPage() {
  const [productTab, setProductTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<
    ProductCategory | "ALL"
  >("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [openFindCustomer, setOpenFindCustomer] = useState(false);
  const [openAddCustomer, setOpenAddCustomer] = useState(false);
  const [quantityDrafts, setQuantityDrafts] = useState<Record<string, string>>(
    {},
  );
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
    assignCustomer,
    isAssigningCustomer,
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

  const handleAssignCustomer = (customer: CustomerOption) => {
    if (!sessionData?.session?.id || !id) return;

    assignCustomer(
      {
        tableId: id,
        sessionId: sessionData.session.id,
        customerId: customer.id,
      },
      {
        onSuccess: () => {
          showSuccess(`Đã gán khách: ${customer.fullName}`);
        },
        onError: () => {
          showError("Gán khách thất bại!");
        },
      },
    );
  };

  const setServiceQuantity = (serviceId: string, quantity: number) => {
    if (!sessionData?.session) return;

    if (quantity <= 0) {
      handleRemoveService(serviceId);
      return;
    }

    updateServiceQuantity(
      {
        sessionId: sessionData.session.id,
        serviceId,
        quantity,
      },
      {
        onError: () => {
          showError("Cập nhật số lượng thất bại!");
        },
      },
    );
  };

  const handleUpdateQuantity = (
    serviceId: string,
    currentQty: number,
    delta: number,
  ) => {
    setServiceQuantity(serviceId, currentQty + delta);
  };

  const getQuantityDisplay = (serviceId: string, quantity: number) =>
    quantityDrafts[serviceId] ?? String(quantity);

  const handleQuantityInputChange = (serviceId: string, value: string) => {
    if (value === "" || /^\d+$/.test(value)) {
      setQuantityDrafts((prev) => ({ ...prev, [serviceId]: value }));
    }
  };

  const commitQuantityInput = (serviceId: string, currentQty: number) => {
    const draft = quantityDrafts[serviceId];
    setQuantityDrafts((prev) => {
      const next = { ...prev };
      delete next[serviceId];
      return next;
    });

    if (draft === undefined) return;

    const parsed = parseInt(draft, 10);
    if (draft === "" || Number.isNaN(parsed)) return;

    if (parsed !== currentQty) {
      setServiceQuantity(serviceId, parsed);
    }
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
        <Typography variant="h6" sx={{ mb: 2 }}>
          {table?.tableName}
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          {/* Left: Order detail */}
          <Box sx={{ flex: 2, minWidth: 580 }}>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1.5,
                  }}
                >
                  <PersonOutlineIcon color="primary" fontSize="small" />
                  <Typography variant="subtitle2" fontWeight={600}>
                    Khách hàng
                  </Typography>
                </Box>

                {sessionData?.session?.booking && (
                  <Chip
                    size="small"
                    color="secondary"
                    variant="outlined"
                    sx={{ mb: 1.5, maxWidth: "100%", height: "auto", "& .MuiChip-label": { whiteSpace: "normal", py: 0.5 } }}
                    label={`Đặt bàn ${sessionData.session.booking.bookingCode} · ${sessionData.session.booking.customerName} (${sessionData.session.booking.startTime}–${sessionData.session.booking.endTime})`}
                  />
                )}

                {sessionData?.session?.customer ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      p: 1.5,
                      bgcolor: "#f8f8f8",
                      borderRadius: 1.5,
                      // border: "1px solid",
                      borderColor: "divider",
                      mb: 1.5,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 44,
                        height: 44,
                        bgcolor: "primary.main",
                        fontSize: 15,
                        fontWeight: 600,
                      }}
                    >
                      {getCustomerInitials(
                        sessionData.session.customer.fullName,
                      )}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography fontWeight={600} noWrap>
                        {sessionData.session.customer.fullName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {sessionData.session.customer.phone}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1.5,
                          mt: 0.75,
                        }}
                      >
                        <Chip
                          size="small"
                          variant="outlined"
                          label={`Hạng ${getTierLabel(sessionData.session.customer.membershipTier)}`}
                        />
                        <Chip
                          size="small"
                          color="secondary"
                          label={`${sessionData.session.customer.bonusPoints} điểm`}
                        />
                      </Box>
                    </Box>
                    <IconButton
                      size="small"
                      disabled={isAssigningCustomer}
                      onClick={() => {
                        if (!sessionData?.session?.id || !id) return;
                        assignCustomer(
                          {
                            tableId: id,
                            sessionId: sessionData.session.id,
                            customerId: null,
                          },
                          {
                            onSuccess: () => showSuccess("Đã bỏ gán khách"),
                            onError: () => showError("Không thể bỏ gán khách"),
                          },
                        );
                      }}
                      sx={{
                        bgcolor: "background.paper",
                        border: "1px solid",
                        borderColor: "divider",
                        "&:hover": { bgcolor: "error.light", color: "error.contrastText" },
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      p: 2,
                      mb: 1.5,
                      textAlign: "center",
                      borderRadius: 1.5,
                      border: "1px dashed",
                      borderColor: "divider",
                      bgcolor: "#fafafa",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Chưa gán khách hàng
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      Tìm hoặc thêm khách để tích điểm thưởng
                    </Typography>
                  </Box>
                )}

                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<SearchIcon />}
                    onClick={() => setOpenFindCustomer(true)}
                    disabled={!sessionData?.session}
                  >
                    Tìm khách
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<PersonAddIcon />}
                    onClick={() => setOpenAddCustomer(true)}
                    disabled={!sessionData?.session}
                  >
                    Thêm khách mới
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    startIcon={<EditIcon />}
                    sx={{ ml: { sm: "auto" } }}
                  >
                    Ghi chú
                  </Button>
                </Box>
              </Box>

              <Divider sx={{ mb: 2 }} />

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
                        <TextField
                          size="small"
                          value={1}
                          type="number"
                          slotProps={{ input: { readOnly: true } }}
                          sx={quantityFieldSx}
                          inputProps={quantityInputProps}
                        />
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
                    {service.map((item: any) => (
                      <TableRow key={item.id}>
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
                            gap={0.5}
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
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <TextField
                              size="small"
                              value={getQuantityDisplay(item.id, item.quantity)}
                              type="number"
                              disabled={isUpdatingServiceQuantity}
                              onChange={(e) =>
                                handleQuantityInputChange(
                                  item.id,
                                  e.target.value,
                                )
                              }
                              onBlur={() =>
                                commitQuantityInput(item.id, item.quantity)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.currentTarget.blur();
                                }
                              }}
                              sx={quantityFieldSx}
                              inputProps={quantityInputProps}
                            />
                            <IconButton
                              size="small"
                              disabled={isUpdatingServiceQuantity}
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity, 1)
                              }
                            >
                              <AddIcon fontSize="small" />
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
                  customerId={
                    sessionData?.session?.customer?.id ??
                    sessionData?.session?.booking?.customerId
                  }
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
                  setSelectedCategory(val === 0 ? "ALL" : "SERVICE");
                }}
                sx={{ minHeight: 36 }}
              >
                <Tab label="Sản phẩm" />
                <Tab label="Dịch vụ" />
              </Tabs>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", my: 1 }}>
                {(productTab === 0
                  ? STORE_PRODUCT_CATEGORIES
                  : [{ label: "Dịch vụ", value: "SERVICE" as const }]
                ).map((cat) => (
                  <Button
                    key={cat.value}
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setSelectedCategory(cat.value);
                      if (cat.value !== "SERVICE") {
                        setProductTab(0);
                      } else {
                        setProductTab(1);
                      }
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
                    const categoryMatch = matchesStoreProductCategory(
                      p,
                      selectedCategory,
                    );
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

      <FindCustomerDialog
        open={openFindCustomer}
        onClose={() => setOpenFindCustomer(false)}
        onSelect={handleAssignCustomer}
      />
      <AddCustomerDialog
        open={openAddCustomer}
        onClose={() => setOpenAddCustomer(false)}
        onCreated={handleAssignCustomer}
        onError={(msg) => showError(msg)}
      />
    </>
  );
}
