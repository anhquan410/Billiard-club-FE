import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTask,
  deleteTask,
  getTaskDashboard,
  updateTask,
  updateTaskStatus,
  type CreateTaskPayload,
  type TaskQueryParams,
  type UpdateTaskPayload,
} from "../api/task";
import { getStaffForAssignment } from "../api/user";
import type { TaskStatus } from "../types/task.type";

export const TASK_QUERY_KEY = {
  all: ["tasks"] as const,
  dashboard: (params: TaskQueryParams) =>
    [...TASK_QUERY_KEY.all, "dashboard", params] as const,
  staff: () => [...TASK_QUERY_KEY.all, "staff"] as const,
};

export const useTaskDashboard = (params: TaskQueryParams) => {
  return useQuery({
    queryKey: TASK_QUERY_KEY.dashboard(params),
    queryFn: () => getTaskDashboard(params),
  });
};

export const useStaffForAssignment = () => {
  return useQuery({
    queryKey: TASK_QUERY_KEY.staff(),
    queryFn: getStaffForAssignment,
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

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTaskPayload }) =>
      updateTask(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEY.all });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEY.all });
    },
  });
};
