import { motion } from "framer-motion";
import mascot from "@/assets/mascot.png";

const quotes = [
  "you're doing great, take a breath~",
  "small steps still finish big books ෆ",
  "study warm, study soft",
];

export function MascotCard() {
  const q = quotes[new Date().getDay() % quotes.length];
  return (
    <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-primary opacity-10" />
      <div className="relative flex items-center gap-4">
        <motion.img
          src={mascot}
          alt="YuMemo cat mascot"
          width={96}
          height={96}
          className="w-24 h-24 drop-shadow-xl animate-float"
        />
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Yu says</p>
          <p className="text-base font-semibold mt-1 leading-snug">"{q}"</p>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "60%" }}
            transition={{ duration: 1.2 }}
            className="h-1 rounded-full bg-gradient-primary mt-3"
          />
          <p className="text-[11px] text-muted-foreground mt-2">level 4 · 240 / 500 xp</p>
        </div>
      </div>
    </div>
  );
}