import * as React from "react";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Header from "./Header";

import { Outlet } from "react-router";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const sidebarWidth = sidebarOpen ? 240 : 80;

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          bgcolor: "#f5f5f5",
        }}
      >
        <Header sidebarWidth={sidebarWidth} />
        {/* Content starts below header */}
        <Box sx={{ mt: 1, p: 2, width: "100%" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
