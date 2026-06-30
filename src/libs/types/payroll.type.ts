import type { ShiftType } from "./schedule.type";

export type PayrollSettings = {
  id: string;
  dayShiftRate: number;
  eveningShiftRate: number;
  nightShiftRate: number;
  updatedAt: string;
};

export type PayrollAdjustmentType = "BONUS" | "PENALTY";

export type PayrollAdjustment = {
  id: string;
  userId: string;
  user: { id: string; fullName: string } | null;
  type: PayrollAdjustmentType;
  amount: number;
  reason: string;
  month: string;
  createdAt: string;
  createdBy: { id: string; fullName: string };
};

export type PayrollSummary = {
  month: string;
  user: { id: string; fullName: string; role: string };
  totalShifts: number;
  shiftBreakdown: {
    shiftType: ShiftType;
    label: string;
    count: number;
    rate: number;
    amount: number;
  }[];
  shiftSalary: number;
  bonuses: number;
  penalties: number;
  netSalary: number;
  approvedShifts: {
    id: string;
    workDate: string;
    shiftType: ShiftType;
    label: string;
    rate: number;
    weekStart: string;
  }[];
  adjustments: PayrollAdjustment[];
};

export type PayrollAdminSummary = {
  month: string;
  totals: {
    totalShifts: number;
    shiftSalary: number;
    bonuses: number;
    penalties: number;
    netSalary: number;
  };
  employees: PayrollSummary[];
};

export type CreatePayrollAdjustmentPayload = {
  userId: string;
  type: PayrollAdjustmentType;
  amount: number;
  reason: string;
  month: string;
};
