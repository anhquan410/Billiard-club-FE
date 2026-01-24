import * as React from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  IconButton,
  Paper,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import type {
  OrderItem,
  Product,
  TableData,
} from "../../libs/types/store.type";
import TableCard from "../../components/Store/Tablecard";
import OrderModal from "../../components/Store/OrderModal";
import CustomerModal from "../../components/Store/CustumerModal";

export default function StorePage() {
  const [activeTab, setActiveTab] = React.useState(1);
  const [selectedTable, setSelectedTable] = React.useState<TableData | null>(
    null,
  );
  const [orderModalOpen, setOrderModalOpen] = React.useState(false);
  const [customerModalOpen, setCustomerModalOpen] = React.useState(false);
  const [orderItems, setOrderItems] = React.useState<OrderItem[]>([]);

  // Mock data
  const tables: TableData[] = [
    {
      id: 1,
      name: "Bàn 1",
      type: "normal",
      status: "empty",
      totalAmount: 0,
      lightOn: false,
    },
    {
      id: 2,
      name: "Bàn 2",
      type: "normal",
      status: "empty",
      totalAmount: 0,
      lightOn: false,
    },
    {
      id: 3,
      name: "Bàn 3",
      type: "normal",
      status: "empty",
      totalAmount: 0,
      lightOn: false,
    },
    {
      id: 4,
      name: "Bàn 4",
      type: "normal",
      status: "empty",
      totalAmount: 0,
      lightOn: false,
    },
    {
      id: 5,
      name: "Bàn 5",
      type: "normal",
      status: "empty",
      totalAmount: 0,
      lightOn: false,
    },
    {
      id: 6,
      name: "Bàn 6",
      type: "normal",
      status: "empty",
      totalAmount: 0,
      lightOn: false,
    },
    {
      id: 7,
      name: "Bàn 7",
      type: "normal",
      status: "empty",
      totalAmount: 0,
      lightOn: false,
    },
    {
      id: 8,
      name: "Bàn 8",
      type: "normal",
      status: "empty",
      totalAmount: 0,
      lightOn: false,
    },
    {
      id: 9,
      name: "Bàn 9",
      type: "normal",
      status: "empty",
      totalAmount: 0,
      lightOn: false,
    },
    {
      id: 10,
      name: "Bàn 10",
      type: "normal",
      status: "empty",
      totalAmount: 0,
      lightOn: false,
    },
    {
      id: 11,
      name: "Bàn 11",
      type: "normal",
      status: "empty",
      totalAmount: 0,
      lightOn: false,
    },
    {
      id: 12,
      name: "Bàn 12",
      type: "normal",
      status: "empty",
      totalAmount: 0,
      lightOn: false,
    },
    {
      id: 13,
      name: "Bàn 13",
      type: "vip",
      status: "empty",
      totalAmount: 0,
      lightOn: false,
    },
  ];

  const products: Product[] = [
    {
      id: 1,
      name: "7 up",
      price: 25000,
      image: "🥤",
      category: "Food",
      stock: "Còn:  54",
    },
    {
      id: 2,
      name: "Aquarius",
      price: 20000,
      image: "🥤",
      category: "Food",
      stock: "Hết hàng",
    },
    {
      id: 3,
      name: "Ba số đét",
      price: 30000,
      image: "🍺",
      category: "Beer",
      stock: "Hết hàng",
    },
    {
      id: 4,
      name: "Bia Hà Nội",
      price: 30000,
      image: "🍺",
      category: "Beer",
      stock: "Hết hàng",
    },
    {
      id: 5,
      name: "Bia Sài Gòn",
      price: 30000,
      image: "🍺",
      category: "Beer",
      stock: "Hết hàng",
    },
    {
      id: 6,
      name: "Bim Bim L",
      price: 15000,
      image: "🍿",
      category: "Food",
      stock: "Hết hàng",
    },
    {
      id: 7,
      name: "BimBim M",
      price: 10000,
      image: "🍿",
      category: "Food",
      stock: "Hết hàng",
    },
    {
      id: 8,
      name: "Bài",
      price: 15000,
      image: "🎴",
      category: "Khác",
      stock: "Hết hàng",
    },
  ];

  const normalTables = tables.filter((t) => t.type === "normal");
  const vipTables = tables.filter((t) => t.type === "vip");
  const totalTables = tables.length;
  const totalAmount = tables.reduce((sum, table) => sum + table.totalAmount, 0);

  // Handlers
  const handleOpenOrderModal = (table: TableData) => {
    setSelectedTable(table);
    setOrderModalOpen(true);
  };

  const handleCloseOrderModal = () => {
    setOrderModalOpen(false);
    setSelectedTable(null);
    setOrderItems([]);
  };

  const handleOpenCustomerModal = () => {
    setCustomerModalOpen(true);
  };

  const handleCloseCustomerModal = () => {
    setCustomerModalOpen(false);
  };

  const handleSaveCustomer = (data: {
    name: string;
    phone: string;
    group: string;
  }) => {
    console.log("Saving customer:", data);
  };

  const handleAddProduct = (product: Product) => {
    const existingItem = orderItems.find(
      (item) => item.productId === product.id,
    );
    if (existingItem) {
      setOrderItems(
        orderItems.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total: (item.quantity + 1) * item.price,
              }
            : item,
        ),
      );
    } else {
      setOrderItems([
        ...orderItems,
        {
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: 1,
          total: product.price,
        },
      ]);
    }
  };

  const handleRemoveProduct = (productId: number) => {
    setOrderItems(orderItems.filter((item) => item.productId !== productId));
  };

  const handleUpdateQuantity = (productId: number, delta: number) => {
    setOrderItems(
      orderItems
        .map((item) => {
          if (item.productId === productId) {
            const newQuantity = item.quantity + delta;
            if (newQuantity <= 0) return null;
            return {
              ...item,
              quantity: newQuantity,
              total: newQuantity * item.price,
            };
          }
          return item;
        })
        .filter((item) => item !== null) as OrderItem[],
    );
  };

  return (
    <Box>
      {/* Header với Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_e, newValue) => setActiveTab(newValue)}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "14px",
              fontWeight: 500,
            },
            "& . Mui-selected": {
              color: "#2196f3 !important",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#2196f3",
            },
          }}
        >
          <Tab label="Tất cả đơn" />
          <Tab label="Đang phục vụ" />
          <Tab label="Tác nghiệp" />
          <Tab label="Danh sách order" />
        </Tabs>
      </Paper>

      {/* Tab:  Đang phục vụ */}
      {activeTab === 1 && (
        <Box>
          {/* Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Box component="span">📊</Box>}
                sx={{
                  bgcolor: "#ff9800",
                  "&:hover": { bgcolor: "#f57c00" },
                  textTransform: "none",
                }}
              >
                Tổng bàn: {totalTables}
              </Button>
              <Button
                variant="contained"
                startIcon={<Box component="span">💰</Box>}
                sx={{
                  bgcolor: "#4caf50",
                  "&:hover": { bgcolor: "#388e3c" },
                  textTransform: "none",
                }}
              >
                Tổng tiền: {totalAmount.toLocaleString("vi-VN")}
              </Button>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                sx={{
                  bgcolor: "#4caf50",
                  color: "white",
                  "&:hover": { bgcolor: "#388e3c" },
                }}
              >
                <MenuIcon />
              </IconButton>
              <Button
                variant="outlined"
                sx={{
                  textTransform: "none",
                  borderColor: "#e0e0e0",
                  color: "text.primary",
                }}
              >
                Bàn
              </Button>
            </Box>
          </Box>

          {/* Bàn chơi */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
            >
              <Box component="span">▼</Box> Bàn chơi
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 3,
                "@media (min-width: 1400px)": {
                  gridTemplateColumns: "repeat(6, 1fr)",
                },
              }}
            >
              {normalTables.map((table) => (
                <TableCard
                  key={table.id}
                  table={table}
                  onOpenOrder={handleOpenOrderModal}
                />
              ))}
            </Box>
          </Box>

          {/* Bàn VIP */}
          <Box>
            <Typography
              variant="h6"
              sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
            >
              <Box component="span">▼</Box> Bàn Vip
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 3,
                "@media (min-width: 1400px)": {
                  gridTemplateColumns: "repeat(6, 1fr)",
                },
              }}
            >
              {vipTables.map((table) => (
                <TableCard
                  key={table.id}
                  table={table}
                  onOpenOrder={handleOpenOrderModal}
                />
              ))}
            </Box>
          </Box>
        </Box>
      )}

      {/* Các tab khác */}
      {activeTab === 0 && (
        <Box sx={{ py: 8, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            Tab "Tất cả đơn"
          </Typography>
        </Box>
      )}

      {activeTab === 2 && (
        <Box sx={{ py: 8, textAlign: "center" }}>
          <Typography variant="h6" color="text. secondary">
            Tab "Tác nghiệp" đang được phát triển...
          </Typography>
        </Box>
      )}

      {activeTab === 3 && (
        <Box sx={{ py: 8, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            Tab "Danh sách order" đang được phát triển...
          </Typography>
        </Box>
      )}

      {/* Modals */}
      <OrderModal
        open={orderModalOpen}
        table={selectedTable}
        orderItems={orderItems}
        products={products}
        onClose={handleCloseOrderModal}
        onAddProduct={handleAddProduct}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveProduct}
        onOpenCustomerModal={handleOpenCustomerModal}
      />

      <CustomerModal
        open={customerModalOpen}
        onClose={handleCloseCustomerModal}
        onSave={handleSaveCustomer}
      />
    </Box>
  );
}
