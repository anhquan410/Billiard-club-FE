import { createBrowserRouter } from "react-router-dom";
import LoginForm from "../../pages/Accounts/LoginForm";
import RegisterForm from "../../pages/Accounts/RegisterForm";
import HomePage from "../../pages/Home/HomePage";
import MarketingPage from "../../pages/Marketing/MarketingPage";
import SalesPage from "../../pages/Sales/SalesPage";
import StorePage from "../../pages/Store/StorePage";
import ExportReceipts from "../../pages/WareHouse/ExportReceipts";
import ImportReceipts from "../../pages/WareHouse/ImportReceipts";
import InventoryManagementPage from "../../pages/WareHouse/InventoryManagementPage";
import ProductManagementPage from "../../pages/WareHouse/ProductManagementPage";
import WarehousePage from "../../pages/WareHouse/WarehousePage";
import App from "../layout/App";
import MainLayout from "../layout/MainLayout";
import RequireAuth from "./RequireAuth";
import ProfilePage from "../../pages/User/ProfilePage";
import ChangePasswordPage from "../../pages/User/ChangePasswordPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Trang chủ (giới thiệu) cho tất cả mọi người
      { index: true, element: <HomePage /> },

      // Dashboard cho user đã đăng nhập
      {
        element: <RequireAuth />,
        children: [
          {
            element: <MainLayout />,
            children: [
              { path: "marketing", element: <MarketingPage /> },
              { path: "sales", element: <SalesPage /> },
              {
                path: "warehouse",
                element: <WarehousePage />,
                children: [
                  { index: true, element: <InventoryManagementPage /> },
                  { path: "import", element: <ImportReceipts /> },
                  { path: "export", element: <ExportReceipts /> },
                  { path: "stocktaking", element: <InventoryManagementPage /> },
                  { path: "products", element: <ProductManagementPage /> },
                ],
              },
              { path: "purchasing", element: <div>Trang Mua hàng</div> },
              { path: "accounting", element: <div>Trang Kế toán</div> },
              { path: "store", element: <StorePage /> },
              { path: "tasks", element: <div>Trang Công việc</div> },
              { path: "customers", element: <div>Trang Khách hàng</div> },
              { path: "hr", element: <div>Trang Nhân sự</div> },
              { path: "reports", element: <div>Trang Báo cáo</div> },
              { path: "profile/:id", element: <ProfilePage /> },
              {path: "profile/:id/password-change", element: <ChangePasswordPage /> },
            ],
          },
        ],
      },

      { path: "auth/login", element: <LoginForm /> },
      { path: "auth/register", element: <RegisterForm /> },
    ],
  },
]);
