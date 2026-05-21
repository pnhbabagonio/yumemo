import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Bell, Search, Home, ListChecks, CalendarDays, Timer, Trophy } from "lucide-react";
import { Sidebar } from "./Sidebar";
import type { ReactNode } from "react";

const mobileNav = [
  { icon: Home, to: "/" as const },
  { icon: ListChecks, to: "/planner" as const },
  { icon: CalendarDays, to: "/calendar" as const },
  { icon: Timer, to: "/focus" as const },
  { icon: Trophy, to: "/rewards" as const },
];

export function AppLayout({
  title,
  subtitle,
  children,
}: {
  title: ReactNode;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex pb-20 lg:pb-0">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6 gap-4 flex-wrap"
        >
          <div>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            <h1 className="text-3xl sm:text-4xl font-bold mt-1">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 glass-card rounded-2xl px-3 py-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Search…"
                className="bg-transparent outline-none text-sm w-40 placeholder:text-muted-foreground"
              />
            </div>
            <button className="p-3 rounded-2xl glass-card relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
            </button>
          </div>
        </motion.header>

        <div className="space-y-6">{children}</div>

        <footer className="text-center text-xs text-muted-foreground py-8">
          YuMemo · plan smarter, study calmer ෆ
        </footer>
      </main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-3 left-3 right-3 glass-card rounded-3xl px-3 py-2 flex items-center justify-around z-50">
        {mobileNav.map((it) => (
          <Link
            key={it.to}
            to={it.to}
            activeOptions={{ exact: true }}
            className="p-3 rounded-2xl text-muted-foreground transition-colors data-[status=active]:bg-gradient-primary data-[status=active]:text-primary-foreground data-[status=active]:shadow-soft"
          >
            <it.icon className="w-5 h-5" />
          </Link>
        ))}
      </nav>
    </div>
  );
}