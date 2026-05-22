import { AnimatePresence, motion } from "framer-motion";
import { Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  type CalendarEvent,
  type CalendarEventDraft,
  type RecurringFrequency,
  useCalendarStore,
  useSubjectsStore,
} from "@/stores/yumemo";
import { toDateKey } from "@/lib/date";

function emptyDraft(subjectId: string, defaultDate?: string): CalendarEventDraft {
  return {
    title: "",
    description: "",
    date: defaultDate ?? toDateKey(),
    startTime: "09:00",
    endTime: "10:00",
    subjectId,
    type: "class",
    linkedTaskId: undefined,
    recurring: { enabled: false, frequency: "none" },
  };
}

function eventToDraft(event: CalendarEvent): CalendarEventDraft {
  return {
    title: event.title,
    description: event.description,
    date: event.date,
    startTime: event.startTime,
    endTime: event.endTime,
    subjectId: event.subjectId,
    type: event.type,
    linkedTaskId: event.linkedTaskId,
    recurring: event.recurring,
  };
}

export function EventFormDialog({
  open,
  eventId,
  defaultDate,
  onOpenChange,
}: {
  open: boolean;
  eventId?: string;
  defaultDate?: string;
  onOpenChange: (open: boolean) => void;
}) {
  const subjects = useSubjectsStore((state) => state.subjects);
  const addEvent = useCalendarStore((state) => state.addEvent);
  const updateEvent = useCalendarStore((state) => state.updateEvent);
  const deleteEvent = useCalendarStore((state) => state.deleteEvent);
  const event = useCalendarStore((state) => state.events.find((item) => item.id === eventId));
  const firstSubjectId = subjects[0]?.id ?? "math";
  const initialDraft = useMemo(
    () => (event ? eventToDraft(event) : emptyDraft(firstSubjectId, defaultDate)),
    [defaultDate, event, firstSubjectId],
  );
  const [draft, setDraft] = useState<CalendarEventDraft>(initialDraft);

  useEffect(() => {
    if (open) setDraft(initialDraft);
  }, [initialDraft, open]);

  const updateDraft = <K extends keyof CalendarEventDraft>(
    key: K,
    value: CalendarEventDraft[K],
  ) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const submit = (submitEvent: React.FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    if (!draft.title.trim()) return;
    const payload = {
      ...draft,
      title: draft.title.trim(),
      recurring: {
        ...draft.recurring,
        frequency: draft.recurring.enabled ? draft.recurring.frequency : "none",
      },
    };
    if (event) {
      updateEvent(event.id, payload);
    } else {
      addEvent(payload);
    }
    onOpenChange(false);
  };

  const remove = () => {
    if (!event) return;
    deleteEvent(event.id);
    onOpenChange(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] bg-foreground/20 backdrop-blur-sm p-3 sm:p-6 grid place-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
        >
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            className="w-full max-w-2xl rounded-3xl bg-card text-card-foreground shadow-float overflow-hidden"
          >
            <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {event ? "Edit event" : "New event"}
                </p>
                <h2 className="text-2xl font-bold">
                  {event ? event.title : "Add something to your calendar"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="p-2 rounded-2xl bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              <label className="space-y-1.5 block">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Title
                </span>
                <input
                  value={draft.title}
                  onChange={(item) => updateDraft("title", item.target.value)}
                  className="w-full rounded-2xl bg-muted/70 px-4 py-3 outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </label>
              <label className="space-y-1.5 block">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Description
                </span>
                <textarea
                  value={draft.description}
                  onChange={(item) => updateDraft("description", item.target.value)}
                  className="w-full min-h-20 rounded-2xl bg-muted/70 px-4 py-3 outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Date
                  </span>
                  <input
                    type="date"
                    value={draft.date}
                    onChange={(item) => updateDraft("date", item.target.value)}
                    className="w-full rounded-2xl bg-muted/70 px-4 py-3 outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Subject
                  </span>
                  <select
                    value={draft.subjectId}
                    onChange={(item) => updateDraft("subjectId", item.target.value)}
                    className="w-full rounded-2xl bg-muted/70 px-4 py-3 outline-none focus:ring-2 focus:ring-ring"
                  >
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Start
                  </span>
                  <input
                    type="time"
                    value={draft.startTime}
                    onChange={(item) => updateDraft("startTime", item.target.value)}
                    className="w-full rounded-2xl bg-muted/70 px-4 py-3 outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    End
                  </span>
                  <input
                    type="time"
                    value={draft.endTime}
                    onChange={(item) => updateDraft("endTime", item.target.value)}
                    className="w-full rounded-2xl bg-muted/70 px-4 py-3 outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Type
                  </span>
                  <select
                    value={draft.type}
                    onChange={(item) =>
                      updateDraft("type", item.target.value as CalendarEventDraft["type"])
                    }
                    className="w-full rounded-2xl bg-muted/70 px-4 py-3 outline-none focus:ring-2 focus:ring-ring capitalize"
                  >
                    <option value="class">Class</option>
                    <option value="study">Study</option>
                    <option value="deadline">Deadline</option>
                    <option value="personal">Personal</option>
                  </select>
                </label>
                <div className="rounded-2xl bg-muted/70 px-4 py-3 space-y-2">
                  <label className="flex items-center justify-between gap-3 text-sm font-medium">
                    Recurring
                    <input
                      type="checkbox"
                      checked={draft.recurring.enabled}
                      onChange={(item) =>
                        updateDraft("recurring", {
                          enabled: item.target.checked,
                          frequency: item.target.checked ? "weekly" : "none",
                        })
                      }
                      className="accent-primary"
                    />
                  </label>
                  <select
                    value={draft.recurring.frequency}
                    disabled={!draft.recurring.enabled}
                    onChange={(item) =>
                      updateDraft("recurring", {
                        ...draft.recurring,
                        frequency: item.target.value as RecurringFrequency,
                      })
                    }
                    className="w-full rounded-xl bg-card px-3 py-2 text-sm outline-none disabled:opacity-50"
                  >
                    <option value="none">None</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6 border-t border-border flex items-center justify-between gap-3">
              {event ? (
                <button
                  type="button"
                  onClick={remove}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-destructive/15 text-destructive text-sm font-medium hover:bg-destructive/25 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              ) : (
                <span />
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="px-4 py-2.5 rounded-2xl bg-muted text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-gradient-primary text-primary-foreground text-sm font-bold shadow-soft"
                >
                  {event ? "Save event" : "Create event"}
                </button>
              </div>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
