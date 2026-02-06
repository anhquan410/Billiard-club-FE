import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Paper,
} from "@mui/material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import BarChartIcon from "@mui/icons-material/BarChart";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useState } from "react";

export default function WarehousePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openInventory, setOpenInventory] = useState(true);

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <Box sx={{ display: "flex", minHeight: "calc(100vh - 100px)" }}>
      {/* Sidebar Menu */}
      <Paper
        sx={{
          width: 280,
          borderRight: "1px solid #e0e0e0",
          bgcolor: "white",
          overflow: "auto",
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
              pb: 2,
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <InventoryIcon sx={{ color: "#f06292" }} />
            <Box>
              <Box sx={{ fontWeight: "bold", fontSize: "16px" }}>Tồn kho</Box>
            </Box>
          </Box>

          <List component="nav" sx={{ p: 0 }}>
            {/* Quản lý tồn kho - expandable */}
            <ListItemButton
              onClick={() => setOpenInventory(!openInventory)}
              sx={{
                bgcolor: openInventory ? "#fce4ec" : "transparent",
                borderRadius: 1,
                mb: 0.5,
                "&:hover": {
                  bgcolor: "#fce4ec",
                },
              }}
            >
              <ListItemIcon>
                <InventoryIcon sx={{ color: "#f06292" }} />
              </ListItemIcon>
              <ListItemText
                primary="Quản lý tồn kho"
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: "14px",
                }}
              />
              {openInventory ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={openInventory} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  onClick={() => navigate("/warehouse")}
                  selected={
                    isActive("/warehouse") && location.pathname === "/warehouse"
                  }
                  sx={{
                    pl: 4,
                    borderRadius: 1,
                    mb: 0.5,
                    "&.Mui-selected": {
                      bgcolor: "#f06292",
                      color: "white",
                      "&:hover": {
                        bgcolor: "#ec407a",
                      },
                      "& .MuiListItemIcon-root": {
                        color: "white",
                      },
                    },
                  }}
                >
                  <ListItemIcon>
                    <BarChartIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Quản lý kho hàng"
                    primaryTypographyProps={{
                      fontSize: "13px",
                    }}
                  />
                </ListItemButton>

                <ListItemButton
                  onClick={() => navigate("/warehouse/import")}
                  selected={isActive("/warehouse/import")}
                  sx={{
                    pl: 4,
                    borderRadius: 1,
                    mb: 0.5,
                    "&.Mui-selected": {
                      bgcolor: "#f06292",
                      color: "white",
                      "&:hover": {
                        bgcolor: "#ec407a",
                      },
                      "& .MuiListItemIcon-root": {
                        color: "white",
                      },
                    },
                  }}
                >
                  <ListItemIcon>
                    <ReceiptIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phiếu nhập"
                    primaryTypographyProps={{
                      fontSize: "13px",
                    }}
                  />
                </ListItemButton>

                <ListItemButton
                  onClick={() => navigate("/warehouse/export")}
                  selected={isActive("/warehouse/export")}
                  sx={{
                    pl: 4,
                    borderRadius: 1,
                    mb: 0.5,
                    "&.Mui-selected": {
                      bgcolor: "#f06292",
                      color: "white",
                      "&:hover": {
                        bgcolor: "#ec407a",
                      },
                      "&.MuiListItemIcon-root": {
                        color: "white",
                      },
                    },
                  }}
                >
                  <ListItemIcon>
                    <LocalShippingIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phiếu xuất"
                    primaryTypographyProps={{
                      fontSize: "13px",
                    }}
                  />
                </ListItemButton>
              </List>
            </Collapse>

            {/* Quản lý sản phẩm - single item */}
            <ListItemButton
              onClick={() => navigate("/warehouse/products")}
              selected={isActive("/warehouse/products")}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                "&.Mui-selected": {
                  bgcolor: "#f06292",
                  color: "white",
                  "&:hover": {
                    bgcolor: "#ec407a",
                  },
                  "&.MuiListItemIcon-root": {
                    color: "white",
                  },
                },
                "&:hover": {
                  bgcolor: "#fce4ec",
                },
              }}
            >
              <ListItemIcon>
                <CategoryIcon
                  sx={{
                    color: isActive("/warehouse/products")
                      ? "white"
                      : "#4caf50",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary="Quản lý sản phẩm"
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: "14px",
                }}
              />
            </ListItemButton>
          </List>
        </Box>
      </Paper>

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, bgcolor: "#f5f5f5" }}>
        <Outlet />
      </Box>
    </Box>
  );
}
