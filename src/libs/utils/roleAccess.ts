/* eslint-disable @typescript-eslint/no-unused-vars */
export type AppRole = "ADMIN" | "CASHIER" | "STAFF" | "CUSTOMER";

const ADMIN_ONLY_PREFIXES = [
  "/reports",
  "/hr",
  "/warehouse",
  "/customers",
  "/create-user",
  "/settings",
];

const CUSTOMER_ALLOWED_PREFIXES = [
  "/marketing",
  "/bookings",
  "/history",
  "/bonus",
  "/profile",
];

const STAFF_ALLOWED_PREFIXES = [
  "/marketing",
  "/bookings",
  "/store",
  "/tasks",
  "/profile",
];

export function canAccessPath(role: AppRole, pathname: string): boolean {
  const path = pathname.split("?")[0];

  if (role === "CUSTOMER") {
    return CUSTOMER_ALLOWED_PREFIXES.some(
      (prefix) => path === prefix || path.startsWith(`${prefix}/`),
    );
  }

  if (role === "STAFF") {
    return STAFF_ALLOWED_PREFIXES.some(
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
    roles: ["ADMIN", "CASHIER"],
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
    text: "Điểm thưởng",
    path: "/bonus",
    roles: ["CUSTOMER"],
  },
  {
    text: "Kế toán",
    path: "/accounting",
    roles: ["ADMIN", "CASHIER"],
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
  {
    text: "Cài đặt",
    path: "/settings/bonus",
    roles: ["ADMIN"],
  },
];

export function getMenuItemsForRole(role: AppRole): SidebarMenuItem[] {
  return SIDEBAR_MENU.filter((item) => item.roles.includes(role));
}

const ROLE_LABELS: Record<AppRole, string> = {
  ADMIN: "Admin",
  CASHIER: "Thu ngân",
  STAFF: "Nhân viên",
  CUSTOMER: "Khách hàng",
};

export function getRoleLabel(role: string): string {
  return ROLE_LABELS[role as AppRole] ?? role;
}

export const STAFF_ROLES: AppRole[] = ["ADMIN", "CASHIER", "STAFF"];
