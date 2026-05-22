import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { formatDateLabel, toDateKey } from "@/lib/date";
import { type TaskPriority, useSubjectsStore, useTasksStore } from "@/stores/yumemo";
import { TaskFormDialog } from "./TaskFormDialog";

const priorityDot = {
  low: "bg-mint",
  medium: "bg-peach",
  high: "bg-primary",
  critical: "bg-destructive",
} satisfies Record<TaskPriority, string>;

const priorityLabel = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
} satisfies Record<TaskPriority, string>;

export function TasksList() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();
  const tasks = useTasksStore((state) => state.tasks);
  const setTaskStatus = useTasksStore((state) => state.setTaskStatus);
  const getSubject = useSubjectsStore((state) => state.getSubject);
  const today = toDateKey();
  const visibleTasks = tasks
    .filter((task) => task.dueDate === today || task.targetStudyDate === today)
    .sort((a, b) => Number(a.status === "completed") - Number(b.status === "completed"));
  const remaining = visibleTasks.filter((task) => task.status !== "completed").length;

  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold">Today's plan</h2>
          <p className="text-sm text-muted-foreground">{remaining} tasks left</p>
        </div>
        <button
          onClick={() => {
            setEditingId(undefined);
            setDialogOpen(true);
          }}
          className="flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-2xl bg-gradient-primary text-primary-foreground shadow-soft hover:scale-105 transition-transform"
        >
          <Plus className="w-4 h-4" /> New
        </button>
      </div>

      {visibleTasks.length === 0 ? (
        <div className="rounded-3xl bg-muted/50 p-6 text-center">
          <p className="font-bold">A clear day.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add one gentle task when you are ready.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          <AnimatePresence initial={false}>
            {visibleTasks.map((task, i) => {
              const subject = getSubject(task.subjectId);
              return (
                <motion.li
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/60 transition-colors"
                >
                  <button
                    onClick={() =>
                      setTaskStatus(task.id, task.status === "completed" ? "ongoing" : "completed")
                    }
                    className={`w-6 h-6 rounded-full border-2 grid place-items-center transition-colors ${
                      task.status === "completed"
                        ? "bg-gradient-primary border-transparent"
                        : "border-border hover:border-primary"
                    }`}
                    aria-label={task.status === "completed" ? "Mark task ongoing" : "Complete task"}
                  >
                    {task.status === "completed" && (
                      <Check className="w-3.5 h-3.5 text-primary-foreground" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(task.id);
                      setDialogOpen(true);
                    }}
                    className="flex-1 min-w-0 text-left"
                  >
                    <p
                      className={`text-sm font-medium truncate ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${subject.badgeClass}`}
                      >
                        {subject.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {formatDateLabel(task.dueDate)}
                      </span>
                    </div>
                  </button>
                  <span
                    className={`w-2 h-2 rounded-full ${priorityDot[task.priority]}`}
                    title={priorityLabel[task.priority]}
                  />
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
      <TaskFormDialog
        open={dialogOpen}
        taskId={editingId}
        defaultDate={today}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingId(undefined);
        }}
      />
    </div>
  );
}
