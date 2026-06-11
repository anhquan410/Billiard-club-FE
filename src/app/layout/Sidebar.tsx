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
import EventSeatIcon from "@mui/icons-material/EventSeat";
import CalculateIcon from "@mui/icons-material/Calculate";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import BadgeIcon from "@mui/icons-material/Badge";
import BarChartIcon from "@mui/icons-material/BarChart";
import HistoryIcon from "@mui/icons-material/History";
import StarsIcon from "@mui/icons-material/Stars";
import SettingsIcon from "@mui/icons-material/Settings";
import { useAccount } from "../../libs/hooks/useAccount";
import {
  getDefaultPathForRole,
  getMenuItemsForRole,
  type AppRole,
} from "../../libs/utils/roleAccess";

const DRAWER_WIDTH = 240;

const MENU_ICONS: Record<string, React.ReactNode> = {
  Marketing: <CampaignIcon sx={{ color: "#e91e63" }} />,
  Sales: <HeadsetMicIcon sx={{ color: "#2196f3" }} />,
  Kho: <InventoryIcon sx={{ color: "#ff9800" }} />,
  "Đặt bàn": <EventSeatIcon sx={{ color: "#9c27b0" }} />,
  "Lịch sử": <HistoryIcon sx={{ color: "#ff5722" }} />,
  "Điểm thưởng": <StarsIcon sx={{ color: "#e91e63" }} />,
  "Kế toán": <CalculateIcon sx={{ color: "#3f51b5" }} />,
  "Thu ngân": <StorefrontIcon sx={{ color: "#4caf50" }} />,
  "Công việc": <AssignmentIcon sx={{ color: "#f44336" }} />,
  "Khách hàng": <PeopleIcon sx={{ color: "#ff5722" }} />,
  "Nhân sự": <BadgeIcon sx={{ color: "#795548" }} />,
  "Báo cáo": <BarChartIcon sx={{ color: "#607d8b" }} />,
  "Cài đặt": <SettingsIcon sx={{ color: "#607d8b" }} />,
};

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

export default function Sidebar({ open, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAccount();

  const role = (user?.role ?? "CUSTOMER") as AppRole;
  const menuItems = getMenuItemsForRole(role);
  const homePath = getDefaultPathForRole(role);

  const isSelected = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

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
          overflowY: "auto",
          borderRight: "1px solid #e0e0e0",
          bgcolor: "#ffffff",
        },
      }}
    >
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
          onClick={() => navigate(homePath)}
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

      <List sx={{ pt: 2, px: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            disablePadding
            sx={{ display: "block", mb: 0.5 }}
          >
            <ListItemButton
              selected={isSelected(item.path)}
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
                {MENU_ICONS[item.text]}
              </ListItemIcon>
              {open && <ListItemText primary={item.text} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
