import { useState } from "react";
import {
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useNotifications } from "../../libs/hooks/useNotifications";

export default function NotificationBell() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    isMarkingAllRead,
  } = useNotifications();

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Badge
          badgeContent={unreadCount}
          color="error"
          max={99}
          invisible={unreadCount === 0}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { width: 360, maxHeight: 420 } } }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography fontWeight={600}>Thông báo</Typography>
          {unreadCount > 0 && (
            <Button
              size="small"
              onClick={() => markAllAsRead()}
              disabled={isMarkingAllRead}
            >
              Đọc tất cả
            </Button>
          )}
        </Box>
        <Divider />

        {notifications.length === 0 ? (
          <Typography color="text.secondary" sx={{ p: 3, textAlign: "center" }}>
            Chưa có thông báo
          </Typography>
        ) : (
          <List dense sx={{ overflow: "auto", maxHeight: 320 }}>
            {notifications.map((item) => (
              <ListItem
                key={item.id}
                alignItems="flex-start"
                sx={{
                  bgcolor: item.isRead ? "transparent" : "action.hover",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (!item.isRead) markAsRead(item.id);
                }}
              >
                <ListItemText
                  primary={item.message}
                  secondary={formatDistanceToNow(new Date(item.createdAt), {
                    addSuffix: true,
                    locale: vi,
                  })}
                  primaryTypographyProps={{ fontSize: 14 }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Popover>
    </>
  );
}
