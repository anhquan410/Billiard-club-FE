import { createBrowserRouter } from "react-router-dom";
import LoginForm from "../../pages/Accounts/LoginForm";
import RegisterForm from "../../pages/Accounts/RegisterForm";
import HomePage from "../../pages/Home/HomePage";
import MarketingPage from "../../pages/Marketing/MarketingPage";
import SalesPage from "../../pages/Sales/SalesPage";
import StorePage from "../../pages/Store/StorePage";
import InventoryManagementPage from "../../pages/WareHouse/InventoryManagementPage";
import ProductManagementPage from "../../pages/WareHouse/Products/ProductManagementPage";
import WarehousePage from "../../pages/WareHouse/WarehousePage";
import App from "../layout/App";
import MainLayout from "../layout/MainLayout";
import RequireAuth from "./RequireAuth";
import ProfilePage from "../../pages/User/ProfilePage";
import ChangePasswordPage from "../../pages/User/ChangePasswordPage";
import HrPage from "../../pages/HumanResources/HrPage";
import CustomerPage from "../../pages/Customer/CustomerPage";
import ReportPage from "../../pages/Report/ReportPage";
import PurchasingPage from "../../pages/Purchasing/PurchasingPage";
import AccountingPage from "../../pages/Accounting/AccountingPage";
import TasksPage from "../../pages/Tasks/TasksPage";
import ProductDetailPage from "../../pages/WareHouse/Products/ProductDetailPage";
import ImportReceipts from "../../pages/WareHouse/Receipts/ImportReceipts";
import ExportReceipts from "../../pages/WareHouse/Receipts/ExportReceipts";
import CreateUserForm from "../../components/Form/CreateUserForm";
import CreateProductForm from "../../components/Form/CreateProductForm";
import TableDetailPage from "../../pages/Store/Table/TableDetailPage";

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
                  { path: "products", element: <ProductManagementPage /> },
                  { path: "products/:id", element: <ProductDetailPage /> },
                  {
                    path: "products/create-product",
                    element: <CreateProductForm />,
                  },
                ],
              },
              { path: "purchasing", element: <PurchasingPage /> },
              { path: "accounting", element: <AccountingPage /> },
              {
                path: "store",
                element: <StorePage />,
                children: [
                  { index: true, element: <div /> },
                  { path: "table/:id", element: <TableDetailPage /> },
                ],
              },
              { path: "tasks", element: <TasksPage /> },
              { path: "customers", element: <CustomerPage /> },
              { path: "hr", element: <HrPage /> },
              { path: "reports", element: <ReportPage /> },
              { path: "profile/:id", element: <ProfilePage /> },
              {
                path: "profile/:id/password-change",
                element: <ChangePasswordPage />,
              },
              { path: "create-user", element: <CreateUserForm /> },
            ],
          },
        ],
      },

      { path: "auth/login", element: <LoginForm /> },
      { path: "auth/register", element: <RegisterForm /> },
    ],
  },
]);
