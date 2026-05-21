import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppLayout } from "@/components/yumemo/AppLayout";

export const Route = createFileRoute("/calendar")({
  component: CalendarPage,
  head: () => ({
    meta: [
      { title: "Calendar · YuMemo" },
      { name: "description", content: "Monthly calendar view with color-coded classes and deadlines." },
    ],
  }),
});

const subjects = [
  { name: "Math", color: "bg-secondary" },
  { name: "Biology", color: "bg-primary" },
  { name: "Literature", color: "bg-accent" },
  { name: "Japanese", color: "bg-mint" },
  { name: "Chemistry", color: "bg-peach" },
];

const events: Record<number, { title: string; color: string }[]> = {
  3: [{ title: "Quiz · Math", color: "bg-secondary/40" }],
  6: [{ title: "Lab · Bio", color: "bg-primary/20" }],
  9: [{ title: "Essay due", color: "bg-accent/40" }],
  12: [{ title: "Vocab test", color: "bg-mint/40" }, { title: "Study group", color: "bg-primary/20" }],
  15: [{ title: "Mock exam", color: "bg-secondary/40" }],
  19: [{ title: "Lab report", color: "bg-peach/50" }],
  21: [{ title: "Project mtg", color: "bg-accent/40" }],
  24: [{ title: "Read ch. 5", color: "bg-primary/20" }],
  27: [{ title: "Final draft", color: "bg-accent/40" }],
};

function CalendarPage() {
  const daysInMonth = 30;
  const startOffset = 5; // Nov 1 = Sat → adjust to start Mon
  const today = 19;
  const cells = Array.from({ length: startOffset + daysInMonth }, (_, i) =>
    i < startOffset ? null : i - startOffset + 1,
  );

  return (
    <AppLayout title="Calendar" subtitle="November 2025">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button className="p-2.5 rounded-2xl glass-card"><ChevronLeft className="w-4 h-4" /></button>
          <button className="p-2.5 rounded-2xl glass-card"><ChevronRight className="w-4 h-4" /></button>
          <button className="px-4 py-2 rounded-2xl bg-gradient-primary text-primary-foreground text-sm font-medium shadow-soft">Today</button>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {subjects.map((s) => (
            <div key={s.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={`w-2.5 h-2.5 rounded-full ${s.color}`} /> {s.name}
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-3xl p-3 sm:p-5">
        <div className="grid grid-cols-7 mb-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="text-[11px] uppercase tracking-wider text-muted-foreground p-2 text-center">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {cells.map((day, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.005 }}
              className={`min-h-[88px] rounded-2xl p-2 transition-colors ${
                day == null
                  ? "bg-transparent"
                  : day === today
                    ? "bg-gradient-primary text-primary-foreground shadow-soft"
                    : "bg-card/70 hover:bg-card"
              }`}
            >
              {day != null && (
                <>
                  <p className="text-xs font-bold">{day}</p>
                  <div className="mt-1 space-y-1">
                    {events[day]?.map((e, j) => (
                      <p key={j} className={`text-[10px] px-1.5 py-0.5 rounded-md truncate ${day === today ? "bg-primary-foreground/20" : e.color}`}>
                        {e.title}
                      </p>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6">
        <h2 className="text-lg font-bold mb-2">Google Calendar sync</h2>
        <p className="text-sm text-muted-foreground mb-4">Bring in lectures and labs automatically. Sync runs every 15 minutes.</p>
        <button className="px-4 py-2 rounded-2xl bg-gradient-primary text-primary-foreground text-sm font-medium shadow-soft hover:scale-105 transition-transform">
          Connect Google Calendar
        </button>
      </div>
    </AppLayout>
  );
}