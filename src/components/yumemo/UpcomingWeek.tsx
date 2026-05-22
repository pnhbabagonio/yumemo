import { motion } from "framer-motion";
import { formatMonthLabel, getWeekDates, toDateKey } from "@/lib/date";
import { useCalendarStore, useSubjectsStore, useTasksStore } from "@/stores/yumemo";

export function UpcomingWeek() {
  const tasks = useTasksStore((state) => state.tasks);
  const events = useCalendarStore((state) => state.events);
  const firstDayOfWeek = useCalendarStore((state) => state.firstDayOfWeek);
  const getSubject = useSubjectsStore((state) => state.getSubject);
  const today = toDateKey();
  const weekDates = getWeekDates(today, firstDayOfWeek);
  const todayItems = [
    ...events
      .filter((event) => event.date === today)
      .map((event) => ({
        id: event.id,
        time: event.startTime,
        title: event.title,
        subjectId: event.subjectId,
      })),
    ...tasks
      .filter((task) => task.dueDate === today && task.status !== "completed")
      .map((task) => ({
        id: task.id,
        time: "Due",
        title: task.title,
        subjectId: task.subjectId,
      })),
  ].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">This week</h2>
        <p className="text-xs text-muted-foreground">{formatMonthLabel(new Date())}</p>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-6">
        {weekDates.map((dateKey, i) => {
          const date = new Date(`${dateKey}T00:00:00`);
          const load =
            tasks.filter((task) => task.dueDate === dateKey || task.targetStudyDate === dateKey)
              .length + events.filter((event) => event.date === dateKey).length;
          const isToday = dateKey === today;
          return (
            <motion.div
              key={dateKey}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`rounded-2xl p-2 text-center transition-colors ${
                isToday ? "bg-gradient-primary text-primary-foreground shadow-soft" : "bg-muted/60"
              }`}
            >
              <p className="text-[10px] uppercase tracking-wider opacity-80">
                {date.toLocaleDateString(undefined, { weekday: "short" })}
              </p>
              <p className="text-lg font-bold mt-1">{date.getDate()}</p>
              <div className="flex items-center justify-center gap-0.5 mt-1 h-2">
                {Array.from({ length: Math.min(load, 4) }).map((_, j) => (
                  <span
                    key={j}
                    className={`w-1 h-1 rounded-full ${isToday ? "bg-primary-foreground/70" : "bg-primary/60"}`}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      <ul className="space-y-2">
        {todayItems.length === 0 && (
          <li className="p-3 rounded-2xl bg-muted/60 text-sm text-muted-foreground text-center">
            No events today. Soft landing.
          </li>
        )}
        {todayItems.slice(0, 5).map((item, i) => {
          const subject = getSubject(item.subjectId);
          return (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className={`flex items-center gap-3 p-3 rounded-2xl ${subject.softClass}`}
            >
              <span className="text-xs font-bold tabular-nums w-12">{item.time}</span>
              <span className="flex-1 text-sm font-medium truncate">{item.title}</span>
              <span className="text-[11px] text-muted-foreground">{subject.shortName}</span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
