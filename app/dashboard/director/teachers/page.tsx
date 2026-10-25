"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users, GraduationCap, TrendingUp, Award, Loader2, AlertCircle,
  Download, Zap, Check,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api/client";

interface ClassStat { classId: string; students: number; avg: number; struggling: number; }
interface DirectorData {
  ok: boolean;
  school: { id: string; name: string; students: number; classes: number; avg: number; };
  classes: ClassStat[];
  teachers: any[];
}

export default function DirectorDashboard() {
  const { user, loading: authLoading } = useAuth(true);
  const [data, setData] = useState<DirectorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncDone, setSyncDone] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get<DirectorData>("/api/dashboard/director");
      if (!res.ok) throw new Error("Ma'lumot topilmadi");
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Xatolik");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!user?.id) return;
    load();
  }, [user?.id]);

  async function handleSyncAll() {
    if (!confirm("Barcha o'quvchilarni hozir sinxronlashni boshlaysizmi? Bu bir necha daqiqa davom etadi.")) return;
    setSyncing(true);
    setSyncDone(false);
    try {
      const res = await api.post<{ status: string }>("/api/sync-now", {});
      // Admin token bilan ishlaydi
      if (res.status === "started") {
        setSyncDone(true);
        setTimeout(() => setSyncDone(false), 5000);
      }
    } catch (e) {
      alert("Xatolik: " + (e instanceof Error ? e.message : ""));
    } finally {
      setSyncing(false);
    }
  }

  if (authLoading || loading) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
    </div>
  );

  if (error || !data) return (
    <Card>
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p className="text-stone-600">{error || "Ma'lumot yuklanmadi"}</p>
      </div>
    </Card>
  );

  const { school, classes, teachers } = data;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-950">{school.name} 📊</h1>
          <p className="text-stone-500 mt-1">Salom, {user?.fullName}!</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={handleSyncAll} disabled={syncing || syncDone} variant={syncDone ? "secondary" : "primary"}>
            {syncing ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Boshlanmoqda...</>
            ) : syncDone ? (
              <><Check className="w-4 h-4" /> Boshlandi!</>
            ) : (
              <><Zap className="w-4 h-4" /> Barchasini ishga tushurish</>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Main stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 text-blue-700 flex items-center justify-center mb-4">
            <Users className="w-6 h-6" />
          </div>
          <p className="text-sm text-stone-500 mb-1">O&apos;quvchilar</p>
          <p className="text-3xl font-bold text-amber-950">{school.students}</p>
        </Card>
        <Card>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 text-amber-700 flex items-center justify-center mb-4">
            <GraduationCap className="w-6 h-6" />
          </div>
          <p className="text-sm text-stone-500 mb-1">Sinflar</p>
          <p className="text-3xl font-bold text-amber-950">{school.classes}</p>
        </Card>
        <Card>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-100 to-green-50 text-green-700 flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-sm text-stone-500 mb-1">O&apos;rtacha</p>
          <p className="text-3xl font-bold text-amber-950">{school.avg}</p>
        </Card>
        <Card>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 text-orange-700 flex items-center justify-center mb-4">
            <Award className="w-6 h-6" />
          </div>
          <p className="text-sm text-stone-500 mb-1">O&apos;qituvchilar</p>
          <p className="text-3xl font-bold text-amber-950">{teachers.length}</p>
        </Card>
      </div>

      {/* Classes ranking */}
      <Card className="!p-0 overflow-hidden">
        <div className="p-6 border-b border-amber-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-amber-950 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            Sinflar reytingi
          </h3>
          <Badge variant="amber">{classes.length}</Badge>
        </div>
        {classes.length === 0 ? (
          <div className="p-8 text-center text-stone-400">Sinflar yo&apos;q</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-amber-50/50">
                <tr className="text-left text-xs font-semibold text-stone-600 uppercase">
                  <th className="px-6 py-3">Sinf</th>
                  <th className="px-6 py-3">O&apos;quvchilar</th>
                  <th className="px-6 py-3">O&apos;rtacha</th>
                  <th className="px-6 py-3">Muammoli</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-50">
                {classes.map((c, i) => (
                  <motion.tr key={c.classId} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className="hover:bg-amber-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-xs">
                          {c.classId}
                        </div>
                        <span className="font-semibold text-amber-950">{c.classId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-stone-700">{c.students}</td>
                    <td className="px-6 py-4"><span className="font-bold text-amber-700">{c.avg}</span></td>
                    <td className="px-6 py-4">
                      {c.struggling > 0 ? <Badge variant="warning">{c.struggling} ta</Badge> : <span className="text-stone-400 text-sm">—</span>}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}