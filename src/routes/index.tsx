import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Bell, Search } from "lucide-react";
import { Sidebar } from "@/components/yumemo/Sidebar";
import { StatsRow } from "@/components/yumemo/StatsRow";
import { TasksList } from "@/components/yumemo/TasksList";
import { FocusTimer } from "@/components/yumemo/FocusTimer";
import { MascotCard } from "@/components/yumemo/MascotCard";
import { UpcomingWeek } from "@/components/yumemo/UpcomingWeek";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "YuMemo — Plan smarter. Study calmer." },
      { name: "description", content: "Cozy kawaii academic planner with tasks, calendar, focus timer, and gamified study streaks for high school and college students." },
      { property: "og:title", content: "YuMemo — Plan smarter. Study calmer." },
      { property: "og:description", content: "A cozy kawaii productivity space for students." },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6 gap-4 flex-wrap"
        >
          <div>
            <p className="text-sm text-muted-foreground">Tuesday, November 19</p>
            <h1 className="text-3xl sm:text-4xl font-bold mt-1">
              Good afternoon, <span className="text-gradient">Yu</span> ෆ
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 glass-card rounded-2xl px-3 py-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Search tasks, notes…"
                className="bg-transparent outline-none text-sm w-48 placeholder:text-muted-foreground"
              />
            </div>
            <button className="p-3 rounded-2xl glass-card relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
            </button>
          </div>
        </motion.header>

        <div className="space-y-6">
          <StatsRow />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <MascotCard />
              <TasksList />
            </div>
            <div className="space-y-6">
              <FocusTimer />
              <UpcomingWeek />
            </div>
          </div>

          <footer className="text-center text-xs text-muted-foreground py-6">
            YuMemo · plan smarter, study calmer ෆ
          </footer>
        </div>
      </main>
    </div>
  );
}
