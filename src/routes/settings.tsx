import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  BookOpen,
  CalendarDays,
  LogOut,
  Mail,
  Moon,
  Palette,
  Plus,
  Sun,
  Trash2,
} from "lucide-react";
import { AppLayout } from "@/components/yumemo/AppLayout";
import mascot from "@/assets/mascot.png";
import { applyTheme, loadThemePrefs, themes } from "@/lib/theme";
import {
  type ReminderTiming,
  type Subject,
  useCalendarStore,
  useMascotStore,
  useNotificationsStore,
  useSubjectsStore,
  useXpStore,
} from "@/stores/yumemo";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [
      { title: "Settings - YuMemo" },
      {
        name: "description",
        content: "Personalize your YuMemo: themes, mascot, notifications and calendar.",
      },
    ],
  }),
});

const subjectPalettes: Array<
  Pick<Subject, "badgeClass" | "softClass" | "dotClass"> & { label: string }
> = [
  {
    label: "Sakura",
    badgeClass: "bg-primary/15 text-primary",
    softClass: "bg-primary/15",
    dotClass: "bg-primary",
  },
  {
    label: "Lavender",
    badgeClass: "bg-secondary/30 text-secondary-foreground",
    softClass: "bg-secondary/20",
    dotClass: "bg-secondary",
  },
  {
    label: "Sky",
    badgeClass: "bg-accent/30 text-accent-foreground",
    softClass: "bg-accent/20",
    dotClass: "bg-accent",
  },
  {
    label: "Mint",
    badgeClass: "bg-mint/30 text-mint-foreground",
    softClass: "bg-mint/20",
    dotClass: "bg-mint",
  },
  {
    label: "Peach",
    badgeClass: "bg-peach/40 text-foreground",
    softClass: "bg-peach/25",
    dotClass: "bg-peach",
  },
];

function Toggle({ on, onChange }: { on: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={`w-12 h-7 rounded-full p-1 transition-colors ${on ? "bg-gradient-primary" : "bg-muted"}`}
      aria-pressed={on}
    >
      <motion.div
        layout
        className={`w-5 h-5 rounded-full bg-card shadow-soft ${on ? "ml-auto" : ""}`}
      />
    </button>
  );
}

