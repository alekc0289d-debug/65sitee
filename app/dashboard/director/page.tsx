"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, GraduationCap, TrendingUp, Award, Loader2, AlertCircle, Zap, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api/client";

export default function DirectorDashboard() {
  const { user, loading: authLoading } = useAuth(true);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncEnabled, setSyncEnabled] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [res, settings] = await Promise.all([
        api.get<any>("/api/dashboard/director"),
        api.get<any>("/api/settings")
      ]);
      setData(res);
      setSyncEnabled(settings.syncEnabled);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (user?.id) load(); }, [user?.id]);

  async function handleSyncAll() {
    if (!confirm("Barcha o'quvchilarni baholarini yuklashni boshlaysizmi?")) return;
    setSyncing(true);
    try {
      await api.post("/api/sync/start", {});
      setSyncEnabled(true);
      alert("✅ Baholar yuklanishi boshlandi!");
    } catch (e) {
      alert("Xatolik: " + (e instanceof Error ? e.message : ""));
    } finally {
      setSyncing(false);
    }
  }

  if (authLoading || loading || !data) return <div className="flex justify-center h-96"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>;

  const { school, classes } = data;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-950">{school.name} 📊</h1>
          <p className="text-stone-500 mt-1">Salom, {user?.fullName}!</p>
        </div>
        
        {/* DINAMIK TUGMA */}
        {syncEnabled ? (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-100 text-green-700 font-medium border border-green-200">
            <CheckCircle className="w-5 h-5" />
            Avto-sinxronizatsiya faol (Har soatda)
          </div>
        ) : (
          <Button onClick={handleSyncAll} disabled={syncing}>
            {syncing ? <><Loader2 className="w-4 h-4 animate-spin" /> Boshlanmoqda...</> : <><Zap className="w-4 h-4" /> Barchasini ishga tushurish</>}
          </Button>
        )}
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4"><Users className="w-6 h-6" /></div><p className="text-sm text-stone-500 mb-1">O'quvchilar</p><p className="text-3xl font-bold text-amber-950">{school.students}</p></Card>
        <Card><div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4"><GraduationCap className="w-6 h-6" /></div><p className="text-sm text-stone-500 mb-1">Sinflar</p><p className="text-3xl font-bold text-amber-950">{school.classes}</p></Card>
        <Card><div className="w-12 h-12 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center mb-4"><TrendingUp className="w-6 h-6" /></div><p className="text-sm text-stone-500 mb-1">O'rtacha</p><p className="text-3xl font-bold text-amber-950">{school.avg}</p></Card>
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="p-6 border-b border-amber-100 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-600" /><h3 className="text-lg font-bold text-amber-950">Sinflar reytingi</h3>
        </div>
        <div className="p-4 space-y-2">
          {classes.map((c: any, i: number) => (
            <div key={c.classId} className="flex justify-between p-3 rounded-xl bg-amber-50/50">
              <span className="font-bold text-amber-900">{c.classId}</span>
              <span className="text-amber-700 font-semibold">{c.avg} ball</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}