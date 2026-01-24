import { Box, CssBaseline } from "@mui/material";
import { Outlet } from "react-router";
import ScrollToTop from "../../components/ScrollToTop";

export default function App() {
  return (
    <Box sx={{ bgcolor: "#eeeeee", minHeight: "100vh" }}>
      <CssBaseline />

      <ScrollToTop />
      <Box sx={{ pt: 7 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
