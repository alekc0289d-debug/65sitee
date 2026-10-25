"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Loader2, Download, TrendingUp, Users, Award, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api/client";

export default function SuperAdminReportsPage() {
  const { user, loading: authLoading } = useAuth(true);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    api.get<any>("/api/dashboard/bosh-admin")
      .then((res) => setStats(res.stats))
      .finally(() => setLoading(false));
  }, [user?.id]);

  async function downloadReport() {
    setBusy(true);
    try {
      const users = await api.get<any>("/api/debug/users");
      const rows = [
        ["ID", "Ism", "Rol", "Telefon"],
        ...(users.users || []).map((u: any) => [u.id, u.fullName, u.role, u.phone]),
      ];
      const csv = rows.map((r) => r.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users-report-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  }

  if (authLoading || loading) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
    </div>
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-950 flex items-center gap-3">
            <FileText className="w-8 h-8 text-amber-500" />
            Hisobotlar
          </h1>
          <p className="text-stone-500 mt-1">Tizim bo&apos;yicha hisobotlar</p>
        </div>
        <Button onClick={downloadReport} disabled={busy}>
          <Download className="w-4 h-4" /> CSV yuklab olish
        </Button>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <Users className="w-6 h-6 text-blue-600 mb-3" />
          <p className="text-sm text-stone-500 mb-1">Foydalanuvchilar</p>
          <p className="text-3xl font-bold text-amber-950">{stats?.users || 0}</p>
        </Card>
        <Card>
          <Award className="w-6 h-6 text-amber-600 mb-3" />
          <p className="text-sm text-stone-500 mb-1">O&apos;quvchilar</p>
          <p className="text-3xl font-bold text-amber-950">{stats?.students || 0}</p>
        </Card>
        <Card>
          <DollarSign className="w-6 h-6 text-green-600 mb-3" />
          <p className="text-sm text-stone-500 mb-1">Oylik daromad</p>
          <p className="text-3xl font-bold text-amber-950">
            {(stats?.monthlyIncome / 1000 || 0).toFixed(0)}k
          </p>
        </Card>
        <Card>
          <TrendingUp className="w-6 h-6 text-orange-600 mb-3" />
          <p className="text-sm text-stone-500 mb-1">Bot ulangan</p>
          <p className="text-3xl font-bold text-amber-950">{stats?.botConnected || 0}</p>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-amber-950 mb-4">Hisobot turlari</h3>
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { label: "Oylik hisobot", desc: "Joriy oy" },
            { label: "Choraklik hisobot", desc: "IV chorak" },
            { label: "Yillik hisobot", desc: "2026-yil" },
          ].map((r) => (
            <button key={r.label} onClick={downloadReport} disabled={busy}
              className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-100 transition-all text-center active:scale-[0.98]">
              <Download className="w-6 h-6 text-amber-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-amber-900">{r.label}</p>
              <p className="text-xs text-stone-500 mt-1">{r.desc}</p>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}