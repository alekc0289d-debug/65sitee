"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: number;
  color?: "amber" | "green" | "blue" | "red" | "orange";
  delay?: number;
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  color = "amber",
  delay = 0,
}: StatCardProps) {
  const colors = {
    amber: "from-amber-100 to-amber-50 text-amber-700",
    green: "from-green-100 to-green-50 text-green-700",
    blue: "from-blue-100 to-blue-50 text-blue-700",
    red: "from-red-100 to-red-50 text-red-700",
    orange: "from-orange-100 to-orange-50 text-orange-700",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Card>
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colors[color]} flex items-center justify-center`}>
            {icon}
          </div>
          {trend !== undefined && (
            <div
              className={`flex items-center gap-1 text-sm font-semibold ${
                trend >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {trend >= 0 ? "+" : ""}
              {trend}%
            </div>
          )}
        </div>
        <p className="text-sm text-stone-500 mb-1">{label}</p>
        <p className="text-3xl font-bold text-amber-950">{value}</p>
      </Card>
    </motion.div>
  );
}