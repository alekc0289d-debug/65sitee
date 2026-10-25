"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users, CheckCircle, XCircle, CreditCard, Send, FileText,
  Loader2, AlertCircle, TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/dashboard/StatCard";
import { Progress } from "@/components/ui/Progress";
import { getClassReport, markPaid, submitMoney, submitWeeklyReport } from "@/lib/api/payments";
import { getWeekNumber } from "@/lib/utils/format";
import type { ClassReport, StudentDetail } from "@/types";

const CLASS_ID = "9-A";
const YEAR = new Date().getFullYear();

export default function ClassAdminDashboard() {
  const [report, setReport] = useState<ClassReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await getClassReport(CLASS_ID, YEAR);
      setReport(data);
    } catch {
      setError("Ma'lumot yuklanmadi");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function togglePaid(s: StudentDetail) {
    setBusy(true);
    try {
      await markPaid(s.studentId, YEAR, "admin_demo");
      await load();
    } catch {
      alert("Xatolik");
    } finally {
      setBusy(false);
    }
  }

  async function handleSubmitMoney() {
    if (!confirm("Haftada yig'ilgan pulni topshirishni tasdiqlaysizmi?")) return;
    setBusy(true);
    try {
      const r = await submitMoney(CLASS_ID, YEAR, getWeekNumber(new Date()), "admin_demo");
      if (r.ok) {
        alert(`✅ ${r.totalAmount?.toLocaleString()} so'm topshirildi (${r.studentCount} o'quvchi)`);
        await load();
      } else {
        alert(r.message || "Topshirish amalga oshmadi");
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleSubmitReport() {
    if (!confirm("Haftalik hisobotni superadminga yuborishni tasdiqlaysizmi?")) return;
    setBusy(true);
    try {
      await submitWeeklyReport(CLASS_ID, YEAR, getWeekNumber(new Date()), "admin_demo");
      alert("✅ Hisobot yuborildi");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <Card>
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-stone-600">{error}</p>
          <Button onClick={load} className="mt-4">Qayta yuklash</Button>
        </div>
      </Card>
    );
  }

  const paidPercent = report.total > 0 ? (report.paid / report.total) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-amber-950">
            {CLASS_ID} sinfi
          </h1>
          <p className="text-stone-500 mt-1">
            {YEAR}-yil · {report.total} ta o'quvchi
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={handleSubmitReport}
            variant="secondary"
            disabled={busy}
            size="sm"
          >
            <FileText className="w-4 h-4" />
            Haftalik hisobot
          </Button>
          <Button onClick={handleSubmitMoney} disabled={busy} size="sm">
            <Send className="w-4 h-4" />
            Pul topshirish
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Jami"
          value={report.total}
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          label="Ulangan"
          value={`${report.connected}/${report.total}`}
          icon={<CheckCircle className="w-6 h-6" />}
          color="green"
          trend={report.connected > 0 ? 10 : 0}
        />
        <StatCard
          label="To'langan"
          value={`${report.paid}/${report.total}`}
          icon={<CreditCard className="w-6 h-6" />}
          color="amber"
        />
        <StatCard
          label="Yig'ilgan"
          value={`${(report.collectedAmount / 1000).toFixed(0)}k`}
          icon={<TrendingUp className="w-6 h-6" />}
          color="orange"
        />
      </div>

      {/* Progress */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-amber-950">To'lov holati</h3>
          <Badge variant="amber">
            {paidPercent.toFixed(0)}%
          </Badge>
        </div>
        <Progress value={paidPercent} color="amber" size="lg" />
        <div className="grid grid-cols-3 gap-4 mt-4 text-center">
          <div>
            <p className="text-2xl font-bold text-amber-700">{report.paid}</p>
            <p className="text-xs text-stone-500">To'langan</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">{report.unpaid}</p>
            <p className="text-xs text-stone-500">To'lanmagan</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-950">
              {(report.expectedAmount / 1000).toFixed(0)}k
            </p>
            <p className="text-xs text-stone-500">Kutilmoqda</p>
          </div>
        </div>
      </Card>

      {/* Student list */}
      <Card className="!p-0 overflow-hidden">
        <div className="p-6 border-b border-amber-100">
          <h3 className="font-bold text-amber-950 text-lg">O'quvchilar</h3>
          <p className="text-sm text-stone-500 mt-1">
            To'lov holatini belgilash uchun tugmani bosing
          </p>
        </div>
        <div className="divide-y divide-amber-50">
          {report.detail.map((s, i) => (
            <motion.div
              key={s.studentId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
              className="p-4 flex items-center gap-4 hover:bg-amber-50/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {s.fullName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-amber-950 truncate">
                  {s.fullName}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <Badge variant={s.registered ? "success" : "neutral"} size="sm">
                    {s.registered ? "✓" : "○"} Ro'yxat
                  </Badge>
                  <Badge variant={s.connected ? "success" : "neutral"} size="sm">
                    {s.connected ? "✓" : "○"} Ulangan
                  </Badge>
                  <Badge variant={s.paid ? "success" : "warning"} size="sm">
                    {s.paid ? "✓" : "○"} To'lov
                  </Badge>
                </div>
              </div>
              <Button
                size="sm"
                variant={s.paid ? "secondary" : "primary"}
                onClick={() => togglePaid(s)}
                disabled={busy}
                className="flex-shrink-0"
              >
                {s.paid ? (
                  <>
                    <XCircle className="w-4 h-4" />
                    Bekor
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    To'landi
                  </>
                )}
              </Button>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}