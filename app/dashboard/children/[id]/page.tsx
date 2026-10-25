"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, TrendingUp, Calendar, Award, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { getStudentDetail } from "@/lib/api/users";

export default function ChildDetailPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getStudentDetail(params.id)
      .then((res) => {
        if (!res.ok) throw new Error("Topilmadi");
        setData(res.student);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Xatolik"))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
    </div>
  );

  if (error || !data) return (
    <Card>
      <div className="text-center py-16">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p className="text-stone-600">{error}</p>
      </div>
    </Card>
  );

  const scores = data.recentGrades.map((g: any) => g.score).filter((s: number | null) => s !== null);
  const avg = scores.length ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0;

  return (
    <div className="space-y-6">
      <Link href="/dashboard/parent/children" className="inline-flex items-center gap-2 text-stone-600 hover:text-amber-700 font-medium transition-colors">
        <ArrowLeft className="w-4 h-4" /> Orqaga
      </Link>

      <Card>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-amber-500/30">
            {data.fullName[0]}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-amber-950">{data.fullName}</h1>
            <p className="text-stone-500 mt-1">{data.classId} sinf</p>
            <div className="flex gap-2 mt-3">
              <Badge variant="success">Faol</Badge>
              <Badge variant="amber">{data.gradesCount} ta baho</Badge>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><div className="text-sm text-stone-500">O&apos;rtacha</div>
          <div className="text-3xl font-bold text-amber-950 mt-1">{avg.toFixed(2)}</div></Card>
        <Card><div className="text-sm text-stone-500">Baholar</div>
          <div className="text-3xl font-bold text-amber-950 mt-1">{data.gradesCount}</div></Card>
        <Card><div className="text-sm text-stone-500">Fanlar</div>
          <div className="text-3xl font-bold text-amber-950 mt-1">{data.subjects.length}</div></Card>
        <Card><div className="text-sm text-stone-500">Telefon</div>
          <div className="text-sm font-bold text-amber-950 mt-1 truncate">{data.phone || "—"}</div></Card>
      </div>

      {data.subjects.length > 0 && (
        <Card>
          <h3 className="text-lg font-bold text-amber-950 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            Fan bo&apos;yicha
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {data.subjects.map((s: any, i: number) => (
              <motion.div key={s.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-stone-700">{s.name}</span>
                  <span className="font-bold text-amber-700">{s.avg} ({s.count})</span>
                </div>
                <Progress value={(s.avg / 5) * 100} color={s.avg >= 4.5 ? "green" : s.avg >= 3.5 ? "amber" : "red"} />
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <h3 className="text-lg font-bold text-amber-950 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-600" />
          Oxirgi baholar
        </h3>
        <div className="space-y-2">
          {data.recentGrades.slice(0, 15).map((g: any, i: number) => (
            <motion.div key={g.id || i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-amber-50/50">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
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
      </Card>
    </div>
  );
}