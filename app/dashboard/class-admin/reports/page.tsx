"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FileText, Loader2, Send, Calendar, TrendingUp, Users, CreditCard,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api/client";
import { getClassStudents } from "@/lib/api/users";

const YEAR = new Date().getFullYear();

function getWeekNumber(d: Date): number {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return Math.ceil(((t.getTime() - y0.getTime()) / 86400000 + 1) / 7);
}

export default function ClassAdminReportsPage() {
  const { user, loading: authLoading } = useAuth(true);
  const [students, setStudents] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notes, setNotes] = useState("");

  const classId = user?.classId || "";

  async function load() {
    if (!classId) return;
    setLoading(true);
    try {
      const [s, r] = await Promise.all([
        getClassStudents(classId, YEAR),
        api.get<any[]>(`/api/reports/weekly/list?year=${YEAR}&classId=${classId}`),
      ]);
      setStudents(s.students || []);
      setReports(Array.isArray(r) ? r : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [classId]);

  async function submitReport() {
    if (!user?.id || !classId) return;
    setBusy(true);
    try {
      const week = getWeekNumber(new Date());
      const res = await api.post<any>("/api/reports/weekly/submit", {
        classId, year: YEAR, week, submittedBy: user.id, notes,
      });
      if (res.ok) {
        alert("✅ Hisobot yuborildi");
        setNotes("");
        await load();
      } else {
        alert(res.message || "Xatolik");
      }
    } finally {
      setBusy(false);
    }
  }

  if (authLoading || loading) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
    </div>
  );

  const total = students.length;
  const paid = students.filter((s) => s.paid).length;
  const botConnected = students.filter((s) => s.botStatus === "connected").length;
  const avg = total ? students.reduce((a, s) => a + (s.avg || 0), 0) / total : 0;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-950 flex items-center gap-3">
            <FileText className="w-8 h-8 text-amber-500" />
            Hisobotlar
          </h1>
          <p className="text-stone-500 mt-1">{classId} sinfi · {YEAR}-yil</p>
        </div>
      </motion.div>

      {/* Current stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-blue-600" />
            <p className="text-xs text-stone-500">O&apos;quvchilar</p>
          </div>
          <p className="text-3xl font-bold text-amber-950">{total}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="w-5 h-5 text-green-600" />
            <p className="text-xs text-stone-500">To&apos;langan</p>
          </div>
          <p className="text-3xl font-bold text-amber-950">{paid}/{total}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            <p className="text-xs text-stone-500">O&apos;rtacha</p>
          </div>
          <p className="text-3xl font-bold text-amber-950">{avg.toFixed(2)}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Send className="w-5 h-5 text-purple-600" />
            <p className="text-xs text-stone-500">Bot</p>
          </div>
          <p className="text-3xl font-bold text-amber-950">{botConnected}/{total}</p>
        </Card>
      </div>

      {/* Current week summary */}
      <Card>
        <h3 className="text-lg font-bold text-amber-950 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-600" />
          Joriy hafta ({getWeekNumber(new Date())}-hafta)
        </h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-stone-700">To&apos;lov holati</span>
              <span className="font-bold text-amber-700">{total ? ((paid / total) * 100).toFixed(0) : 0}%</span>
            </div>
            <Progress value={total ? (paid / total) * 100 : 0} color="green" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-stone-700">Bot ulanish</span>
              <span className="font-bold text-amber-700">{total ? ((botConnected / total) * 100).toFixed(0) : 0}%</span>
            </div>
            <Progress value={total ? (botConnected / total) * 100 : 0} color="amber" />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-semibold text-stone-700 mb-2">
            Izoh (ixtiyoriy)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="input-field resize-none"
            placeholder="Hisobotga izoh..."
          />
        </div>

        <Button onClick={submitReport} disabled={busy} className="w-full mt-4">
          {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Yuborilmoqda...</> : <><Send className="w-4 h-4" /> Hisobotni yuborish</>}
        </Button>
      </Card>

      {/* Past reports */}
      <Card>
        <h3 className="text-lg font-bold text-amber-950 mb-4">Oxirgi hisobotlar</h3>
        {reports.length === 0 ? (
          <p className="text-sm text-stone-400 text-center py-8">
            Hozircha hisobotlar yuborilmagan
          </p>
        ) : (
          <div className="space-y-2">
            {reports.slice(0, 10).map((r: any) => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-2xl bg-stone-50">
                <div>
                  <p className="font-semibold text-sm text-amber-950">
                    {r.week}-hafta · {r.year}
                  </p>
                  <p className="text-xs text-stone-500">
                    {r.stats?.paid || 0}/{r.stats?.total || 0} to&apos;langan
                  </p>
                </div>
                <Badge variant={r.status === "submitted" ? "success" : "warning"}>
                  {r.status === "submitted" ? "Yuborilgan" : r.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}