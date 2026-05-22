import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { timerPresets, useFocusTimerStore, useTasksStore } from "@/stores/yumemo";

function phaseLabel(phase: "work" | "short-break" | "long-break") {
  if (phase === "short-break") return "Short break";
  if (phase === "long-break") return "Long break";
  return "Focus";
}

function playSoftAlert() {
  if (typeof window === "undefined") return;
  const AudioContextClass =
    window.AudioContext ||
    (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioContextClass) return;
  const audio = new AudioContextClass();
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = 740;
  gain.gain.value = 0.04;
  oscillator.connect(gain);
  gain.connect(audio.destination);
  oscillator.start();
  oscillator.stop(audio.currentTime + 0.18);
}

export function FocusTimer() {
  const tasks = useTasksStore((state) => state.tasks);
  const mode = useFocusTimerStore((state) => state.mode);
  const phase = useFocusTimerStore((state) => state.phase);
  const running = useFocusTimerStore((state) => state.running);
  const secondsLeft = useFocusTimerStore((state) => state.secondsLeft);
  const selectedTaskId = useFocusTimerStore((state) => state.selectedTaskId);
  const customWorkMinutes = useFocusTimerStore((state) => state.customWorkMinutes);
  const alertMessage = useFocusTimerStore((state) => state.alertMessage);
  const completedCycles = useFocusTimerStore((state) => state.completedCycles);
  const setMode = useFocusTimerStore((state) => state.setMode);
  const setSelectedTask = useFocusTimerStore((state) => state.setSelectedTask);
  const setCustomWorkMinutes = useFocusTimerStore((state) => state.setCustomWorkMinutes);
  const start = useFocusTimerStore((state) => state.start);
  const pause = useFocusTimerStore((state) => state.pause);
  const reset = useFocusTimerStore((state) => state.reset);
  const tick = useFocusTimerStore((state) => state.tick);
  const clearAlert = useFocusTimerStore((state) => state.clearAlert);
  const lastAlert = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [running, tick]);

  useEffect(() => {
    if (alertMessage && alertMessage !== lastAlert.current) {
      lastAlert.current = alertMessage;
      playSoftAlert();
    }
  }, [alertMessage]);

  const activePreset = useMemo(
    () => timerPresets.find((preset) => preset.mode === mode) ?? timerPresets[0],
    [mode],
  );
  const totalSeconds = useMemo(() => {
    if (phase === "work")
      return (mode === "custom" ? customWorkMinutes : activePreset.workMinutes) * 60;
    return (
      (phase === "short-break" ? activePreset.shortBreakMinutes : activePreset.longBreakMinutes) *
      60
    );
  }, [activePreset, customWorkMinutes, mode, phase]);
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;
  const activeTasks = tasks.filter((task) => task.status !== "completed");

  return (
    <div className="glass-card rounded-3xl p-6 text-center relative overflow-hidden">
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-primary opacity-20 blur-3xl" />
      <div className="relative">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          {activePreset.label}
        </p>
        <h2 className="text-lg font-bold mt-1">{phaseLabel(phase)} room</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
          {timerPresets.map((preset) => (
            <button
              key={preset.mode}
              onClick={() => setMode(preset.mode)}
              className={`rounded-2xl px-3 py-2 text-xs font-bold transition-colors ${
                preset.mode === mode
                  ? "bg-gradient-primary text-primary-foreground shadow-soft"
                  : "bg-muted/70 text-muted-foreground"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <label className="mt-4 block text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Linked task
          </span>
          <select
            value={selectedTaskId ?? ""}
            onChange={(event) => setSelectedTask(event.target.value || undefined)}
            className="mt-1 w-full rounded-2xl bg-muted/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">No linked task</option>
            {activeTasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title}
              </option>
            ))}
          </select>
        </label>

        {mode === "custom" && (
          <label className="mt-3 block text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Custom minutes
            </span>
            <input
              type="number"
              min="5"
              max="180"
              value={customWorkMinutes}
              onChange={(event) => setCustomWorkMinutes(Number(event.target.value))}
              className="mt-1 w-full rounded-2xl bg-muted/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        )}

        <div className="relative my-6 grid place-items-center">
          <svg className="w-44 h-44 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="var(--color-muted)"
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="44"
              stroke="url(#timerGradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 44}
              strokeDashoffset={2 * Math.PI * 44 * (1 - progress / 100)}
              transition={{ duration: 0.5 }}
            />
            <defs>
              <linearGradient id="timerGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="var(--secondary)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div>
              <p className="text-4xl font-bold tabular-nums">
                {minutes}:{seconds}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {phase === "work" ? "until break" : "until focus"} - cycle {completedCycles + 1}
              </p>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {alertMessage && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-4 rounded-2xl bg-primary/15 px-4 py-3 text-sm font-medium text-primary"
            >
              <button type="button" onClick={clearAlert} className="w-full">
                {alertMessage}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={running ? pause : start}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-primary text-primary-foreground font-medium shadow-soft hover:scale-105 transition-transform"
          >
            {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {running ? "Pause" : "Start"}
          </button>
          <button
            onClick={reset}
            className="p-2.5 rounded-2xl bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
