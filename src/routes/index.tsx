import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/yumemo/AppLayout";
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
    <AppLayout
      subtitle="Tuesday, November 19"
      title={<>Good afternoon, <span className="text-gradient">Yu</span> ෆ</>}
    >
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
    </AppLayout>
  );
}
