import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  BookOpen,
  Coins,
  Flame,
  Lock,
  Moon,
  Sparkles,
  Star,
  Sun,
  Target,
  Trophy,
} from "lucide-react";
import { AppLayout } from "@/components/yumemo/AppLayout";
import { addDays, toDateKey } from "@/lib/date";
import {
  useRewardsStore,
  useStreakStore,
  useStudySessionsStore,
  useTasksStore,
  useXpStore,
} from "@/stores/yumemo";

export const Route = createFileRoute("/rewards")({
  component: RewardsPage,
  head: () => ({
    meta: [
      { title: "Rewards - YuMemo" },
      { name: "description", content: "Earn XP, coins and badges for cozy consistent studying." },
    ],
  }),
});

const badgeIcons = {
  "streak-starter": Flame,
  "focused-mind": Sparkles,
  "early-bird": Star,
  "first-spark": Target,
  "task-tamer": Trophy,
  "exam-ready": BookOpen,
  "deep-work": Moon,
  "level-five": Sun,
  "coin-keeper": Coins,
  "planner-pro": BookOpen,
};

const tones = [
  "from-peach to-primary",
  "from-primary to-secondary",
  "from-mint to-accent",
  "from-secondary to-accent",
  "from-accent to-secondary",
  "from-peach to-primary",
];

function RewardsPage() {
  const totalXp = useXpStore((state) => state.totalXp);
  const level = useXpStore((state) => state.level);
  const coins = useXpStore((state) => state.coins);
  const xp = useXpStore((state) => state.xpIntoLevel());
  const xpForNextLevel = useXpStore((state) => state.xpForNextLevel());
  const achievements = useRewardsStore((state) => state.achievements);
  const recentUnlockId = useRewardsStore((state) => state.recentUnlockId);
  const clearRecentUnlock = useRewardsStore((state) => state.clearRecentUnlock);
  const streak = useStreakStore((state) => state.getDisplayStreak());
  const sessions = useStudySessionsStore((state) => state.sessions);
  const tasks = useTasksStore((state) => state.tasks);
  const unlocked = achievements.filter((achievement) => achievement.unlockedAt);
  const progress = Math.min(100, (xp / xpForNextLevel) * 100);
  const today = toDateKey();
  const week = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(today, index - 6);
    const minutes = sessions
      .filter((session) => toDateKey(new Date(session.completedAt)) === date)
      .reduce((sum, session) => sum + session.durationMinutes, 0);
    return {
      date,
      label: new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { weekday: "short" }),
      value: Math.min(100, Math.max(12, minutes)),
    };
  });

  return (
    <AppLayout title="Rewards" subtitle="Tiny wins, big momentum">
      {recentUnlockId && (
        <motion.button
          onClick={clearRecentUnlock}
          initial={{ opacity: 0, y: -14, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-full rounded-3xl bg-gradient-primary text-primary-foreground p-4 shadow-float text-left"
        >
          <p className="text-sm uppercase tracking-widest opacity-80">Achievement unlocked</p>
          <p className="text-xl font-bold">
            {achievements.find((achievement) => achievement.id === recentUnlockId)?.name}
          </p>
        </motion.button>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-6 lg:col-span-2 relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-primary opacity-20 blur-3xl" />
          <div className="relative">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Level {level} - Diligent
            </p>
            <h2 className="text-3xl font-bold mt-1">
              {xp}{" "}
              <span className="text-base font-normal text-muted-foreground">
                / {xpForNextLevel} XP
              </span>
            </h2>
            <div className="mt-4 h-3 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-primary"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {xpForNextLevel - xp} XP to level {level + 1}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-lg font-bold">{streak}</p>
                  <p className="text-[11px] text-muted-foreground">streak</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-peach" />
                <div>
                  <p className="text-lg font-bold">{coins}</p>
                  <p className="text-[11px] text-muted-foreground">coins</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-secondary-foreground" />
                <div>
                  <p className="text-lg font-bold">{unlocked.length}</p>
                  <p className="text-[11px] text-muted-foreground">badges</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-lg font-bold">{totalXp}</p>
                  <p className="text-[11px] text-muted-foreground">total XP</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="glass-card rounded-3xl p-6">
          <h2 className="text-lg font-bold mb-4">This week</h2>
          <div className="flex items-end justify-between h-32 gap-2">
            {week.map((day, i) => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${day.value}%` }}
                  transition={{ delay: i * 0.05, duration: 0.6 }}
                  className="w-full rounded-t-xl bg-gradient-primary shadow-soft"
                />
                <span className="text-[10px] text-muted-foreground">{day.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-3xl p-5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Completed tasks</p>
          <p className="text-3xl font-bold mt-2">
            {tasks.filter((task) => task.status === "completed").length}
          </p>
        </div>
        <div className="glass-card rounded-3xl p-5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Study sessions</p>
          <p className="text-3xl font-bold mt-2">{sessions.length}</p>
        </div>
        <div className="glass-card rounded-3xl p-5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Achievement progress
          </p>
          <p className="text-3xl font-bold mt-2">
            {unlocked.length}/{achievements.length}
          </p>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6">
        <h2 className="text-lg font-bold mb-4">Badges</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {achievements.map((achievement, i) => {
            const Icon = badgeIcons[achievement.id as keyof typeof badgeIcons] ?? Trophy;
            const earned = Boolean(achievement.unlockedAt);
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className={`text-center p-4 rounded-2xl shadow-soft transition-opacity ${earned ? "bg-card" : "bg-card/50 opacity-65"}`}
              >
                <div
                  className={`w-14 h-14 mx-auto rounded-2xl grid place-items-center bg-gradient-to-br ${tones[i % tones.length]} ${earned ? "" : "grayscale"}`}
                >
                  {earned ? (
                    <Icon className="w-7 h-7 text-primary-foreground" />
                  ) : (
                    <Lock className="w-6 h-6 text-primary-foreground" />
                  )}
                </div>
                <p className="text-sm font-bold mt-3">{achievement.name}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{achievement.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
