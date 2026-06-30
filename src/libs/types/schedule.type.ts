export type ShiftType = "DAY" | "EVENING" | "NIGHT";

export type WorkScheduleStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED";

export type ShiftRegistration = {
  id?: string;
  workDate: string;
  shiftType: ShiftType;
  label?: string;
};

export type WorkScheduleWeek = {
  id: string;
  userId: string;
  weekStart: string;
  status: WorkScheduleStatus;
  submittedAt: string | null;
  reviewedAt: string | null;
  rejectReason: string | null;
  user: { id: string; fullName: string; role: string } | null;
  reviewer: { id: string; fullName: string } | null;
  shifts: ShiftRegistration[];
  weekDates: string[];
};

export type RegistrationWindow = {
  isOpen: boolean;
  weekStart: string;
  message: string;
  shiftTypes: { type: ShiftType; label: string }[];
};

export type ScheduleOverview = {
  weekStart: string;
  weekDates: string[];
  employees: {
    user: { id: string; fullName: string; role: string };
    schedule: WorkScheduleWeek | null;
  }[];
};

export type SaveSchedulePayload = {
  weekStart: string;
  shifts: { workDate: string; shiftType: ShiftType }[];
};

export type AdminSaveSchedulePayload = SaveSchedulePayload & {
  approve?: boolean;
};
