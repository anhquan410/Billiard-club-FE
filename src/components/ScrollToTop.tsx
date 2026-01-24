import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Luôn scroll về đầu trang khi pathname đổi
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Không render gì cả
}