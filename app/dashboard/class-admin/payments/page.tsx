"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard, Loader2, Check, X, Send, TrendingUp, AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api/client";
import { getClassStudents, type ClassStudent } from "@/lib/api/users";

const YEAR = new Date().getFullYear();

export default function ClassAdminPaymentsPage() {
  const { user, loading: authLoading } = useAuth(true);
  const [students, setStudents] = useState<ClassStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const classId = user?.classId || "";

  async function load() {
    if (!classId) return;
    setLoading(true);
    try {
      const res = await getClassStudents(classId, YEAR);
      setStudents(res.students || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [classId]);

  async function togglePaid(s: ClassStudent) {
    if (!user?.id) return;
    setBusy(true);
    try {
      const url = s.paid
        ? "/api/payments/mark-paid/undo"
        : "/api/payments/mark-paid";
      const res = await api.post<any>(url, {
        studentId: s.studentId, year: YEAR,
        collectedBy: user.id, notes: "",
      });
      if (!res.ok) {
        alert(res.message || "Xatolik");
        return;
      }
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function submitMoney() {
    if (!user?.id || !classId) return;
    if (!confirm("Haftalik yig'ilgan pulni topshirishni tasdiqlaysizmi?")) return;
    setBusy(true);
    try {
      const week = getWeekNumber(new Date());
      const res = await api.post<any>("/api/payments/submit-money", {
        classId, year: YEAR, week, submittedBy: user.id,
      });
      if (res.ok) {
        alert(`✅ ${res.totalAmount?.toLocaleString()} so'm topshirildi`);
        await load();
      } else {
        alert(res.message || "Topshirish amalga oshmadi");
      }
    } finally {
      setBusy(false);
    }
  }

  function getWeekNumber(d: Date): number {
    const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
    const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
    return Math.ceil(((t.getTime() - y0.getTime()) / 86400000 + 1) / 7);
  }

  if (authLoading || loading) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
    </div>
  );

  const paid = students.filter((s) => s.paid).length;
  const total = students.length;
  const percent = total ? (paid / total) * 100 : 0;
  const collected = paid * 5000;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-950 flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-amber-500" />
            To&apos;lovlar
          </h1>
          <p className="text-stone-500 mt-1">{classId} sinfi · {YEAR}-yil</p>
        </div>
        <Button onClick={submitMoney} disabled={busy || paid === 0}>
          <Send className="w-4 h-4" />
          Pul topshirish
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><div className="text-sm text-stone-500">Jami</div>
          <div className="text-3xl font-bold text-amber-950 mt-1">{total}</div></Card>
        <Card><div className="text-sm text-stone-500">To&apos;langan</div>
          <div className="text-3xl font-bold text-green-600 mt-1">{paid}</div></Card>
        <Card><div className="text-sm text-stone-500">To&apos;lanmagan</div>
          <div className="text-3xl font-bold text-red-600 mt-1">{total - paid}</div></Card>
        <Card><div className="text-sm text-stone-500">Yig&apos;ilgan</div>
          <div className="text-3xl font-bold text-amber-700 mt-1">
            {(collected / 1000).toFixed(0)}k
          </div></Card>
      </div>

      {/* Progress */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-amber-950">To&apos;lov holati</h3>
          <Badge variant="amber">{percent.toFixed(0)}%</Badge>
        </div>
        <Progress value={percent} color="amber" size="lg" />
      </Card>

      {/* Students list */}
      <Card className="!p-0 overflow-hidden">
        <div className="p-5 border-b border-amber-100">
          <h3 className="font-bold text-amber-950">O&apos;quvchilar</h3>
          <p className="text-xs text-stone-500 mt-1">
            To&apos;lov belgilash uchun tugmani bosing (5 000 so&apos;m/yil)
          </p>
        </div>
        <div className="divide-y divide-amber-50">
          {students.map((s, i) => (
            <motion.div key={s.studentId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
              className="p-4 flex items-center gap-4 hover:bg-amber-50/30">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {s.fullName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-amber-950 truncate text-sm">{s.fullName}</p>
                <p className="text-xs text-stone-500">{s.phone}</p>
              </div>
              <Badge variant={s.paid ? "success" : "warning"}>
                {s.paid ? "✓ To'langan" : "○ To'lanmagan"}
              </Badge>
              <Button size="sm" variant={s.paid ? "secondary" : "primary"}
                onClick={() => togglePaid(s)} disabled={busy}>
                {s.paid ? <><X className="w-3.5 h-3.5" /> Bekor</> : <><Check className="w-3.5 h-3.5" /> To'landi</>}
              </Button>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}