import type { BookingStatus } from "../types/booking.type";
import type { DebtStatus, DebtType, TransactionCategory } from "../types/accounting.type";
import type { TaskPriority, TaskStatus } from "../types/task.type";

export const getTaskStatusLabel = (status: TaskStatus) => {
  const map: Record<TaskStatus, string> = {
    TODO: "Chờ làm",
    IN_PROGRESS: "Đang làm",
    DONE: "Hoàn thành",
    CANCELLED: "Đã hủy",
  };
  return map[status];
};

export const getTaskPriorityLabel = (priority: TaskPriority) => {
  const map: Record<TaskPriority, string> = {
    LOW: "Thấp",
    MEDIUM: "Trung bình",
    HIGH: "Cao",
  };
  return map[priority];
};

export const getBookingStatusLabel = (status: BookingStatus) => {
  const map: Record<BookingStatus, string> = {
    PENDING: "Chờ xác nhận",
    CONFIRMED: "Đã xác nhận",
    CANCELLED: "Đã hủy",
    COMPLETED: "Hoàn thành",
    NO_SHOW: "Không đến",
  };
  return map[status];
};

export const getTransactionCategoryLabel = (category: TransactionCategory) => {
  const map: Record<TransactionCategory, string> = {
    TABLE_REVENUE: "Doanh thu bàn",
    PRODUCT_SALES: "Bán hàng",
    IMPORT_COST: "Nhập hàng",
    SALARY: "Lương",
    UTILITIES: "Điện nước",
    MAINTENANCE: "Bảo trì",
    OTHER: "Khác",
  };
  return map[category];
};

export const getDebtTypeLabel = (type: DebtType) =>
  type === "RECEIVABLE" ? "Phải thu" : "Phải trả";

export const getDebtStatusLabel = (status: DebtStatus) => {
  const map: Record<DebtStatus, string> = {
    PENDING: "Chưa thanh toán",
    PARTIAL: "Thanh toán một phần",
    PAID: "Đã thanh toán",
    OVERDUE: "Quá hạn",
  };
  return map[status];
};
