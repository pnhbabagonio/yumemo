import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Trophy, Flame, Sparkles, Coins, Star, BookOpen, Moon, Sun } from "lucide-react";
import { AppLayout } from "@/components/yumemo/AppLayout";

export const Route = createFileRoute("/rewards")({
  component: RewardsPage,
  head: () => ({
    meta: [
      { title: "Rewards · YuMemo" },
      { name: "description", content: "Earn XP, coins and badges for cozy consistent studying." },
    ],
  }),
});

const badges = [
  { icon: Flame, name: "Streak starter", desc: "3-day streak", earned: true, tone: "from-peach to-primary" },
  { icon: Sparkles, name: "Focused mind", desc: "10 sessions", earned: true, tone: "from-primary to-secondary" },
  { icon: Star, name: "Early bird", desc: "Submit early × 5", earned: true, tone: "from-mint to-accent" },
  { icon: BookOpen, name: "Bookworm", desc: "Read 100 pages", earned: false, tone: "from-secondary to-accent" },
  { icon: Moon, name: "Night owl", desc: "Study after 10pm × 5", earned: false, tone: "from-accent to-secondary" },
  { icon: Sun, name: "Sunrise scholar", desc: "Study before 7am × 5", earned: false, tone: "from-peach to-primary" },
];

const week = [
  { d: "Mon", v: 40 }, { d: "Tue", v: 65 }, { d: "Wed", v: 30 },
  { d: "Thu", v: 80 }, { d: "Fri", v: 90 }, { d: "Sat", v: 50 }, { d: "Sun", v: 70 },
];

function RewardsPage() {
  return (
    <AppLayout title="Rewards" subtitle="Tiny wins, big momentum ෆ">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-6 lg:col-span-2 relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-primary opacity-20 blur-3xl" />
          <div className="relative">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Level 4 · Diligent</p>
            <h2 className="text-3xl font-bold mt-1">240 <span className="text-base font-normal text-muted-foreground">/ 500 XP</span></h2>
            <div className="mt-4 h-3 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "48%" }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-primary"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">260 XP to level 5 — "Focused"</p>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-lg font-bold">7</p>
                  <p className="text-[11px] text-muted-foreground">streak</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-peach" />
                <div>
                  <p className="text-lg font-bold">320</p>
                  <p className="text-[11px] text-muted-foreground">coins</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-secondary-foreground" />
                <div>
                  <p className="text-lg font-bold">12</p>
                  <p className="text-[11px] text-muted-foreground">badges</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="glass-card rounded-3xl p-6">
          <h2 className="text-lg font-bold mb-4">This week</h2>
          <div className="flex items-end justify-between h-32 gap-2">
            {week.map((d, i) => (
              <div key={d.d} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${d.v}%` }}
                  transition={{ delay: i * 0.05, duration: 0.6 }}
                  className="w-full rounded-t-xl bg-gradient-primary shadow-soft"
                />
                <span className="text-[10px] text-muted-foreground">{d.d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6">
        <h2 className="text-lg font-bold mb-4">Badges</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges.map((b, i) => (
            <motion.div
              key={b.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className={`text-center p-4 rounded-2xl shadow-soft transition-opacity ${b.earned ? "bg-card" : "bg-card/50 opacity-60"}`}
            >
              <div className={`w-14 h-14 mx-auto rounded-2xl grid place-items-center bg-gradient-to-br ${b.tone} ${b.earned ? "" : "grayscale"}`}>
                <b.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <p className="text-sm font-bold mt-3">{b.name}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}