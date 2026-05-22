import { motion } from "framer-motion";
import mascot from "@/assets/mascot.png";
import { useMascotStore, useXpStore } from "@/stores/yumemo";

const quotes = {
  idle: "You're doing great. Take a breath.",
  happy: "That task sparkle looked lovely.",
  sleepy: "Tiny rest counts too.",
  excited: "A milestone! I am cheering very loudly inside.",
  studying: "Focus mode on. I will keep watch.",
};

const accessoryLabel = {
  ribbon: "Ribbon",
  glasses: "Glasses",
  scarf: "Scarf",
  none: "No accessory",
};

export function MascotCard() {
  const mascotState = useMascotStore((state) => state.state);
  const accessory = useMascotStore((state) => state.accessory);
  const level = useXpStore((state) => state.level);
  const xp = useXpStore((state) => state.xpIntoLevel());
  const xpForNextLevel = useXpStore((state) => state.xpForNextLevel());
  const q = quotes[mascotState];

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
            animate={{ width: `${Math.min(100, (xp / xpForNextLevel) * 100)}%` }}
            transition={{ duration: 1.2 }}
            className="h-1 rounded-full bg-gradient-primary mt-3"
          />
          <p className="text-[11px] text-muted-foreground mt-2">
            level {level} - {xp} / {xpForNextLevel} xp - {accessoryLabel[accessory]}
          </p>
        </div>
      </div>
    </div>
  );
}
