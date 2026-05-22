import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  type ReminderTiming,
  type Subtask,
  type Task,
  type TaskDraft,
  type TaskPriority,
  type TaskStatus,
  type TaskType,
  useSubjectsStore,
  useTasksStore,
} from "@/stores/yumemo";
import { toDateKey } from "@/lib/date";

const taskTypes: TaskType[] = ["assignment", "quiz", "exam", "project", "study session"];
const priorities: TaskPriority[] = ["low", "medium", "high", "critical"];
const statuses: TaskStatus[] = ["not-started", "ongoing", "completed"];
const reminderOptions: Array<{ value: ReminderTiming; label: string }> = [
  { value: "7d", label: "7 days" },
  { value: "3d", label: "3 days" },
  { value: "1d", label: "1 day" },
  { value: "same-day", label: "Same day" },
  { value: "overdue", label: "Overdue" },
];

function emptyDraft(subjectId: string, defaultDate?: string): TaskDraft {
  const date = defaultDate ?? toDateKey();
  return {
    title: "",
    description: "",
    subjectId,
    type: "assignment",
    dueDate: date,
    targetStudyDate: date,
    priority: "medium",
    progress: 0,
    status: "not-started",
    subtasks: [],
    estimatedHours: 1,
    reminders: ["7d", "3d", "1d", "same-day", "overdue"],
    recurring: { enabled: false, frequency: "none", interval: 1 },
    attachments: [],
    completedAt: undefined,
  };
}

function taskToDraft(task: Task): TaskDraft {
  return {
    title: task.title,
    description: task.description,
    subjectId: task.subjectId,
    type: task.type,
    dueDate: task.dueDate,
    targetStudyDate: task.targetStudyDate,
    priority: task.priority,
    progress: task.progress,
    status: task.status,
    subtasks: task.subtasks,
    estimatedHours: task.estimatedHours,
    reminders: task.reminders,
    recurring: task.recurring,
    attachments: task.attachments,
    completedAt: task.completedAt,
  };
}

