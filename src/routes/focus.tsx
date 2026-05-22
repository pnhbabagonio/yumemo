import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BookOpen, CloudRain, Coffee, Headphones, Music, Sparkles, Volume2 } from "lucide-react";
import { AppLayout } from "@/components/yumemo/AppLayout";
import { FocusTimer } from "@/components/yumemo/FocusTimer";
import { MascotCard } from "@/components/yumemo/MascotCard";
import { toDateKey } from "@/lib/date";
import { useStudySessionsStore, useTasksStore } from "@/stores/yumemo";

export const Route = createFileRoute("/focus")({
  component: FocusPage,
  head: () => ({
    meta: [
      { title: "Focus - YuMemo" },
      {
        name: "description",
        content: "Cozy pomodoro and deep focus room with lofi vibes and study tracking.",
      },
    ],
  }),
});

const sounds = [
  { name: "Lofi cafe", icon: Coffee },
  { name: "Rainy window", icon: CloudRain },
  { name: "Soft library", icon: BookOpen },
  { name: "Headphones", icon: Headphones },
];

function FocusPage() {
  const sessions = useStudySessionsStore((state) => state.sessions);
  const getTask = useTasksStore((state) => state.getTask);
  const today = toDateKey();
  const todaySessions = sessions.filter(
    (session) => toDateKey(new Date(session.completedAt)) === today,
  );
  const todayMinutes = todaySessions.reduce((sum, session) => sum + session.durationMinutes, 0);
  const todayXp = todaySessions.reduce((sum, session) => sum + session.xpEarned, 0);

  return (
    <AppLayout
      title={
        <>
          Focus <span className="text-gradient">room</span>
        </>
      }
      subtitle="Slow down. Settle in."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <FocusTimer />

          <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-primary" />
                <h2 className="text-lg font-bold">Ambient sounds</h2>
              </div>
              <Volume2 className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {sounds.map((sound, i) => (
                <motion.button
                  key={sound.name}
                  whileHover={{ scale: 1.04 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-5 rounded-2xl bg-card text-center shadow-soft hover:bg-gradient-primary hover:text-primary-foreground transition-colors"
                >
                  <sound.icon className="w-7 h-7 mx-auto mb-2" />
                  <p className="text-xs font-medium">{sound.name}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <MascotCard />

          <div className="glass-card rounded-3xl p-6">
            <h2 className="text-lg font-bold mb-1">Today's sessions</h2>
            <p className="text-xs text-muted-foreground mb-4">
              {todayMinutes}m focused - +{todayXp} XP
            </p>
            <ul className="space-y-3">
              {todaySessions.length === 0 && (
                <li className="rounded-2xl bg-muted/60 p-4 text-sm text-muted-foreground text-center">
                  No sessions yet today.
                </li>
              )}
              {todaySessions.map((session, i) => {
                const task = getTask(session.taskId);
                const time = new Date(session.completedAt).toLocaleTimeString(undefined, {
                  hour: "numeric",
                  minute: "2-digit",
                });
                return (
                  <motion.li
                    key={session.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-muted/60"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center shadow-soft">
                      <Sparkles className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {task?.title ?? "Unlinked focus session"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {time} - {session.durationMinutes}m
                      </p>
                    </div>
                    <span className="text-xs font-bold text-primary">+{session.xpEarned}</span>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
