"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Loader2, GraduationCap, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api/client";
import Link from "next/link";

interface ClassStat { classId: string; students: number; avg: number; }

export default function TeacherClassesPage() {
  const { user, loading: authLoading } = useAuth(true);
  const [classes, setClasses] = useState<ClassStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    api.get<any>(`/api/dashboard/teacher/${user.id}`)
      .then((res) => setClasses(res.classes || []))
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (authLoading || loading) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
    </div>
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-amber-950 flex items-center gap-3">
          <Users className="w-8 h-8 text-amber-500" />
          Sinflarim
        </h1>
        <p className="text-stone-500 mt-1">{classes.length} ta sinf</p>
      </motion.div>

      {classes.length === 0 ? (
        <Card>
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-amber-300 mx-auto mb-4" />
            <p className="text-stone-500">Sizga biriktirilgan sinflar yo&apos;q</p>
          </div>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((c, i) => (
            <motion.div key={c.classId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card hover>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-xl">
                    {c.classId}
                  </div>
                  <Badge variant="amber">{c.avg}</Badge>
                </div>
                <h3 className="font-bold text-amber-950 mb-1">{c.classId} sinfi</h3>
                <p className="text-xs text-stone-500 mb-4">{c.students} o&apos;quvchi</p>

                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-stone-600">O&apos;rtacha</span>
                    <span className="font-bold text-amber-700">{c.avg}/5</span>
                  </div>
                  <Progress
                    value={(c.avg / 5) * 100}
                    color={c.avg >= 4.5 ? "green" : c.avg >= 3.5 ? "amber" : "red"}
                  />
                </div>

                <Link href={`/dashboard/teacher/classes/${c.classId}`} className="btn-secondary w-full text-center block !py-2.5 text-sm">
                  Batafsil
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}