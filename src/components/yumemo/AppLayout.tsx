import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Bell, CalendarDays, Home, ListChecks, Search, Timer, Trophy } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { useNotificationsStore, useTasksStore } from "@/stores/yumemo";

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
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const tasks = useTasksStore((state) => state.tasks);
  const notifications = useNotificationsStore((state) => state.notifications);
  const generateTaskReminders = useNotificationsStore((state) => state.generateTaskReminders);
  const markRead = useNotificationsStore((state) => state.markRead);
  const markAllRead = useNotificationsStore((state) => state.markAllRead);
  const unread = notifications.filter((notification) => !notification.read).length;

  useEffect(() => {
    generateTaskReminders(tasks);
  }, [generateTaskReminders, tasks]);

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
          <div className="flex items-center gap-2 relative">
            <div className="hidden sm:flex items-center gap-2 glass-card rounded-2xl px-3 py-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Search..."
                className="bg-transparent outline-none text-sm w-40 placeholder:text-muted-foreground"
              />
            </div>
            <button
              onClick={() => setNotificationsOpen((open) => !open)}
              className="p-3 rounded-2xl glass-card relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold grid place-items-center">
                  {unread}
                </span>
              )}
            </button>

            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  className="absolute right-0 top-14 z-50 w-[min(22rem,calc(100vw-2rem))] rounded-3xl bg-card shadow-float border border-border overflow-hidden"
                >
                  <div className="p-4 border-b border-border flex items-center justify-between gap-3">
                    <div>
                      <h2 className="font-bold">Notifications</h2>
                      <p className="text-xs text-muted-foreground">{unread} unread</p>
                    </div>
                    <button onClick={markAllRead} className="text-xs font-bold text-primary">
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto p-2">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-sm text-muted-foreground">
                        No reminders yet.
                      </div>
                    ) : (
                      notifications.slice(0, 8).map((notification) => (
                        <button
                          key={notification.id}
                          onClick={() => markRead(notification.id)}
                          className={`w-full text-left rounded-2xl p-3 transition-colors ${
                            notification.read
                              ? "hover:bg-muted/50"
                              : "bg-primary/10 hover:bg-primary/15"
                          }`}
                        >
                          <p className="text-sm font-bold">{notification.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.header>

        <div className="space-y-6">{children}</div>

        <footer className="text-center text-xs text-muted-foreground py-8">
          YuMemo - plan smarter, study calmer
        </footer>
      </main>

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
