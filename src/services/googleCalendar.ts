import type { CalendarEvent, Task } from "@/stores/yumemo";

export type GoogleCalendarSyncStatus = "idle" | "needs-api-key" | "connected" | "error";

export type GoogleCalendarPayload = {
  events: CalendarEvent[];
  tasks: Task[];
};

export async function syncGoogleCalendar(_payload: GoogleCalendarPayload) {
  return {
    status: "needs-api-key" as GoogleCalendarSyncStatus,
    message: "Google Calendar API key and OAuth client are not configured yet.",
  };
}

export function createGoogleCalendarEventDraft(task: Task): Partial<CalendarEvent> {
  return {
    title: task.title,
    date: task.dueDate,
    startTime: "16:00",
    endTime: "17:00",
    subjectId: task.subjectId,
    linkedTaskId: task.id,
    type: "deadline",
  };
}
