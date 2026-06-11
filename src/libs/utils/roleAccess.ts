export type AppRole = "ADMIN" | "CASHIER" | "STAFF" | "CUSTOMER";

const ADMIN_ONLY_PREFIXES = [
  "/reports",
  "/hr",
  "/warehouse",
  "/customers",
  "/create-user",
];

const CUSTOMER_ALLOWED_PREFIXES = [
  "/marketing",
  "/bookings",
  "/history",
  "/profile",
];

export function canAccessPath(role: AppRole, pathname: string): boolean {
  const path = pathname.split("?")[0];

  if (role === "CUSTOMER") {
    return CUSTOMER_ALLOWED_PREFIXES.some(
      (prefix) => path === prefix || path.startsWith(`${prefix}/`),
    );
  }

  if (role !== "ADMIN") {
    return !ADMIN_ONLY_PREFIXES.some(
      (prefix) => path === prefix || path.startsWith(`${prefix}/`),
    );
  }

  return true;
}

export function getDefaultPathForRole(_role: AppRole): string {
  return "/marketing";
}

export type SidebarMenuItem = {
  text: string;
  path: string;
  roles: AppRole[];
};

export const SIDEBAR_MENU: SidebarMenuItem[] = [
  {
    text: "Marketing",
    path: "/marketing",
    roles: ["ADMIN", "CASHIER", "STAFF", "CUSTOMER"],
  },
  {
    text: "Sales",
    path: "/sales",
    roles: ["ADMIN", "CASHIER", "STAFF"],
  },
  {
    text: "Kho",
    path: "/warehouse",
    roles: ["ADMIN"],
  },
  {
    text: "Đặt bàn",
    path: "/bookings",
    roles: ["ADMIN", "CASHIER", "STAFF", "CUSTOMER"],
  },
  {
    text: "Lịch sử",
    path: "/history",
    roles: ["CUSTOMER"],
  },
  {
    text: "Kế toán",
    path: "/accounting",
    roles: ["ADMIN", "CASHIER", "STAFF"],
  },
  {
    text: "Thu ngân",
    path: "/store",
    roles: ["ADMIN", "CASHIER", "STAFF"],
  },
  {
    text: "Công việc",
    path: "/tasks",
    roles: ["ADMIN", "CASHIER", "STAFF"],
  },
  {
    text: "Khách hàng",
    path: "/customers",
    roles: ["ADMIN"],
  },
  {
    text: "Nhân sự",
    path: "/hr",
    roles: ["ADMIN"],
  },
  {
    text: "Báo cáo",
    path: "/reports",
    roles: ["ADMIN"],
  },
];

export function getMenuItemsForRole(role: AppRole): SidebarMenuItem[] {
  return SIDEBAR_MENU.filter((item) => item.roles.includes(role));
}
