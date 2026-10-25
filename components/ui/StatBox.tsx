"use client";

import { motion } from "framer-motion";
import { Card } from "./Card";

interface StatBoxProps {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  color?: "amber" | "green" | "blue" | "red" | "orange";
}

export function StatBox({ label, value, icon, color = "amber" }: StatBoxProps) {
  const colors = {
    amber: "from-amber-100 to-amber-50 text-amber-700",
    green: "from-green-100 to-green-50 text-green-700",
    blue: "from-blue-100 to-blue-50 text-blue-700",
    red: "from-red-100 to-red-50 text-red-700",
    orange: "from-orange-100 to-orange-50 text-orange-700",
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        {icon && (
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colors[color]} flex items-center justify-center mb-4`}>
            {icon}
          </div>
        )}
        <p className="text-sm text-stone-500 mb-1">{label}</p>
        <p className="text-3xl font-bold text-amber-950">{value}</p>
      </Card>
    </motion.div>
  );
}