import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  Columns3,
  Filter,
  LayoutGrid,
  List,
  Plus,
  Search,
  Table2,
} from "lucide-react";
import { AppLayout } from "@/components/yumemo/AppLayout";
import { TaskFormDialog } from "@/components/yumemo/TaskFormDialog";
import {
  type Task,
  type TaskPriority,
  type TaskStatus,
  type TaskType,
  useCalendarStore,
  useSubjectsStore,
  useTasksStore,
} from "@/stores/yumemo";
import {
  formatDateLabel,
  getMonthCells,
  getWeekDates,
  getWeekdayLabels,
  toDateKey,
} from "@/lib/date";

export const Route = createFileRoute("/planner")({
  component: PlannerPage,
  head: () => ({
    meta: [
      { title: "Planner - YuMemo" },
      {
        name: "description",
        content:
          "Kanban, table, calendar and agenda planner for assignments, exams, projects and study sessions.",
      },
    ],
  }),
});

type PlannerView = "table" | "kanban" | "month" | "week" | "agenda";
type SortKey = "dueDate" | "priority" | "status" | "subject" | "type" | "title";

const views: Array<{ key: PlannerView; label: string; icon: typeof LayoutGrid }> = [
  { key: "table", label: "Table", icon: Table2 },
  { key: "kanban", label: "Kanban", icon: LayoutGrid },
  { key: "month", label: "Month", icon: CalendarDays },
  { key: "week", label: "Week", icon: Columns3 },
  { key: "agenda", label: "Agenda", icon: List },
];

const columns: { key: TaskStatus; label: string; hint: string }[] = [
  { key: "not-started", label: "Not started", hint: "fresh & cozy" },
  { key: "ongoing", label: "Ongoing", hint: "you got this" },
  { key: "completed", label: "Completed", hint: "tiny wins" },
];

const priorityDot = {
  low: "bg-mint",
  medium: "bg-peach",
  high: "bg-primary",
  critical: "bg-destructive",
} satisfies Record<TaskPriority, string>;

const priorityRank = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
} satisfies Record<TaskPriority, number>;

function matchesFilter<T extends string>(value: T, filter: T | "all") {
  return filter === "all" || value === filter;
}

function TaskCard({ task, onEdit }: { task: Task; onEdit: (id: string) => void }) {
  const subject = useSubjectsStore((state) => state.getSubject(task.subjectId));

  return (
    <motion.button
      type="button"
      onClick={() => onEdit(task.id)}
      draggable
      onDragStartCapture={(event) => event.dataTransfer.setData("text/task-id", task.id)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -3 }}
      className="w-full text-left bg-card rounded-2xl p-4 shadow-soft cursor-grab"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold leading-snug">{task.title}</p>
        <span className={`w-2 h-2 rounded-full mt-2 ${priorityDot[task.priority]}`} />
      </div>
      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
        {task.description || task.type}
      </p>
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${subject.badgeClass}`}>
          {subject.name}
        </span>
        <span className="text-[11px] text-muted-foreground">{formatDateLabel(task.dueDate)}</span>
      </div>
      <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${task.progress}%` }}
          transition={{ duration: 0.8 }}
          className="h-full bg-gradient-primary"
        />
      </div>
    </motion.button>
  );
}

