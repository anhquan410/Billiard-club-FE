const VN_TIMEZONE = "Asia/Ho_Chi_Minh";

const vnDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: VN_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const vnWeekdayFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: VN_TIMEZONE,
  weekday: "short",
});

export function toVnDateString(date: Date = new Date()): string {
  return vnDateFormatter.format(date);
}

export function parseDateOnly(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function getVnWeekday(date: Date = new Date()): number {
  const weekday = vnWeekdayFormatter.format(date);
  const map: Record<string, number> = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 0,
  };
  return map[weekday] ?? 0;
}

export function getWeekStart(date: Date = new Date()): string {
  const dateStr = toVnDateString(date);
  const current = parseDateOnly(dateStr);
  const weekday = getVnWeekday(date);
  const daysFromMonday = weekday === 0 ? 6 : weekday - 1;
  current.setUTCDate(current.getUTCDate() - daysFromMonday);
  return current.toISOString().slice(0, 10);
}

export function getNextWeekStart(from: Date = new Date()): string {
  const dateStr = toVnDateString(from);
  const current = parseDateOnly(dateStr);
  const weekday = getVnWeekday(from);
  const daysUntilNextMonday = weekday === 0 ? 1 : 8 - weekday;
  current.setUTCDate(current.getUTCDate() + daysUntilNextMonday);
  return current.toISOString().slice(0, 10);
}

/** Earliest weekStart employees may register for */
export function getMinEditableWeekStart(from: Date = new Date()): string {
  return getNextWeekStart(from);
}

export function isFutureWeekStart(
  weekStart: string,
  from: Date = new Date(),
): boolean {
  return weekStart >= getMinEditableWeekStart(from);
}

export function addDays(dateStr: string, days: number): string {
  const d = parseDateOnly(dateStr);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function getWeekDates(weekStart: string): string[] {
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    dates.push(addDays(weekStart, i));
  }
  return dates;
}

export function getCurrentMonth(): string {
  const now = new Date();
  const vn = toVnDateString(now);
  return vn.slice(0, 7);
}

export const SHIFT_TYPES = ["DAY", "EVENING", "NIGHT"] as const;

export const SHIFT_LABELS: Record<(typeof SHIFT_TYPES)[number], string> = {
  DAY: "Ca ngày (9h–17h)",
  EVENING: "Ca tối (17h–1h)",
  NIGHT: "Ca đêm (1h–9h)",
};

export const DAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export function formatVnDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}
