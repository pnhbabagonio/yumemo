import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { CalendarPlus, ChevronLeft, ChevronRight, Columns3, RefreshCw } from "lucide-react";
import { AppLayout } from "@/components/yumemo/AppLayout";
import { EventFormDialog } from "@/components/yumemo/EventFormDialog";
import { TaskFormDialog } from "@/components/yumemo/TaskFormDialog";
import {
  addDays,
  formatDateLabel,
  formatLongDate,
  formatMonthLabel,
  getMonthCells,
  getWeekDates,
  getWeekdayLabels,
  toDateKey,
} from "@/lib/date";
import { syncGoogleCalendar } from "@/services/googleCalendar";
import { useCalendarStore, useSubjectsStore, useTasksStore } from "@/stores/yumemo";

export const Route = createFileRoute("/calendar")({
  component: CalendarPage,
  head: () => ({
    meta: [
      { title: "Calendar - YuMemo" },
      {
        name: "description",
        content: "Monthly and weekly calendar views with color-coded classes, tasks and deadlines.",
      },
    ],
  }),
});

type CalendarView = "month" | "week";

function CalendarPage() {
  const tasks = useTasksStore((state) => state.tasks);
  const events = useCalendarStore((state) => state.events);
  const selectedDate = useCalendarStore((state) => state.selectedDate);
  const setSelectedDate = useCalendarStore((state) => state.setSelectedDate);
  const defaultView = useCalendarStore((state) => state.defaultView);
  const firstDayOfWeek = useCalendarStore((state) => state.firstDayOfWeek);
  const subjects = useSubjectsStore((state) => state.subjects);
  const getSubject = useSubjectsStore((state) => state.getSubject);
  const [view, setView] = useState<CalendarView>(defaultView);
  const [anchorDate, setAnchorDate] = useState(() => new Date());
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | undefined>();
  const [editingTaskId, setEditingTaskId] = useState<string | undefined>();
  const [syncMessage, setSyncMessage] = useState("Ready for Google Calendar API credentials.");
  const today = toDateKey();

  const monthCells = useMemo(
    () => getMonthCells(anchorDate, firstDayOfWeek),
    [anchorDate, firstDayOfWeek],
  );
  const weekDates = useMemo(
    () => getWeekDates(selectedDate, firstDayOfWeek),
    [firstDayOfWeek, selectedDate],
  );
  const weekdayLabels = getWeekdayLabels(firstDayOfWeek);
  const selectedTasks = tasks.filter((task) => task.dueDate === selectedDate);
  const selectedEvents = events
    .filter((event) => event.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const changeMonth = (amount: number) => {
    setAnchorDate((date) => new Date(date.getFullYear(), date.getMonth() + amount, 1));
  };

  const openNewEvent = (date = selectedDate) => {
    setSelectedDate(date);
    setEditingEventId(undefined);
    setEventDialogOpen(true);
  };

  const openTask = (id: string) => {
    setEditingTaskId(id);
    setTaskDialogOpen(true);
  };

  const runSync = async () => {
    const result = await syncGoogleCalendar({ events, tasks });
    setSyncMessage(result.message);
  };

  const renderCalendarItem = (
    item: { id: string; title: string; subjectId: string; kind: "task" | "event" },
    todayCell: boolean,
  ) => {
    const subject = getSubject(item.subjectId);
    return (
      <button
        key={`${item.kind}-${item.id}`}
        onClick={(event) => {
          event.stopPropagation();
          if (item.kind === "task") openTask(item.id);
          else {
            setEditingEventId(item.id);
            setEventDialogOpen(true);
          }
        }}
        className={`block w-full text-left text-[10px] px-1.5 py-0.5 rounded-md truncate ${
          todayCell ? "bg-primary-foreground/20" : subject.softClass
        }`}
      >
        {item.kind === "task" ? "Due: " : ""}
        {item.title}
      </button>
    );
  };

  return (
    <AppLayout
      title="Calendar"
      subtitle={
        view === "month" ? formatMonthLabel(anchorDate) : `Week of ${formatDateLabel(weekDates[0])}`
      }
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              view === "month"
                ? changeMonth(-1)
                : setSelectedDate(addDays(weekDates[0] ?? today, -7))
            }
            className="p-2.5 rounded-2xl glass-card"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() =>
              view === "month" ? changeMonth(1) : setSelectedDate(addDays(weekDates[6] ?? today, 7))
            }
            className="p-2.5 rounded-2xl glass-card"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedDate(today);
              setAnchorDate(new Date());
            }}
            className="px-4 py-2 rounded-2xl bg-gradient-primary text-primary-foreground text-sm font-medium shadow-soft"
          >
            Today
          </button>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setView("month")}
            className={`px-4 py-2 rounded-2xl text-sm font-medium ${view === "month" ? "bg-gradient-primary text-primary-foreground shadow-soft" : "glass-card"}`}
          >
            Month
          </button>
          <button
            onClick={() => setView("week")}
            className={`px-4 py-2 rounded-2xl text-sm font-medium flex items-center gap-2 ${view === "week" ? "bg-gradient-primary text-primary-foreground shadow-soft" : "glass-card"}`}
          >
            <Columns3 className="w-4 h-4" /> Week
          </button>
          <button
            onClick={() => openNewEvent(selectedDate)}
            className="px-4 py-2 rounded-2xl bg-gradient-primary text-primary-foreground text-sm font-medium flex items-center gap-2 shadow-soft"
          >
            <CalendarPlus className="w-4 h-4" /> Add event
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {subjects.map((subject) => (
          <div key={subject.id} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={`w-2.5 h-2.5 rounded-full ${subject.dotClass}`} /> {subject.name}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_22rem] gap-6">
        <div className="glass-card rounded-3xl p-3 sm:p-5">
          {view === "month" ? (
            <>
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
                  const dayTasks = tasks.filter((task) => task.dueDate === cell.dateKey);
                  const dayEvents = events.filter((event) => event.date === cell.dateKey);
                  const items = [
                    ...dayEvents.map((event) => ({
                      id: event.id,
                      title: event.title,
                      subjectId: event.subjectId,
                      kind: "event" as const,
                    })),
                    ...dayTasks.map((task) => ({
                      id: task.id,
                      title: task.title,
                      subjectId: task.subjectId,
                      kind: "task" as const,
                    })),
                  ];
                  const isToday = cell.dateKey === today;
                  const isSelected = cell.dateKey === selectedDate;
                  return (
                    <motion.button
                      key={cell.dateKey}
                      onClick={() => setSelectedDate(cell.dateKey)}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.004 }}
                      className={`min-h-[96px] rounded-2xl p-2 text-left transition-colors ${
                        isToday
                          ? "bg-gradient-primary text-primary-foreground shadow-soft"
                          : isSelected
                            ? "bg-card ring-2 ring-primary"
                            : cell.inMonth
                              ? "bg-card/70 hover:bg-card"
                              : "bg-card/25 text-muted-foreground"
                      }`}
                    >
                      <p className="text-xs font-bold">{cell.day}</p>
                      <div className="mt-1 space-y-1">
                        {items.slice(0, 3).map((item) => renderCalendarItem(item, isToday))}
                        {items.length > 3 && (
                          <span className="block text-[10px] text-muted-foreground">
                            +{items.length - 3} more
                          </span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
              {weekDates.map((dateKey, i) => {
                const dayTasks = tasks.filter((task) => task.dueDate === dateKey);
                const dayEvents = events.filter((event) => event.date === dateKey);
                const isToday = dateKey === today;
                return (
                  <motion.div
                    key={dateKey}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`rounded-3xl p-3 min-h-80 ${isToday ? "bg-gradient-primary text-primary-foreground shadow-soft" : "bg-card/70"}`}
                  >
                    <button
                      onClick={() => setSelectedDate(dateKey)}
                      className="w-full text-left mb-3"
                    >
                      <p className="text-xs opacity-75">{formatDateLabel(dateKey)}</p>
                      <p className="font-bold">
                        {new Date(`${dateKey}T00:00:00`).toLocaleDateString(undefined, {
                          weekday: "short",
                          day: "numeric",
                        })}
                      </p>
                    </button>
                    <div className="space-y-2">
                      {dayEvents.map((event) => {
                        const subject = getSubject(event.subjectId);
                        return (
                          <button
                            key={event.id}
                            onClick={() => {
                              setEditingEventId(event.id);
                              setEventDialogOpen(true);
                            }}
                            className={`w-full rounded-2xl p-3 text-left ${isToday ? "bg-primary-foreground/20" : subject.softClass}`}
                          >
                            <p className="text-xs font-bold truncate">{event.title}</p>
                            <p className="text-[10px] opacity-75 mt-1">{event.startTime}</p>
                          </button>
                        );
                      })}
                      {dayTasks.map((task) => {
                        const subject = getSubject(task.subjectId);
                        return (
                          <button
                            key={task.id}
                            onClick={() => openTask(task.id)}
                            className={`w-full rounded-2xl p-3 text-left ${isToday ? "bg-primary-foreground/20" : subject.softClass}`}
                          >
                            <p className="text-xs font-bold truncate">{task.title}</p>
                            <p className="text-[10px] opacity-75 mt-1">Due task</p>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="glass-card rounded-3xl p-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Selected date</p>
            <h2 className="text-xl font-bold mt-1">{formatLongDate(selectedDate)}</h2>
            <button
              onClick={() => openNewEvent(selectedDate)}
              className="mt-4 w-full px-4 py-2 rounded-2xl bg-gradient-primary text-primary-foreground text-sm font-bold shadow-soft"
            >
              Add event here
            </button>
          </div>

          <div className="glass-card rounded-3xl p-5">
            <h2 className="font-bold mb-3">Due tasks</h2>
            <div className="space-y-2">
              {selectedTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tasks due on this date.</p>
              ) : (
                selectedTasks.map((task) => {
                  const subject = getSubject(task.subjectId);
                  return (
                    <button
                      key={task.id}
                      onClick={() => openTask(task.id)}
                      className={`w-full rounded-2xl p-3 text-left ${subject.softClass}`}
                    >
                      <p className="text-sm font-bold">{task.title}</p>
                      <p className="text-xs text-muted-foreground capitalize mt-1">
                        {subject.name} - {task.priority}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="glass-card rounded-3xl p-5">
            <h2 className="font-bold mb-3">Events</h2>
            <div className="space-y-2">
              {selectedEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No calendar events yet.</p>
              ) : (
                selectedEvents.map((event) => {
                  const subject = getSubject(event.subjectId);
                  return (
                    <button
                      key={event.id}
                      onClick={() => {
                        setEditingEventId(event.id);
                        setEventDialogOpen(true);
                      }}
                      className={`w-full rounded-2xl p-3 text-left ${subject.softClass}`}
                    >
                      <p className="text-sm font-bold">{event.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {event.startTime} - {event.endTime}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </aside>
      </div>

      <div className="glass-card rounded-3xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold mb-1">Google Calendar sync</h2>
            <p className="text-sm text-muted-foreground">{syncMessage}</p>
          </div>
          <button
            onClick={runSync}
            className="px-4 py-2 rounded-2xl bg-gradient-primary text-primary-foreground text-sm font-medium shadow-soft hover:scale-105 transition-transform flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Check sync stub
          </button>
        </div>
      </div>

      <EventFormDialog
        open={eventDialogOpen}
        eventId={editingEventId}
        defaultDate={selectedDate}
        onOpenChange={(open) => {
          setEventDialogOpen(open);
          if (!open) setEditingEventId(undefined);
        }}
      />
      <TaskFormDialog
        open={taskDialogOpen}
        taskId={editingTaskId}
        defaultDate={selectedDate}
        onOpenChange={(open) => {
          setTaskDialogOpen(open);
          if (!open) setEditingTaskId(undefined);
        }}
      />
    </AppLayout>
  );
}
