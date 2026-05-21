import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Bell, Mail, Smartphone, Palette, LogOut } from "lucide-react";
import { AppLayout } from "@/components/yumemo/AppLayout";
import mascot from "@/assets/mascot.png";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [
      { title: "Settings · YuMemo" },
      { name: "description", content: "Personalize your YuMemo — themes, mascot, notifications, and calendar." },
    ],
  }),
});

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`w-12 h-7 rounded-full p-1 transition-colors ${on ? "bg-gradient-primary" : "bg-muted"}`}
    >
      <motion.div
        layout
        className={`w-5 h-5 rounded-full bg-card shadow-soft ${on ? "ml-auto" : ""}`}
      />
    </button>
  );
}

const themes = [
  { name: "Sakura", colors: ["oklch(0.86 0.10 350)", "oklch(0.82 0.09 295)", "oklch(0.86 0.09 200)"] },
  { name: "Mint latte", colors: ["oklch(0.86 0.09 165)", "oklch(0.88 0.08 50)", "oklch(0.86 0.10 350)"] },
  { name: "Lavender", colors: ["oklch(0.82 0.09 295)", "oklch(0.86 0.09 200)", "oklch(0.86 0.10 350)"] },
  { name: "Sunset", colors: ["oklch(0.88 0.08 50)", "oklch(0.86 0.10 350)", "oklch(0.82 0.09 295)"] },
];

function SettingsPage() {
  const [dark, setDark] = useState(false);
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(true);
  const [sms, setSms] = useState(false);
  const [theme, setTheme] = useState(0);

  return (
    <AppLayout title="Settings" subtitle="Make YuMemo yours">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-6 text-center"
        >
          <img src={mascot} alt="Yu mascot" width={120} height={120} className="w-28 h-28 mx-auto animate-float" />
          <h2 className="text-xl font-bold mt-3">Yu</h2>
          <p className="text-xs text-muted-foreground">Cat · Level 4</p>
          <div className="grid grid-cols-3 gap-2 mt-5">
            {["🎀", "👓", "🧣"].map((a) => (
              <button key={a} className="aspect-square rounded-2xl bg-muted hover:bg-gradient-primary text-2xl transition-colors">
                {a}
              </button>
            ))}
          </div>
          <button className="mt-4 text-xs text-muted-foreground hover:text-foreground">Browse accessories →</button>
        </motion.div>

        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-4 h-4 text-primary" />
              <h2 className="font-bold">Theme</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {themes.map((t, i) => (
                <button
                  key={t.name}
                  onClick={() => setTheme(i)}
                  className={`p-4 rounded-2xl text-left transition-all ${theme === i ? "ring-2 ring-primary bg-card shadow-soft" : "bg-card/60 hover:bg-card"}`}
                >
                  <div className="flex -space-x-2 mb-2">
                    {t.colors.map((c, j) => (
                      <span key={j} className="w-6 h-6 rounded-full border-2 border-card" style={{ background: c }} />
                    ))}
                  </div>
                  <p className="text-sm font-medium">{t.name}</p>
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
              {[
                { icon: Bell, label: "Push notifications", desc: "On your phone & browser", v: push, set: setPush },
                { icon: Mail, label: "Email reminders", desc: "Gentle nudges before deadlines", v: email, set: setEmail },
                { icon: Smartphone, label: "SMS reminders", desc: "For critical deadlines only", v: sms, set: setSms },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between p-3 rounded-2xl bg-muted/60">
                  <div className="flex items-center gap-3">
                    <row.icon className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{row.label}</p>
                      <p className="text-xs text-muted-foreground">{row.desc}</p>
                    </div>
                  </div>
                  <Toggle on={row.v} onChange={row.set} />
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 flex items-center justify-between">
            <div>
              <h2 className="font-bold">Sign out</h2>
              <p className="text-xs text-muted-foreground">See you soon ෆ</p>
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