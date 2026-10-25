"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Loader2, AlertCircle, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api/client";

const PAGE_SIZE = 30;

export default function StudentGradesPage() {
  const { user, loading: authLoading } = useAuth(true);
  const [grades, setGrades] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function loadInitial() {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [first, dash] = await Promise.all([
        api.get<any>(`/api/students/${user.id}/grades?limit=${PAGE_SIZE}&offset=0`),
        api.get<any>(`/api/dashboard/student/${user.id}`),
      ]);
      setGrades(first.grades || []);
      setHasMore(first.hasMore);
      setOffset(PAGE_SIZE);
      setSubjects(dash.subjects || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Xatolik");
    } finally {
      setLoading(false);
    }
  }

  async function loadMore() {
    if (!user?.id || !hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await api.get<any>(
        `/api/students/${user.id}/grades?limit=${PAGE_SIZE}&offset=${offset}`
      );
      setGrades((g) => [...g, ...(res.grades || [])]);
      setHasMore(res.hasMore);
      setOffset(offset + PAGE_SIZE);
    } finally {
      setLoadingMore(false);
    }
  }

  useEffect(() => { loadInitial(); /* eslint-disable-next-line */ }, [user?.id]);

  if (authLoading || loading) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
    </div>
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-amber-950">Baholarim</h1>
        <p className="text-stone-500 mt-1">Jami: {grades.length} ta yuklangan</p>
      </motion.div>

      {error && (
        <Card>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </Card>
      )}

      {subjects.length > 0 && (
        <Card>
          <h3 className="text-xl font-bold text-amber-950 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            Fan bo&apos;yicha
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {subjects.map((s: any, i: number) => (
              <div key={s.name}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-stone-700">{s.name}</span>
                  <span className="font-bold text-amber-700">{s.avg} ({s.count})</span>
                </div>
                <Progress value={(s.avg / 5) * 100} color={s.avg >= 4.5 ? "green" : s.avg >= 3.5 ? "amber" : "red"} />
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <h3 className="text-lg font-bold text-amber-950 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-600" />
          Oxirgi baholar
        </h3>

        {grades.length === 0 ? (
          <p className="text-sm text-stone-400 py-4 text-center">Baholar yo&apos;q</p>
        ) : (
          <div className="space-y-2">
            {grades.map((g, i) => (
              <motion.div
                key={g.id || i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.5) }}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-amber-50/50"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white ${
                    g.score === 5 ? "bg-green-500" : g.score === 4 ? "bg-amber-500" : "bg-red-500"
                  }`}>
                    {g.score ?? "—"}
                  </div>
                  <div>
                    <p className="font-semibold text-amber-950 text-sm">{g.subject}</p>
                    <p className="text-xs text-stone-500">{g.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {hasMore && (
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="btn-secondary w-full mt-4"
          >
            {loadingMore ? (
              <><Loader2 className="w-4 h-4 inline animate-spin mr-2" /> Yuklanmoqda...</>
            ) : (
              "Yana 30 ta yuklash"
            )}
          </button>
        )}

        {!hasMore && grades.length > 0 && (
          <p className="text-center text-sm text-stone-400 mt-4 py-2">
            ✅ Barcha baholar yuklandi
          </p>
        )}
      </Card>
    </div>
  );
}