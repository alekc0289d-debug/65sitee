"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Loader2, Info } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api/client";

export default function TeacherGradesPage() {
  const { user, loading: authLoading } = useAuth(true);
  const [classes, setClasses] = useState<any[]>([]);
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
          <BookOpen className="w-8 h-8 text-amber-500" />
          Baholash
        </h1>
        <p className="text-stone-500 mt-1">Baholar emaktab orqali avtomatik yuklanadi</p>
      </motion.div>

      <Card className="!border-blue-200 bg-blue-50/30">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-900 text-sm">
              Baholar avtomatik sinxronlanadi
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Barcha baholar emaktab.uz dan har soatda avtomatik yuklanadi.
              Baholarni qo&apos;lda kiritish shart emas.
            </p>
          </div>
        </div>
      </Card>

      {classes.length === 0 ? (
        <Card>
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-amber-300 mx-auto mb-4" />
            <p className="text-stone-500">Sinflar topilmadi</p>
          </div>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {classes.map((c, i) => (
            <motion.div key={c.classId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-amber-950 text-lg">{c.classId}</h3>
                    <p className="text-xs text-stone-500">{c.students} o&apos;quvchi</p>
                  </div>
                  <Badge variant="amber">{c.avg}</Badge>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}