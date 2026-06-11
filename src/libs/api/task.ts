import agent from "./agent";
import type { Task, TaskDashboardData, TaskStatus } from "../types/task.type";

export type TaskQueryParams = {
  status?: TaskStatus;
};

export type CreateTaskPayload = {
  title: string;
  description?: string;
  priority?: Task["priority"];
  assigneeId: string;
  dueDate: string;
  tags?: string[];
};

export async function getTaskDashboard(params: TaskQueryParams = {}) {
  const searchParams = new URLSearchParams();
  if (params.status) searchParams.set("status", params.status);

  const query = searchParams.toString();
  const response = await agent.get<TaskDashboardData>(
    `/tasks/dashboard${query ? `?${query}` : ""}`,
  );
  return response.data;
}

export async function createTask(payload: CreateTaskPayload) {
  const response = await agent.post<Task>("/tasks", payload);
  return response.data;
}

export async function updateTaskStatus(id: string, status: TaskStatus) {
  const response = await agent.patch<Task>(`/tasks/${id}/status`, { status });
  return response.data;
}
