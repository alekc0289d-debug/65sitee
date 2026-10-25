"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface ProgressProps {
  value: number;
  max?: number;
  color?: "amber" | "green" | "red" | "blue";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function Progress({
  value,
  max = 100,
  color = "amber",
  size = "md",
  showLabel = false,
  className,
}: ProgressProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  const colors = {
    amber: "from-amber-400 to-amber-600",
    green: "from-green-400 to-green-600",
    red: "from-red-400 to-red-600",
    blue: "from-blue-400 to-blue-600",
  };

  const sizes = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between text-xs font-medium mb-1.5">
          <span className="text-stone-600">{value}</span>
          <span className="text-stone-400">{max}</span>
        </div>
      )}
      <div className={cn("w-full bg-stone-100 rounded-full overflow-hidden", sizes[size])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn("h-full rounded-full bg-gradient-to-r", colors[color])}
        />
      </div>
    </div>
  );
}