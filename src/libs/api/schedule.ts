import agent from "./agent";
import type {
  AdminSaveSchedulePayload,
  RegistrationWindow,
  SaveSchedulePayload,
  ScheduleOverview,
  WorkScheduleWeek,
} from "../types/schedule.type";

export async function getRegistrationWindow() {
  const response = await agent.get<RegistrationWindow>(
    "/work-schedule/registration-window",
  );
  return response.data;
}

export async function getMySchedule(weekStart: string) {
  const response = await agent.get<WorkScheduleWeek>(
    `/work-schedule/my?weekStart=${weekStart}`,
  );
  return response.data;
}

export async function saveMySchedule(payload: SaveSchedulePayload) {
  const response = await agent.put<WorkScheduleWeek>("/work-schedule/my", payload);
  return response.data;
}

export async function submitMySchedule(weekStart: string) {
  const response = await agent.post<WorkScheduleWeek>(
    "/work-schedule/my/submit",
    { weekStart },
  );
  return response.data;
}

export async function getPendingSchedules() {
  const response = await agent.get<WorkScheduleWeek[]>(
    "/work-schedule/admin/pending",
  );
  return response.data;
}

export async function getScheduleOverview(weekStart: string) {
  const response = await agent.get<ScheduleOverview>(
    `/work-schedule/admin/overview?weekStart=${weekStart}`,
  );
  return response.data;
}

export async function getUserSchedule(userId: string, weekStart: string) {
  const response = await agent.get<WorkScheduleWeek | null>(
    `/work-schedule/admin/user/${userId}?weekStart=${weekStart}`,
  );
  return response.data;
}

export async function adminSaveSchedule(
  userId: string,
  payload: AdminSaveSchedulePayload,
) {
  const response = await agent.put<WorkScheduleWeek>(
    `/work-schedule/admin/user/${userId}`,
    payload,
  );
  return response.data;
}

export async function approveSchedule(weekId: string) {
  const response = await agent.patch<WorkScheduleWeek>(
    `/work-schedule/admin/${weekId}/approve`,
  );
  return response.data;
}

export async function rejectSchedule(weekId: string, rejectReason: string) {
  const response = await agent.patch<WorkScheduleWeek>(
    `/work-schedule/admin/${weekId}/reject`,
    { rejectReason },
  );
  return response.data;
}

export async function rejectApprovedSchedule(
  weekId: string,
  rejectReason: string,
) {
  const response = await agent.patch<WorkScheduleWeek>(
    `/work-schedule/admin/${weekId}/reject-approved`,
    { rejectReason },
  );
  return response.data;
}
