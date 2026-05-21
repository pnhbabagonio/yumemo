import { motion } from "framer-motion";
import { Flame, Sparkles, Target, TrendingUp } from "lucide-react";

const stats = [
  { icon: Flame, label: "Streak", value: "7", suffix: "days", tone: "from-peach to-primary" },
  { icon: Sparkles, label: "XP today", value: "240", suffix: "/ 500", tone: "from-primary to-secondary" },
  { icon: Target, label: "Tasks done", value: "4", suffix: "/ 7", tone: "from-mint to-accent" },
  { icon: TrendingUp, label: "Focus", value: "1h 45m", suffix: "today", tone: "from-secondary to-accent" },
];

export function StatsRow() {
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
          <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${s.tone} grid place-items-center mb-3 shadow-soft`}>
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