export function TaskFormDialog({
  open,
  taskId,
  defaultDate,
  onOpenChange,
}: {
  open: boolean;
  taskId?: string;
  defaultDate?: string;
  onOpenChange: (open: boolean) => void;
}) {
  const subjects = useSubjectsStore((state) => state.subjects);
  const addTask = useTasksStore((state) => state.addTask);
  const updateTask = useTasksStore((state) => state.updateTask);
  const deleteTask = useTasksStore((state) => state.deleteTask);
  const task = useTasksStore((state) => state.tasks.find((item) => item.id === taskId));
  const firstSubjectId = subjects[0]?.id ?? "math";
  const initialDraft = useMemo(
    () => (task ? taskToDraft(task) : emptyDraft(firstSubjectId, defaultDate)),
    [defaultDate, firstSubjectId, task],
  );
  const [draft, setDraft] = useState<TaskDraft>(initialDraft);
  const [newSubtask, setNewSubtask] = useState("");
  const [attachmentsText, setAttachmentsText] = useState("");

  useEffect(() => {
    if (!open) return;
    setDraft(initialDraft);
    setAttachmentsText(initialDraft.attachments.join("\n"));
    setNewSubtask("");
  }, [initialDraft, open]);

  const updateDraft = <K extends keyof TaskDraft>(key: K, value: TaskDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const toggleReminder = (value: ReminderTiming) => {
    setDraft((current) => ({
      ...current,
      reminders: current.reminders.includes(value)
        ? current.reminders.filter((item) => item !== value)
        : [...current.reminders, value],
    }));
  };

  const addSubtask = () => {
    const title = newSubtask.trim();
    if (!title) return;
    const subtask: Subtask = {
      id: `subtask-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title,
      done: false,
    };
    setDraft((current) => ({ ...current, subtasks: [...current.subtasks, subtask] }));
    setNewSubtask("");
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.title.trim()) return;
    const progress = draft.status === "completed" ? 100 : draft.progress;
    const payload: TaskDraft = {
      ...draft,
      title: draft.title.trim(),
      progress,
      attachments: attachmentsText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      recurring: {
        ...draft.recurring,
        frequency: draft.recurring.enabled ? draft.recurring.frequency : "none",
      },
    };

    if (task) {
      updateTask(task.id, payload);
    } else {
      addTask(payload);
    }
    onOpenChange(false);
  };

  const remove = () => {
    if (!task) return;
    deleteTask(task.id);
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
            className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-card text-card-foreground shadow-float"
          >
            <div className="sticky top-0 z-10 bg-card/90 backdrop-blur p-4 sm:p-6 border-b border-border flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {task ? "Edit task" : "New task"}
                </p>
                <h2 className="text-2xl font-bold">
                  {task ? task.title : "Plan a cozy next step"}
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

            <div className="p-4 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <label className="space-y-1.5 lg:col-span-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Title
                  </span>
                  <input
                    value={draft.title}
                    onChange={(event) => updateDraft("title", event.target.value)}
                    className="w-full rounded-2xl bg-muted/70 px-4 py-3 outline-none focus:ring-2 focus:ring-ring"
                    placeholder="e.g. Finish calculus problem set"
                    required
                  />
                </label>

                <label className="space-y-1.5 lg:col-span-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Description
                  </span>
                  <textarea
                    value={draft.description}
                    onChange={(event) => updateDraft("description", event.target.value)}
                    className="w-full min-h-24 rounded-2xl bg-muted/70 px-4 py-3 outline-none focus:ring-2 focus:ring-ring resize-none"
                    placeholder="Notes, rubric details, links, or a gentle reminder to future you."
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Subject
                  </span>
                  <select
                    value={draft.subjectId}
                    onChange={(event) => updateDraft("subjectId", event.target.value)}
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
                    Task type
                  </span>
                  <select
                    value={draft.type}
                    onChange={(event) => updateDraft("type", event.target.value as TaskType)}
                    className="w-full rounded-2xl bg-muted/70 px-4 py-3 outline-none focus:ring-2 focus:ring-ring capitalize"
                  >
                    {taskTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Due date
                  </span>
                  <input
                    type="date"
                    value={draft.dueDate}
                    onChange={(event) => updateDraft("dueDate", event.target.value)}
                    className="w-full rounded-2xl bg-muted/70 px-4 py-3 outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Target study date
                  </span>
                  <input
                    type="date"
                    value={draft.targetStudyDate}
                    onChange={(event) => updateDraft("targetStudyDate", event.target.value)}
                    className="w-full rounded-2xl bg-muted/70 px-4 py-3 outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Priority
                  </span>
                  <select
                    value={draft.priority}
                    onChange={(event) =>
                      updateDraft("priority", event.target.value as TaskPriority)
                    }
                    className="w-full rounded-2xl bg-muted/70 px-4 py-3 outline-none focus:ring-2 focus:ring-ring capitalize"
                  >
                    {priorities.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Status
                  </span>
                  <select
                    value={draft.status}
                    onChange={(event) => updateDraft("status", event.target.value as TaskStatus)}
                    className="w-full rounded-2xl bg-muted/70 px-4 py-3 outline-none focus:ring-2 focus:ring-ring capitalize"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status.replace("-", " ")}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Estimated hours
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.25"
                    value={draft.estimatedHours}
                    onChange={(event) => updateDraft("estimatedHours", Number(event.target.value))}
                    className="w-full rounded-2xl bg-muted/70 px-4 py-3 outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Progress
                    </span>
                    <span className="text-sm font-bold text-primary">{draft.progress}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={draft.progress}
                    onChange={(event) => updateDraft("progress", Number(event.target.value))}
                    disabled={draft.subtasks.length > 0}
                    className="w-full accent-primary disabled:opacity-50"
                  />
                  {draft.subtasks.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Progress follows the checklist automatically.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-3xl bg-muted/45 p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold">Checklist</h3>
                    <p className="text-xs text-muted-foreground">
                      Subtasks update parent progress.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    value={newSubtask}
                    onChange={(event) => setNewSubtask(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addSubtask();
                      }
                    }}
                    className="flex-1 rounded-2xl bg-card px-4 py-2.5 outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Add a tiny step"
                  />
                  <button
                    type="button"
                    onClick={addSubtask}
                    className="px-4 py-2.5 rounded-2xl bg-gradient-primary text-primary-foreground font-medium shadow-soft"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {draft.subtasks.map((subtask) => (
                    <div
                      key={subtask.id}
                      className="flex items-center gap-3 rounded-2xl bg-card px-3 py-2"
                    >
                      <input
                        type="checkbox"
                        checked={subtask.done}
                        onChange={() =>
                          setDraft((current) => ({
                            ...current,
                            subtasks: current.subtasks.map((item) =>
                              item.id === subtask.id ? { ...item, done: !item.done } : item,
                            ),
                          }))
                        }
                        className="accent-primary"
                      />
                      <input
                        value={subtask.title}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            subtasks: current.subtasks.map((item) =>
                              item.id === subtask.id
                                ? { ...item, title: event.target.value }
                                : item,
                            ),
                          }))
                        }
                        className="flex-1 bg-transparent text-sm outline-none"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setDraft((current) => ({
                            ...current,
                            subtasks: current.subtasks.filter((item) => item.id !== subtask.id),
                          }))
                        }
                        className="p-1.5 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Remove subtask"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-3xl bg-muted/45 p-4">
                  <h3 className="font-bold mb-3">Reminders</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {reminderOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-2 rounded-2xl bg-card px-3 py-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={draft.reminders.includes(option.value)}
                          onChange={() => toggleReminder(option.value)}
                          className="accent-primary"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl bg-muted/45 p-4 space-y-3">
                  <label className="flex items-center justify-between gap-3">
                    <span>
                      <span className="font-bold block">Recurring</span>
                      <span className="text-xs text-muted-foreground">
                        Repeat this task automatically later.
                      </span>
                    </span>
                    <input
                      type="checkbox"
                      checked={draft.recurring.enabled}
                      onChange={(event) =>
                        updateDraft("recurring", {
                          ...draft.recurring,
                          enabled: event.target.checked,
                          frequency: event.target.checked ? "weekly" : "none",
                        })
                      }
                      className="accent-primary"
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={draft.recurring.frequency}
                      disabled={!draft.recurring.enabled}
                      onChange={(event) =>
                        updateDraft("recurring", {
                          ...draft.recurring,
                          frequency: event.target.value as TaskDraft["recurring"]["frequency"],
                        })
                      }
                      className="rounded-2xl bg-card px-3 py-2 outline-none disabled:opacity-50"
                    >
                      <option value="none">None</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                    <input
                      type="number"
                      min="1"
                      disabled={!draft.recurring.enabled}
                      value={draft.recurring.interval}
                      onChange={(event) =>
                        updateDraft("recurring", {
                          ...draft.recurring,
                          interval: Number(event.target.value),
                        })
                      }
                      className="rounded-2xl bg-card px-3 py-2 outline-none disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              <label className="space-y-1.5 block">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Attachments
                </span>
                <textarea
                  value={attachmentsText}
                  onChange={(event) => setAttachmentsText(event.target.value)}
                  className="w-full min-h-20 rounded-2xl bg-muted/70 px-4 py-3 outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="One link or file note per line"
                />
              </label>
            </div>

            <div className="sticky bottom-0 bg-card/90 backdrop-blur p-4 sm:p-6 border-t border-border flex items-center justify-between gap-3">
              {task ? (
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
              <div className="flex items-center gap-2">
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
                  {task ? "Save task" : "Create task"}
                </button>
              </div>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
