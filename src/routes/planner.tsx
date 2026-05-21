import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, Filter, LayoutGrid, Table2 } from "lucide-react";
import { AppLayout } from "@/components/yumemo/AppLayout";

export const Route = createFileRoute("/planner")({
  component: PlannerPage,
  head: () => ({
    meta: [
      { title: "Planner · YuMemo" },
      { name: "description", content: "Kanban and table planner for assignments, exams, projects and study sessions." },
    ],
  }),
});

type Status = "todo" | "doing" | "done";
type Card = {
  id: number;
  title: string;
  subject: string;
  due: string;
  priority: "low" | "medium" | "high";
  progress: number;
  status: Status;
  tone: string;
};

const seed: Card[] = [
  { id: 1, title: "Read Chapter 4", subject: "Biology", due: "Today", priority: "high", progress: 30, status: "doing", tone: "bg-primary/15 text-primary" },
  { id: 2, title: "Problem set #6", subject: "Math", due: "Tomorrow", priority: "high", progress: 0, status: "todo", tone: "bg-secondary/30 text-secondary-foreground" },
  { id: 3, title: "Essay outline", subject: "Literature", due: "Fri", priority: "medium", progress: 50, status: "doing", tone: "bg-accent/30 text-accent-foreground" },
  { id: 4, title: "Flashcards review", subject: "Japanese", due: "Today", priority: "low", progress: 100, status: "done", tone: "bg-mint/30 text-mint-foreground" },
  { id: 5, title: "Lab report draft", subject: "Chemistry", due: "Mon", priority: "medium", progress: 10, status: "todo", tone: "bg-peach/40 text-foreground" },
  { id: 6, title: "History timeline", subject: "History", due: "Wed", priority: "medium", progress: 70, status: "doing", tone: "bg-secondary/30 text-secondary-foreground" },
  { id: 7, title: "Mock exam — Calculus", subject: "Math", due: "Sat", priority: "high", progress: 0, status: "todo", tone: "bg-secondary/30 text-secondary-foreground" },
  { id: 8, title: "Vocabulary set 12", subject: "Japanese", due: "Done", priority: "low", progress: 100, status: "done", tone: "bg-mint/30 text-mint-foreground" },
];

const columns: { key: Status; label: string; hint: string }[] = [
  { key: "todo", label: "To do", hint: "fresh & cozy" },
  { key: "doing", label: "In progress", hint: "you got this" },
  { key: "done", label: "Done", hint: "treat yourself ෆ" },
];

const priorityDot = { low: "bg-mint", medium: "bg-peach", high: "bg-primary" };

function PlannerPage() {
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [cards] = useState(seed);

  return (
    <AppLayout title="Planner" subtitle="Drag your week into shape">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="glass-card rounded-2xl p-1 flex">
          {(["kanban", "table"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors ${
                view === v ? "bg-gradient-primary text-primary-foreground shadow-soft" : "text-muted-foreground"
              }`}
            >
              {v === "kanban" ? <LayoutGrid className="w-4 h-4" /> : <Table2 className="w-4 h-4" />}
              {v === "kanban" ? "Kanban" : "Table"}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-2xl glass-card text-sm font-medium flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="px-4 py-2 rounded-2xl bg-gradient-primary text-primary-foreground text-sm font-medium flex items-center gap-2 shadow-soft hover:scale-105 transition-transform">
            <Plus className="w-4 h-4" /> Add task
          </button>
        </div>
      </div>

      {view === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {columns.map((col, ci) => (
            <motion.div
              key={col.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ci * 0.08 }}
              className="glass-card rounded-3xl p-4"
            >
              <div className="flex items-baseline justify-between mb-4 px-2">
                <h2 className="font-bold">{col.label}</h2>
                <span className="text-xs text-muted-foreground">{col.hint}</span>
              </div>
              <div className="space-y-3">
                {cards.filter((c) => c.status === col.key).map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    whileHover={{ y: -3 }}
                    className="bg-card rounded-2xl p-4 shadow-soft cursor-grab"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold leading-snug">{c.title}</p>
                      <span className={`w-2 h-2 rounded-full mt-2 ${priorityDot[c.priority]}`} />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${c.tone}`}>{c.subject}</span>
                      <span className="text-[11px] text-muted-foreground">{c.due}</span>
                    </div>
                    <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${c.progress}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-full bg-gradient-primary"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-3xl p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="p-3">Task</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Due</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Progress</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {cards.map((c) => (
                <tr key={c.id} className="border-t border-border hover:bg-muted/40">
                  <td className="p-3 font-medium">{c.title}</td>
                  <td className="p-3">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${c.tone}`}>{c.subject}</span>
                  </td>
                  <td className="p-3 text-muted-foreground">{c.due}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <span className={`w-2 h-2 rounded-full ${priorityDot[c.priority]}`} />
                      {c.priority}
                    </span>
                  </td>
                  <td className="p-3 w-40">
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-gradient-primary" style={{ width: `${c.progress}%` }} />
                    </div>
                  </td>
                  <td className="p-3 capitalize text-muted-foreground">{c.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppLayout>
  );
}