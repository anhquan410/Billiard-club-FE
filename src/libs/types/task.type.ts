export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  assigneeName: string;
  createdBy: string;
  dueDate: string;
  createdAt: string;
  completedAt?: string;
  tags?: string[];
};

export type TaskSummary = {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  overdue: number;
};

export type TaskDashboardData = {
  summary: TaskSummary;
  tasks: Task[];
};
