import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Home, CalendarDays, ListChecks, Timer, Trophy, Settings } from "lucide-react";
import logoLight from "@/assets/yumemo-logo.png";
import logoDark from "@/assets/yumemo-logo-dark.png";

const items = [
  { icon: Home, label: "Dashboard", to: "/" as const },
  { icon: ListChecks, label: "Planner", to: "/planner" as const },
  { icon: CalendarDays, label: "Calendar", to: "/calendar" as const },
  { icon: Timer, label: "Focus", to: "/focus" as const },
  { icon: Trophy, label: "Rewards", to: "/rewards" as const },
  { icon: Settings, label: "Settings", to: "/settings" as const },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col gap-2 w-64 p-5 sticky top-0 h-screen">
      <div className="flex items-center gap-2 px-2 py-4">
        <img src={logoLight} alt="YuMemo" className="w-11 h-11 block dark:hidden" />
        <img src={logoDark} alt="YuMemo" className="w-11 h-11 hidden dark:block" />
        <div>
          <h1 className="text-xl font-bold text-gradient leading-none">YuMemo</h1>
          <p className="text-[11px] text-muted-foreground mt-1">plan smarter ෆ</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1 mt-4">
        {items.map((it, i) => (
          <motion.div
            key={it.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={it.to}
              activeOptions={{ exact: true }}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-colors text-muted-foreground hover:bg-card/60 hover:text-foreground data-[status=active]:bg-card data-[status=active]:text-foreground data-[status=active]:shadow-soft"
            >
              <it.icon className="w-[18px] h-[18px]" />
              {it.label}
            </Link>
          </motion.div>
        ))}
      </nav>

      <div className="mt-auto glass-card rounded-3xl p-4 text-center">
        <p className="text-xs text-muted-foreground">Daily streak</p>
        <p className="text-2xl font-bold text-gradient mt-1">7 days 🔥</p>
        <p className="text-[11px] text-muted-foreground mt-2">Keep it going, Yu!</p>
      </div>
    </aside>
  );
}