import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Check, Plus } from "lucide-react";

type Task = {
  id: number;
  title: string;
  subject: string;
  due: string;
  priority: "low" | "medium" | "high";
  done: boolean;
  color: string;
};

const initial: Task[] = [
  { id: 1, title: "Read Chapter 4 — Cellular Biology", subject: "Biology", due: "Today · 6:00 PM", priority: "high", done: false, color: "bg-primary/15 text-primary" },
  { id: 2, title: "Finish calculus problem set", subject: "Math", due: "Tomorrow", priority: "high", done: false, color: "bg-secondary/25 text-secondary-foreground" },
  { id: 3, title: "Essay outline — Murakami", subject: "Literature", due: "Fri", priority: "medium", done: false, color: "bg-accent/30 text-accent-foreground" },
  { id: 4, title: "Flashcards review (30 min)", subject: "Japanese", due: "Today", priority: "low", done: true, color: "bg-mint/30 text-mint-foreground" },
  { id: 5, title: "Lab report draft", subject: "Chemistry", due: "Mon", priority: "medium", done: false, color: "bg-peach/40 text-foreground" },
];

const priorityDot = {
  low: "bg-mint",
  medium: "bg-peach",
  high: "bg-primary",
};

export function TasksList() {
  const [tasks, setTasks] = useState(initial);
  const toggle = (id: number) =>
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));

  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold">Today's plan</h2>
          <p className="text-sm text-muted-foreground">{tasks.filter((t) => !t.done).length} tasks left ෆ</p>
        </div>
        <button className="flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-2xl bg-gradient-primary text-primary-foreground shadow-soft hover:scale-105 transition-transform">
          <Plus className="w-4 h-4" /> New
        </button>
      </div>

      <ul className="space-y-2">
        <AnimatePresence initial={false}>
          {tasks.map((t, i) => (
            <motion.li
              key={t.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/60 transition-colors"
            >
              <button
                onClick={() => toggle(t.id)}
                className={`w-6 h-6 rounded-full border-2 grid place-items-center transition-colors ${
                  t.done ? "bg-gradient-primary border-transparent" : "border-border hover:border-primary"
                }`}
              >
                {t.done && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${t.done ? "line-through text-muted-foreground" : ""}`}>
                  {t.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${t.color}`}>{t.subject}</span>
                  <span className="text-[11px] text-muted-foreground">{t.due}</span>
                </div>
              </div>
              <span className={`w-2 h-2 rounded-full ${priorityDot[t.priority]}`} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}