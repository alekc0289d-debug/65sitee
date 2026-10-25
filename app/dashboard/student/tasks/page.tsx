"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckSquare, Loader2, Lock, Check, Sparkles, Gift } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api/client";

interface Task {
  taskId: string; order: number; title: string; desc: string;
  reward: number; type: string; status: "locked" | "available" | "done";
  completedAt?: string;
}

export default function StudentTasksPage() {
  const { user, loading: authLoading } = useAuth(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    Promise.all([
      api.get<Task[]>(`/api/tasks/user/${user.id}`),
      api.get<{ total: number }>(`/api/tasks/user/${user.id}/score`),
    ])
      .then(([t, s]) => {
        setTasks(Array.isArray(t) ? t : []);
        setScore(s?.total || 0);
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (authLoading || loading) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
    </div>
  );

  const done = tasks.filter((t) => t.status === "done").length;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-950 flex items-center gap-3">
            <CheckSquare className="w-8 h-8 text-amber-500" />
            Topshiriqlar
          </h1>
          <p className="text-stone-500 mt-1">{done} / {tasks.length} bajarildi</p>
        </div>
        <Card className="!p-4 bg-gradient-to-br from-amber-100 to-orange-100 !border-amber-200">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-amber-700" />
            <div>
              <p className="text-xs text-amber-700">Umumiy ball</p>
              <p className="text-2xl font-bold text-amber-950">{score}</p>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="space-y-3">
        {tasks.map((t, i) => (
          <motion.div key={t.taskId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className={
              t.status === "done" ? "!border-green-200 bg-green-50/30" :
              t.status === "available" ? "!border-amber-300" : "opacity-60"
            }>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white flex-shrink-0 ${
                  t.status === "done" ? "bg-green-500" :
                  t.status === "available" ? "bg-amber-500" : "bg-stone-300"
                }`}>
                  {t.status === "done" ? <Check className="w-6 h-6" /> : 
                   t.status === "locked" ? <Lock className="w-5 h-5" /> : t.order}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-amber-950">{t.title}</h3>
                    {t.status === "done" && <Badge variant="success" size="sm">Bajarildi</Badge>}
                    {t.status === "available" && <Badge variant="amber" size="sm">Faol</Badge>}
                  </div>
                  <p className="text-sm text-stone-600">{t.desc}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Gift className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-semibold text-amber-700">+{t.reward} ball</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}