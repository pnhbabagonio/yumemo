const DAY_MS = 24 * 60 * 60 * 1000;

export function toDateKey(date: Date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function fromDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

export function addDays(dateKey: string, amount: number) {
  const date = fromDateKey(dateKey);
  date.setDate(date.getDate() + amount);
  return toDateKey(date);
}

export function daysBetween(startKey: string, endKey: string) {
  const start = fromDateKey(startKey).getTime();
  const end = fromDateKey(endKey).getTime();
  return Math.round((end - start) / DAY_MS);
}

export function isSameDate(a?: string, b: string = toDateKey()) {
  return a === b;
}

export function formatDateLabel(dateKey?: string) {
  if (!dateKey) return "No date";
  const today = toDateKey();
  const diff = daysBetween(today, dateKey);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  return fromDateKey(dateKey).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function formatLongDate(dateKey: string) {
  return fromDateKey(dateKey).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatMonthLabel(date: Date) {
  return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

export function getMonthCells(monthDate: Date, firstDayOfWeek: 0 | 1 = 1) {
  const first = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const last = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
  const offset = (first.getDay() - firstDayOfWeek + 7) % 7;
  const cells: Array<{ dateKey: string; inMonth: boolean; day: number }> = [];

  for (let i = offset; i > 0; i -= 1) {
    const d = new Date(first);
    d.setDate(first.getDate() - i);
    cells.push({ dateKey: toDateKey(d), inMonth: false, day: d.getDate() });
  }

  for (let day = 1; day <= last.getDate(); day += 1) {
    const d = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
    cells.push({ dateKey: toDateKey(d), inMonth: true, day });
  }

  while (cells.length % 7 !== 0) {
    const d = fromDateKey(cells[cells.length - 1].dateKey);
    d.setDate(d.getDate() + 1);
    cells.push({ dateKey: toDateKey(d), inMonth: false, day: d.getDate() });
  }

  return cells;
}

export function getWeekDates(anchorKey: string = toDateKey(), firstDayOfWeek: 0 | 1 = 1) {
  const anchor = fromDateKey(anchorKey);
  const offset = (anchor.getDay() - firstDayOfWeek + 7) % 7;
  const start = new Date(anchor);
  start.setDate(anchor.getDate() - offset);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return toDateKey(d);
  });
}

export function getWeekdayLabels(firstDayOfWeek: 0 | 1 = 1) {
  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return firstDayOfWeek === 1 ? labels.slice(1).concat(labels[0]) : labels;
}
