import { motion } from "framer-motion";
import { Flame, Sparkles, Target, TrendingUp } from "lucide-react";
import { toDateKey } from "@/lib/date";
import { useStreakStore, useStudySessionsStore, useTasksStore, useXpStore } from "@/stores/yumemo";

export function StatsRow() {
  const tasks = useTasksStore((state) => state.tasks);
  const xpToday = useXpStore((state) => state.xpToday);
  const xpForNextLevel = useXpStore((state) => state.xpForNextLevel());
  const streak = useStreakStore((state) => state.getDisplayStreak());
  const sessions = useStudySessionsStore((state) => state.sessions);
  const today = toDateKey();
  const todayTasks = tasks.filter(
    (task) => task.dueDate === today || task.targetStudyDate === today,
  );
  const doneToday = todayTasks.filter((task) => task.status === "completed").length;
  const focusMinutes = sessions
    .filter((session) => toDateKey(new Date(session.completedAt)) === today)
    .reduce((total, session) => total + session.durationMinutes, 0);
  const focusLabel =
    focusMinutes >= 60
      ? `${Math.floor(focusMinutes / 60)}h ${String(focusMinutes % 60).padStart(2, "0")}m`
      : `${focusMinutes}m`;

  const stats = [
    {
      icon: Flame,
      label: "Streak",
      value: String(streak),
      suffix: "days",
      tone: "from-peach to-primary",
    },
    {
      icon: Sparkles,
      label: "XP today",
      value: String(xpToday),
      suffix: `/ ${xpForNextLevel}`,
      tone: "from-primary to-secondary",
    },
    {
      icon: Target,
      label: "Tasks done",
      value: String(doneToday),
      suffix: `/ ${todayTasks.length}`,
      tone: "from-mint to-accent",
    },
    {
      icon: TrendingUp,
      label: "Focus",
      value: focusLabel,
      suffix: "today",
      tone: "from-secondary to-accent",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          whileHover={{ y: -4 }}
          className="glass-card rounded-3xl p-5"
        >
          <div
            className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${s.tone} grid place-items-center mb-3 shadow-soft`}
          >
            <s.icon className="w-5 h-5 text-primary-foreground" />
          </div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
          <p className="text-2xl font-bold mt-1">
            {s.value} <span className="text-sm font-normal text-muted-foreground">{s.suffix}</span>
          </p>
        </motion.div>
      ))}
    </div>
  );
}