function SettingsPage() {
  const [dark, setDark] = useState(false);
  const [theme, setTheme] = useState(0);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectShortName, setNewSubjectShortName] = useState("");
  const [paletteIndex, setPaletteIndex] = useState(0);
  const preferences = useNotificationsStore((state) => state.preferences);
  const setPreference = useNotificationsStore((state) => state.setPreference);
  const mascotState = useMascotStore((state) => state);
  const setAppearance = useMascotStore((state) => state.setAppearance);
  const subjects = useSubjectsStore((state) => state.subjects);
  const addSubject = useSubjectsStore((state) => state.addSubject);
  const updateSubject = useSubjectsStore((state) => state.updateSubject);
  const deleteSubject = useSubjectsStore((state) => state.deleteSubject);
  const firstDayOfWeek = useCalendarStore((state) => state.firstDayOfWeek);
  const defaultView = useCalendarStore((state) => state.defaultView);
  const setFirstDayOfWeek = useCalendarStore((state) => state.setFirstDayOfWeek);
  const setDefaultView = useCalendarStore((state) => state.setDefaultView);
  const level = useXpStore((state) => state.level);

  useEffect(() => {
    const prefs = loadThemePrefs();
    setTheme(prefs.themeIdx);
    setDark(prefs.dark);
  }, []);

  useEffect(() => {
    applyTheme(theme, dark);
  }, [theme, dark]);

  const reminderRows: Array<{ key: ReminderTiming; label: string; desc: string }> = [
    { key: "7d", label: "7 days before", desc: "Gentle long runway reminders" },
    { key: "3d", label: "3 days before", desc: "A useful middle nudge" },
    { key: "1d", label: "1 day before", desc: "Tomorrow is coming" },
    { key: "same-day", label: "Same day", desc: "Due today reminders" },
    { key: "overdue", label: "Overdue", desc: "Kind recovery prompts" },
  ];

  const createSubject = () => {
    const name = newSubjectName.trim();
    if (!name) return;
    const palette = subjectPalettes[paletteIndex] ?? subjectPalettes[0];
    addSubject({
      name,
      shortName: newSubjectShortName.trim() || name.slice(0, 4),
      badgeClass: palette.badgeClass,
      softClass: palette.softClass,
      dotClass: palette.dotClass,
    });
    setNewSubjectName("");
    setNewSubjectShortName("");
  };

  return (
    <AppLayout title="Settings" subtitle="Make YuMemo yours">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-6 text-center"
        >
          <img
            src={mascot}
            alt="Yu mascot"
            width={120}
            height={120}
            className="w-28 h-28 mx-auto animate-float"
          />
          <h2 className="text-xl font-bold mt-3">Yu</h2>
          <p className="text-xs text-muted-foreground">Cat - Level {level}</p>
          <div className="mt-5 text-left space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Color
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(["sakura", "mint", "lavender", "sunset"] as const).map((variant) => (
                  <button
                    key={variant}
                    onClick={() => setAppearance({ colorVariant: variant })}
                    className={`rounded-2xl px-3 py-2 text-sm capitalize ${mascotState.colorVariant === variant ? "bg-gradient-primary text-primary-foreground shadow-soft" : "bg-muted/70"}`}
                  >
                    {variant}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Accessory
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(["ribbon", "glasses", "scarf", "none"] as const).map((accessory) => (
                  <button
                    key={accessory}
                    onClick={() => setAppearance({ accessory })}
                    className={`rounded-2xl px-3 py-2 text-sm capitalize ${mascotState.accessory === accessory ? "bg-gradient-primary text-primary-foreground shadow-soft" : "bg-muted/70"}`}
                  >
                    {accessory}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-4 h-4 text-primary" />
              <h2 className="font-bold">Theme</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {themes.map((item, i) => (
                <button
                  key={item.name}
                  onClick={() => setTheme(i)}
                  className={`p-4 rounded-2xl text-left transition-all ${theme === i ? "ring-2 ring-primary bg-card shadow-soft" : "bg-card/60 hover:bg-card"}`}
                >
                  <div className="flex -space-x-2 mb-2">
                    {item.colors.map((color, j) => (
                      <span
                        key={j}
                        className="w-6 h-6 rounded-full border-2 border-card"
                        style={{ background: color }}
                      />
                    ))}
                  </div>
                  <p className="text-sm font-medium">{item.name}</p>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mt-5 p-3 rounded-2xl bg-muted/60">
              <div className="flex items-center gap-3">
                {dark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                <div>
                  <p className="text-sm font-medium">Dark mode</p>
                  <p className="text-xs text-muted-foreground">Cozy late-night studying</p>
                </div>
              </div>
              <Toggle on={dark} onChange={setDark} />
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6">
            <h2 className="font-bold mb-4">Notifications</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/60">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Push notifications</p>
                    <p className="text-xs text-muted-foreground">
                      Browser and mobile-ready preference
                    </p>
                  </div>
                </div>
                <Toggle on={preferences.push} onChange={(value) => setPreference("push", value)} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/60">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Email reminders</p>
                    <p className="text-xs text-muted-foreground">Email service stub preference</p>
                  </div>
                </div>
                <Toggle
                  on={preferences.email}
                  onChange={(value) => setPreference("email", value)}
                />
              </div>
              {reminderRows.map((row) => (
                <div
                  key={row.key}
                  className="flex items-center justify-between p-3 rounded-2xl bg-muted/60"
                >
                  <div>
                    <p className="text-sm font-medium">{row.label}</p>
                    <p className="text-xs text-muted-foreground">{row.desc}</p>
                  </div>
                  <Toggle
                    on={preferences[row.key]}
                    onChange={(value) => setPreference(row.key, value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-primary" />
              <h2 className="font-bold">Subjects and classes</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_7rem_auto] gap-2 mb-4">
              <input
                value={newSubjectName}
                onChange={(event) => setNewSubjectName(event.target.value)}
                placeholder="Subject name"
                className="rounded-2xl bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                value={newSubjectShortName}
                onChange={(event) => setNewSubjectShortName(event.target.value)}
                placeholder="Short"
                className="rounded-2xl bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                onClick={createSubject}
                className="rounded-2xl bg-gradient-primary text-primary-foreground px-4 py-2 text-sm font-bold flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {subjectPalettes.map((palette, index) => (
                <button
                  key={palette.label}
                  onClick={() => setPaletteIndex(index)}
                  className={`flex items-center gap-2 rounded-2xl px-3 py-2 text-xs ${paletteIndex === index ? "bg-card ring-2 ring-primary" : "bg-muted/60"}`}
                >
                  <span className={`w-3 h-3 rounded-full ${palette.dotClass}`} />
                  {palette.label}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {subjects.map((subject) => (
                <div
                  key={subject.id}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_7rem_auto] gap-2 rounded-2xl bg-muted/60 p-3"
                >
                  <input
                    value={subject.name}
                    onChange={(event) => updateSubject(subject.id, { name: event.target.value })}
                    className="rounded-xl bg-card px-3 py-2 text-sm outline-none"
                  />
                  <input
                    value={subject.shortName}
                    onChange={(event) =>
                      updateSubject(subject.id, { shortName: event.target.value })
                    }
                    className="rounded-xl bg-card px-3 py-2 text-sm outline-none"
                  />
                  <button
                    onClick={() => deleteSubject(subject.id)}
                    className="rounded-xl bg-destructive/15 text-destructive px-3 py-2 text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="w-4 h-4 text-primary" />
              <h2 className="font-bold">Calendar preferences</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  First day of week
                </span>
                <select
                  value={firstDayOfWeek}
                  onChange={(event) => setFirstDayOfWeek(Number(event.target.value) as 0 | 1)}
                  className="w-full rounded-2xl bg-card px-3 py-2 text-sm outline-none"
                >
                  <option value={1}>Monday</option>
                  <option value={0}>Sunday</option>
                </select>
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Default calendar view
                </span>
                <select
                  value={defaultView}
                  onChange={(event) => setDefaultView(event.target.value as "month" | "week")}
                  className="w-full rounded-2xl bg-card px-3 py-2 text-sm outline-none"
                >
                  <option value="month">Month</option>
                  <option value="week">Week</option>
                </select>
              </label>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-bold">Account</h2>
              <p className="text-xs text-muted-foreground">Yu - yu@example.com</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-destructive/15 text-destructive text-sm font-medium hover:bg-destructive/25 transition-colors">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
