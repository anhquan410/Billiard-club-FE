import * as React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Box,
  Select,
  MenuItem,
  FormControl,
  Menu,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import LanguageIcon from "@mui/icons-material/Language";
import NotificationBell from "../../components/common/NotificationBell";
import AppsIcon from "@mui/icons-material/Apps";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { useNavigate } from "react-router-dom";
import { useAccount } from "../../libs/hooks/useAccount";
import { useProfile } from "../../libs/hooks/useProfile";
import { useSnackbar } from "../../libs/context/SnackbarContext";

interface HeaderProps {
  sidebarWidth: number;
}

export default function Header({ sidebarWidth }: HeaderProps) {
  const [website, setWebsite] = React.useState("Website");
  const [app, setApp] = React.useState("iBall");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { user, logoutUser } = useAccount();
  const { profile } = useProfile(user?.id);
  const { showSuccess } = useSnackbar();

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleProfile = () => {
    // TODO: Chuyển hướng hoặc mở modal thông tin cá nhân
    navigate(`/profile/${user?.id}`);
    handleClose();
  };
  const handleLogout = () => {
    logoutUser.mutate(undefined, {
      onSuccess: () => {
        showSuccess("Đăng xuất thành công!");
      },
    });
    handleClose();
  };
  const handleChangePassword = () => {
    navigate(`/profile/${user?.id}/password-change`);
    handleClose();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        left: sidebarWidth,
        width: `calc(100% - ${sidebarWidth}px)`,
        bgcolor: "white",
        color: "text.primary",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        transition: "all 0.3s",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left side - Dropdowns */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              displayEmpty
              startAdornment={
                <LanguageIcon
                  sx={{ mr: 1, color: "text.secondary", fontSize: 20 }}
                />
              }
              MenuProps={{ container: document.body, disableScrollLock: true }}
            >
              <MenuItem value="Website">Website</MenuItem>
              <MenuItem value="App">App</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={app}
              onChange={(e) => setApp(e.target.value)}
              displayEmpty
              startAdornment={
                <AppsIcon
                  sx={{ mr: 1, color: "text.secondary", fontSize: 20 }}
                />
              }
              MenuProps={{ container: document.body, disableScrollLock: true }}
            >
              <MenuItem value="iBall">iBall</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Right side - Notifications & Avatar */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <NotificationBell />

          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: "#bdbdbd",
              cursor: "pointer",
            }}
            onClick={handleAvatarClick}
          >
            {profile?.fullName.charAt(0).toUpperCase()}
          </Avatar>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            container={document.body}
            disableScrollLock={true}
          >
            <MenuItem onClick={handleProfile}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Thông tin cá nhân</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Đăng xuất</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleChangePassword}>
              <ListItemIcon>
                <VpnKeyIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Đổi mật khẩu</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
