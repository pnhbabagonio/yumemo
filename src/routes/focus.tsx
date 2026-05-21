import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Music, Volume2, Sparkles } from "lucide-react";
import { AppLayout } from "@/components/yumemo/AppLayout";
import { FocusTimer } from "@/components/yumemo/FocusTimer";
import { MascotCard } from "@/components/yumemo/MascotCard";

export const Route = createFileRoute("/focus")({
  component: FocusPage,
  head: () => ({
    meta: [
      { title: "Focus · YuMemo" },
      { name: "description", content: "Cozy pomodoro and deep focus room with lofi vibes and study tracking." },
    ],
  }),
});

const sounds = [
  { name: "Lofi café", emoji: "☕" },
  { name: "Rainy window", emoji: "🌧️" },
  { name: "Forest", emoji: "🌲" },
  { name: "Library", emoji: "📚" },
];

const presets = [
  { label: "Pomodoro", time: "25 / 5" },
  { label: "Deep focus", time: "50 / 10" },
  { label: "Sprint", time: "15 / 3" },
  { label: "Custom", time: "you pick" },
];

const sessions = [
  { task: "Biology — Ch. 4", duration: "45m", time: "2:15 PM", xp: "+45" },
  { task: "Calculus practice", duration: "25m", time: "12:30 PM", xp: "+25" },
  { task: "Japanese vocab", duration: "30m", time: "10:00 AM", xp: "+30" },
];

function FocusPage() {
  return (
    <AppLayout
      title={<>Focus <span className="text-gradient">room</span></>}
      subtitle="Slow down. Settle in. ෆ"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <FocusTimer />

          <div className="glass-card rounded-3xl p-6">
            <h2 className="text-lg font-bold mb-4">Presets</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {presets.map((p, i) => (
                <motion.button
                  key={p.label}
                  whileHover={{ y: -3 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-2xl bg-card hover:bg-gradient-primary hover:text-primary-foreground transition-colors text-left shadow-soft"
                >
                  <p className="text-sm font-bold">{p.label}</p>
                  <p className="text-xs opacity-70 mt-1">{p.time} min</p>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-primary" />
                <h2 className="text-lg font-bold">Ambient sounds</h2>
              </div>
              <Volume2 className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {sounds.map((s, i) => (
                <motion.button
                  key={s.name}
                  whileHover={{ scale: 1.04 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-5 rounded-2xl bg-card text-center shadow-soft hover:bg-gradient-primary hover:text-primary-foreground transition-colors"
                >
                  <div className="text-3xl mb-1">{s.emoji}</div>
                  <p className="text-xs font-medium">{s.name}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <MascotCard />

          <div className="glass-card rounded-3xl p-6">
            <h2 className="text-lg font-bold mb-1">Today's sessions</h2>
            <p className="text-xs text-muted-foreground mb-4">1h 40m focused · +100 XP</p>
            <ul className="space-y-3">
              {sessions.map((s, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-muted/60"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center shadow-soft">
                    <Sparkles className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{s.task}</p>
                    <p className="text-[11px] text-muted-foreground">{s.time} · {s.duration}</p>
                  </div>
                  <span className="text-xs font-bold text-primary">{s.xp}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}