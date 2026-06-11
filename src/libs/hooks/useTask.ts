import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTask,
  getTaskDashboard,
  updateTaskStatus,
  type CreateTaskPayload,
  type TaskQueryParams,
} from "../api/task";
import type { TaskStatus } from "../types/task.type";

export const TASK_QUERY_KEY = {
  all: ["tasks"] as const,
  dashboard: (params: TaskQueryParams) =>
    [...TASK_QUERY_KEY.all, "dashboard", params] as const,
};

export const useTaskDashboard = (params: TaskQueryParams) => {
  return useQuery({
    queryKey: TASK_QUERY_KEY.dashboard(params),
    queryFn: () => getTaskDashboard(params),
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => createTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEY.all });
    },
  });
};

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      updateTaskStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEY.all });
    },
  });
};
