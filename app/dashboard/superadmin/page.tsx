"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2, Users, DollarSign, Activity, Loader2, AlertTriangle, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api/client";

export default function BoshAdminDashboard() {
  const { user, loading: authLoading } = useAuth(true);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [emergency, setEmergency] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    api.get<any>("/api/dashboard/bosh-admin")
      .then((res) => setStats(res.stats))
      .finally(() => setLoading(false));
  }, [user?.id]);

  async function handleEmergencySync() {
    if (!confirm("DIQQAT! Bu barcha jarayonlarni to'xtatib, barcha o'quvchilar baholarini zudlik bilan yuklaydi. Davom etasizmi?")) return;
    setEmergency(true);
    try {
      const res = await api.post<any>("/api/sync/emergency", {});
      if (res.ok) alert("✅ Favqulodda sinxronizatsiya boshlandi!");
    } catch (e) {
      alert("Xatolik: " + (e instanceof Error ? e.message : ""));
    } finally {
      setEmergency(false);
    }
  }

  if (authLoading || loading || !stats) return <div className="flex justify-center h-96"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-amber-950">Bosh admin 👑</h1>
        <p className="text-stone-500 mt-1">Salom, {user?.fullName}!</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3"><Building2 className="w-5 h-5" /></div><p className="text-xs text-stone-500">Maktablar</p><p className="text-2xl font-bold">{stats.schools}</p></Card>
        <Card><div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3"><Users className="w-5 h-5" /></div><p className="text-xs text-stone-500">O'quvchilar</p><p className="text-2xl font-bold">{stats.students}</p></Card>
        <Card><div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center mb-3"><DollarSign className="w-5 h-5" /></div><p className="text-xs text-stone-500">Daromad</p><p className="text-2xl font-bold">{(stats.monthlyIncome/1000).toFixed(0)}k</p></Card>
        <Card><div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center mb-3"><Activity className="w-5 h-5" /></div><p className="text-xs text-stone-500">Bot</p><p className="text-2xl font-bold">{stats.botConnected}</p></Card>
      </div>

      <Card className="!border-red-300 bg-red-50/50">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-red-900 text-lg">Favqulodda boshqaruv</h3>
            <p className="text-sm text-red-700 mt-1 mb-4">
              Agar direktor tizimni ishga tushirmagan bo'lsa, bu tugma orqali barcha jarayonlarni to'xtatib, majburiy sinxronizatsiya qilishingiz mumkin.
            </p>
            <Button onClick={handleEmergencySync} disabled={emergency} variant="danger">
              {emergency ? <><Loader2 className="w-4 h-4 animate-spin" /> Boshlanmoqda...</> : <><ShieldCheck className="w-4 h-4" /> Favqulodda ishga tushirish</>}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}