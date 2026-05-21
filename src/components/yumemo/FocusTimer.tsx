import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";

export function FocusTimer() {
  const TOTAL = 25 * 60;
  const [left, setLeft] = useState(TOTAL);
  const [running, setRunning] = useState(false);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    ref.current = window.setInterval(() => {
      setLeft((l) => (l <= 1 ? (setRunning(false), TOTAL) : l - 1));
    }, 1000);
    return () => {
      if (ref.current) window.clearInterval(ref.current);
    };
  }, [running]);

  const m = String(Math.floor(left / 60)).padStart(2, "0");
  const s = String(left % 60).padStart(2, "0");
  const progress = ((TOTAL - left) / TOTAL) * 100;

  return (
    <div className="glass-card rounded-3xl p-6 text-center relative overflow-hidden">
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-primary opacity-20 blur-3xl" />
      <p className="text-xs uppercase tracking-widest text-muted-foreground">Pomodoro focus</p>
      <h2 className="text-lg font-bold mt-1">Cozy study room</h2>

      <div className="relative my-6 grid place-items-center">
        <svg className="w-44 h-44 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" stroke="var(--color-muted)" strokeWidth="8" fill="none" />
          <motion.circle
            cx="50" cy="50" r="44"
            stroke="url(#g)" strokeWidth="8" fill="none" strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 44}
            strokeDashoffset={2 * Math.PI * 44 * (1 - progress / 100)}
            transition={{ duration: 0.5 }}
          />
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.82 0.12 350)" />
              <stop offset="100%" stopColor="oklch(0.82 0.12 295)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div>
            <p className="text-4xl font-bold tabular-nums">{m}:{s}</p>
            <p className="text-xs text-muted-foreground mt-1">until break ෆ</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setRunning((r) => !r)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-primary text-primary-foreground font-medium shadow-soft hover:scale-105 transition-transform"
        >
          {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {running ? "Pause" : "Start"}
        </button>
        <button
          onClick={() => { setRunning(false); setLeft(TOTAL); }}
          className="p-2.5 rounded-2xl bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}