function PlannerPage() {
  const tasks = useTasksStore((state) => state.tasks);
  const setTaskStatus = useTasksStore((state) => state.setTaskStatus);
  const subjects = useSubjectsStore((state) => state.subjects);
  const getSubject = useSubjectsStore((state) => state.getSubject);
  const firstDayOfWeek = useCalendarStore((state) => state.firstDayOfWeek);
  const [view, setView] = useState<PlannerView>("kanban");
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">("all");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<TaskType | "all">("all");
  const [sortBy, setSortBy] = useState<SortKey>("dueDate");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | undefined>();
  const today = toDateKey();

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tasks
      .filter((task) => {
        const subject = getSubject(task.subjectId);
        const text = `${task.title} ${task.description} ${subject.name} ${task.type}`.toLowerCase();
        return (
          (!query || text.includes(query)) &&
          (subjectFilter === "all" || task.subjectId === subjectFilter) &&
          matchesFilter(task.priority, priorityFilter) &&
          matchesFilter(task.status, statusFilter) &&
          matchesFilter(task.type, typeFilter)
        );
      })
      .sort((a, b) => {
        if (sortBy === "priority") return priorityRank[b.priority] - priorityRank[a.priority];
        if (sortBy === "status") return a.status.localeCompare(b.status);
        if (sortBy === "subject")
          return getSubject(a.subjectId).name.localeCompare(getSubject(b.subjectId).name);
        if (sortBy === "type") return a.type.localeCompare(b.type);
        if (sortBy === "title") return a.title.localeCompare(b.title);
        return a.dueDate.localeCompare(b.dueDate);
      });
  }, [getSubject, priorityFilter, search, sortBy, statusFilter, subjectFilter, tasks, typeFilter]);

  const openNewTask = (date?: string) => {
    setEditingTaskId(undefined);
    setDialogOpen(true);
    if (date) {
      // The form receives the date through defaultDate below.
      useCalendarStore.getState().setSelectedDate(date);
    }
  };

  const openEditTask = (id: string) => {
    setEditingTaskId(id);
    setDialogOpen(true);
  };

  const selectedDate = useCalendarStore((state) => state.selectedDate);
  const taskTypes: TaskType[] = ["assignment", "quiz", "exam", "project", "study session"];
  const statuses: TaskStatus[] = ["not-started", "ongoing", "completed"];
  const priorities: TaskPriority[] = ["low", "medium", "high", "critical"];
  const monthCells = getMonthCells(new Date(), firstDayOfWeek);
  const weekDates = getWeekDates(today, firstDayOfWeek);
  const weekdayLabels = getWeekdayLabels(firstDayOfWeek);
  const groupedAgenda = filteredTasks.reduce<Record<string, Task[]>>((groups, task) => {
    groups[task.dueDate] = groups[task.dueDate] ? [...groups[task.dueDate], task] : [task];
    return groups;
  }, {});

  return (
    <AppLayout title="Planner" subtitle="Drag your week into shape">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="glass-card rounded-2xl p-1 flex flex-wrap">
          {views.map((item) => (
            <button
              key={item.key}
              onClick={() => setView(item.key)}
              className={`px-3 sm:px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors ${
                view === item.key
                  ? "bg-gradient-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>
        <button
          onClick={() => openNewTask(today)}
          className="px-4 py-2 rounded-2xl bg-gradient-primary text-primary-foreground text-sm font-medium flex items-center gap-2 shadow-soft hover:scale-105 transition-transform"
        >
          <Plus className="w-4 h-4" /> New Task
        </button>
      </div>

      <div className="glass-card rounded-3xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-primary" />
          <h2 className="font-bold">Find and sort</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <label className="sm:col-span-2 flex items-center gap-2 rounded-2xl bg-card px-3 py-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tasks"
              className="min-w-0 flex-1 bg-transparent outline-none text-sm"
            />
          </label>
          <select
            value={subjectFilter}
            onChange={(event) => setSubjectFilter(event.target.value)}
            className="rounded-2xl bg-card px-3 py-2 text-sm outline-none"
          >
            <option value="all">All subjects</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          <select
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value as TaskPriority | "all")}
            className="rounded-2xl bg-card px-3 py-2 text-sm outline-none"
          >
            <option value="all">All priorities</option>
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as TaskStatus | "all")}
            className="rounded-2xl bg-card px-3 py-2 text-sm outline-none"
          >
            <option value="all">All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.replace("-", " ")}
              </option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value as TaskType | "all")}
            className="rounded-2xl bg-card px-3 py-2 text-sm outline-none"
          >
            <option value="all">All types</option>
            {taskTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortKey)}
            className="rounded-2xl bg-card px-3 py-2 text-sm outline-none lg:col-start-6"
          >
            <option value="dueDate">Sort: due date</option>
            <option value="priority">Sort: priority</option>
            <option value="status">Sort: status</option>
            <option value="subject">Sort: subject</option>
            <option value="type">Sort: type</option>
            <option value="title">Sort: title</option>
          </select>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="glass-card rounded-3xl p-10 text-center">
          <p className="text-lg font-bold">No matching tasks.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try lighter filters or add a new task.
          </p>
        </div>
      ) : view === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {columns.map((col, ci) => (
            <motion.div
              key={col.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ci * 0.08 }}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                const id = event.dataTransfer.getData("text/task-id");
                if (id) setTaskStatus(id, col.key);
              }}
              className="glass-card rounded-3xl p-4 min-h-80"
            >
              <div className="flex items-baseline justify-between mb-4 px-2">
                <h2 className="font-bold">{col.label}</h2>
                <span className="text-xs text-muted-foreground">{col.hint}</span>
              </div>
              <div className="space-y-3">
                {filteredTasks
                  .filter((task) => task.status === col.key)
                  .map((task) => (
                    <TaskCard key={task.id} task={task} onEdit={openEditTask} />
                  ))}
              </div>
            </motion.div>
          ))}
        </div>
      ) : view === "table" ? (
        <div className="glass-card rounded-3xl p-4 overflow-x-auto">
          <table className="w-full text-sm min-w-[820px]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="p-3">Task</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Type</th>
                <th className="p-3">Due</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Progress</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => {
                const subject = getSubject(task.subjectId);
                return (
                  <tr key={task.id} className="border-t border-border hover:bg-muted/40">
                    <td className="p-3">
                      <button
                        onClick={() => openEditTask(task.id)}
                        className="text-left font-medium hover:text-primary"
                      >
                        {task.title}
                      </button>
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${subject.badgeClass}`}
                      >
                        {subject.name}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground capitalize">{task.type}</td>
                    <td className="p-3 text-muted-foreground">{formatDateLabel(task.dueDate)}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1.5 text-xs capitalize">
                        <span className={`w-2 h-2 rounded-full ${priorityDot[task.priority]}`} />
                        {task.priority}
                      </span>
                    </td>
                    <td className="p-3 w-40">
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-gradient-primary"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </td>
                    <td className="p-3">
                      <select
                        value={task.status}
                        onChange={(event) =>
                          setTaskStatus(task.id, event.target.value as TaskStatus)
                        }
                        className="rounded-xl bg-muted px-2 py-1 text-xs capitalize outline-none"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status.replace("-", " ")}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : view === "month" ? (
        <div className="glass-card rounded-3xl p-3 sm:p-5">
          <div className="grid grid-cols-7 mb-2">
            {weekdayLabels.map((day) => (
              <div
                key={day}
                className="text-[11px] uppercase tracking-wider text-muted-foreground p-2 text-center"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {monthCells.map((cell, i) => {
              const dayTasks = filteredTasks.filter((task) => task.dueDate === cell.dateKey);
              return (
                <motion.button
                  key={cell.dateKey}
                  onClick={() => openNewTask(cell.dateKey)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.004 }}
                  className={`min-h-[92px] rounded-2xl p-2 text-left transition-colors ${
                    cell.dateKey === today
                      ? "bg-gradient-primary text-primary-foreground shadow-soft"
                      : cell.inMonth
                        ? "bg-card/70 hover:bg-card"
                        : "bg-card/25 text-muted-foreground"
                  }`}
                >
                  <p className="text-xs font-bold">{cell.day}</p>
                  <div className="mt-1 space-y-1">
                    {dayTasks.slice(0, 3).map((task) => {
                      const subject = getSubject(task.subjectId);
                      return (
                        <span
                          key={task.id}
                          onClick={(event) => {
                            event.stopPropagation();
                            openEditTask(task.id);
                          }}
                          className={`block text-[10px] px-1.5 py-0.5 rounded-md truncate ${cell.dateKey === today ? "bg-primary-foreground/20" : subject.softClass}`}
                        >
                          {task.title}
                        </span>
                      );
                    })}
                    {dayTasks.length > 3 && (
                      <span className="block text-[10px] text-muted-foreground">
                        +{dayTasks.length - 3} more
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      ) : view === "week" ? (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {weekDates.map((dateKey, i) => {
            const dayTasks = filteredTasks.filter(
              (task) => task.dueDate === dateKey || task.targetStudyDate === dateKey,
            );
            return (
              <motion.div
                key={dateKey}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`glass-card rounded-3xl p-3 min-h-72 ${dateKey === today ? "ring-2 ring-primary" : ""}`}
              >
                <button onClick={() => openNewTask(dateKey)} className="w-full text-left mb-3">
                  <p className="text-xs text-muted-foreground">{formatDateLabel(dateKey)}</p>
                  <p className="font-bold">
                    {new Date(`${dateKey}T00:00:00`).toLocaleDateString(undefined, {
                      weekday: "short",
                      day: "numeric",
                    })}
                  </p>
                </button>
                <div className="space-y-2">
                  {dayTasks.map((task) => {
                    const subject = getSubject(task.subjectId);
                    return (
                      <button
                        key={task.id}
                        onClick={() => openEditTask(task.id)}
                        className={`w-full rounded-2xl p-3 text-left shadow-soft ${subject.softClass}`}
                      >
                        <p className="text-xs font-bold truncate">{task.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-1 capitalize">
                          {task.type}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card rounded-3xl p-4 sm:p-6">
          <div className="space-y-5">
            {Object.entries(groupedAgenda).map(([dateKey, dayTasks]) => (
              <section key={dateKey}>
                <h2 className="font-bold mb-2">{formatDateLabel(dateKey)}</h2>
                <div className="space-y-2">
                  {dayTasks.map((task) => {
                    const subject = getSubject(task.subjectId);
                    return (
                      <button
                        key={task.id}
                        onClick={() => openEditTask(task.id)}
                        className="w-full rounded-2xl bg-card p-4 text-left shadow-soft flex items-center gap-3"
                      >
                        <span className={`w-2 h-10 rounded-full ${subject.dotClass}`} />
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm font-bold truncate">{task.title}</span>
                          <span className="block text-xs text-muted-foreground capitalize">
                            {subject.name} - {task.type} - {task.status.replace("-", " ")}
                          </span>
                        </span>
                        <span className="text-xs font-bold text-primary">{task.progress}%</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}

      <TaskFormDialog
        open={dialogOpen}
        taskId={editingTaskId}
        defaultDate={selectedDate}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingTaskId(undefined);
        }}
      />
    </AppLayout>
  );
}
