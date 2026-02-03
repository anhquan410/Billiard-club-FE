import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CampaignIcon from "@mui/icons-material/Campaign";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CalculateIcon from "@mui/icons-material/Calculate";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import BadgeIcon from "@mui/icons-material/Badge";
import BarChartIcon from "@mui/icons-material/BarChart";

const DRAWER_WIDTH = 240;

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

const menuItems: MenuItem[] = [
  {
    text: "Marketing",
    icon: <CampaignIcon sx={{ color: "#e91e63" }} />,
    path: "/marketing",
  },
  {
    text: "Sales",
    icon: <HeadsetMicIcon sx={{ color: "#2196f3" }} />,
    path: "/sales",
  },
  {
    text: "Kho",
    icon: <InventoryIcon sx={{ color: "#ff9800" }} />,
    path: "/warehouse",
  },
  {
    text: "Mua hàng",
    icon: <ShoppingCartIcon sx={{ color: "#9c27b0" }} />,
    path: "/purchasing",
  },
  {
    text: "Kế toán",
    icon: <CalculateIcon sx={{ color: "#3f51b5" }} />,
    path: "/accounting",
  },
  {
    text: "Thu ngân",
    icon: <StorefrontIcon sx={{ color: "#4caf50" }} />,
    path: "/store",
  },
  {
    text: "Công việc",
    icon: <AssignmentIcon sx={{ color: "#f44336" }} />,
    path: "/tasks",
  },
  {
    text: "Khách hàng",
    icon: <PeopleIcon sx={{ color: "#ff5722" }} />,
    path: "/customers",
  },
  {
    text: "Nhân sự",
    icon: <BadgeIcon sx={{ color: "#795548" }} />,
    path: "/hr",
  },
  {
    text: "Báo cáo",
    icon: <BarChartIcon sx={{ color: "#607d8b" }} />,
    path: "/reports",
  },
];

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

// ...  (giữ nguyên phần import và menuItems)

export default function Sidebar({ open, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? DRAWER_WIDTH : 80,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? DRAWER_WIDTH : 80,
          boxSizing: "border-box",
          transition: "width 0.3s",
          overflowX: "auto",
          overflowY: "auto", // Đảm bảo luôn có scroll dọc nếu cần
          borderRight: "1px solid #e0e0e0",
          bgcolor: "#ffffff",
        },
      }}
    >
      {/* Logo Section với background */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: open ? "row" : "column",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          minHeight: 80,
          gap: 1,
          bgcolor: "#fafafa",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        {/* Logo iBall Billiard */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            order: open ? 1 : 2,
            p: 1,
            borderRadius: 1,
            transition: "all 0.3s",
            "&:hover": {
              bgcolor: "rgba(0, 0, 0, 0.04)",
            },
          }}
          onClick={() => navigate("/marketing")}
        >
          <img
            src="/Iball_logo-removebg-preview.png"
            alt="iBall Billiard"
            style={{
              width: open ? "160px" : "45px",
              height: "auto",
              objectFit: "contain",
              transition: "all 0.4s ease",
            }}
          />
        </Box>

        {/* Menu Toggle Button */}
        <IconButton
          onClick={onToggle}
          size="small"
          sx={{
            order: open ? 2 : 1,
            bgcolor: "white",
            "&:hover": {
              bgcolor: "#f0f0f0",
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Menu Items */}
      <List sx={{ pt: 2, px: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            disablePadding
            sx={{ display: "block", mb: 0.5 }}
          >
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                borderRadius: 1,
                "&:hover": {
                  bgcolor: "#f5f5f5",
                },
                "&.Mui-selected": {
                  bgcolor: "#e3f2fd",
                  "&:hover": {
                    bgcolor: "#bbdefb",
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : "auto",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {open && <ListItemText primary={item.text} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
