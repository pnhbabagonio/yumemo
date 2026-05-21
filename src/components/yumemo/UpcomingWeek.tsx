import { motion } from "framer-motion";

const week = [
  { d: "Mon", n: "18", load: 3, today: false },
  { d: "Tue", n: "19", load: 5, today: true },
  { d: "Wed", n: "20", load: 2, today: false },
  { d: "Thu", n: "21", load: 4, today: false },
  { d: "Fri", n: "22", load: 6, today: false },
  { d: "Sat", n: "23", load: 1, today: false },
  { d: "Sun", n: "24", load: 0, today: false },
];

const events = [
  { time: "10:00", title: "Calculus lecture", tag: "Math", color: "bg-secondary/30" },
  { time: "13:30", title: "Biology lab", tag: "Bio", color: "bg-primary/15" },
  { time: "16:00", title: "Study group ෆ", tag: "Japanese", color: "bg-mint/30" },
  { time: "19:00", title: "Essay revision", tag: "Lit", color: "bg-accent/30" },
];

export function UpcomingWeek() {
  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">This week</h2>
        <p className="text-xs text-muted-foreground">November · 2025</p>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-6">
        {week.map((d, i) => (
          <motion.div
            key={d.d}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`rounded-2xl p-2 text-center transition-colors ${
              d.today ? "bg-gradient-primary text-primary-foreground shadow-soft" : "bg-muted/60"
            }`}
          >
            <p className="text-[10px] uppercase tracking-wider opacity-80">{d.d}</p>
            <p className="text-lg font-bold mt-1">{d.n}</p>
            <div className="flex items-center justify-center gap-0.5 mt-1 h-2">
              {Array.from({ length: Math.min(d.load, 4) }).map((_, j) => (
                <span
                  key={j}
                  className={`w-1 h-1 rounded-full ${d.today ? "bg-primary-foreground/70" : "bg-primary/60"}`}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <ul className="space-y-2">
        {events.map((e, i) => (
          <motion.li
            key={e.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className={`flex items-center gap-3 p-3 rounded-2xl ${e.color}`}
          >
            <span className="text-xs font-bold tabular-nums w-12">{e.time}</span>
            <span className="flex-1 text-sm font-medium">{e.title}</span>
            <span className="text-[11px] text-muted-foreground">{e.tag}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}