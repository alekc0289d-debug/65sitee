"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Gift, Loader2, Trophy, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api/client";

interface Prize {
  id: string; studentName: string; classId: string;
  place: number; year: number; month: number;
  moneyAmount: number; premiumMonths: number;
  choice: string; status: string;
}

export default function DirectorPrizesPage() {
  const { user, loading: authLoading } = useAuth(true);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  async function load() {
    setLoading(true);
    try {
      const res = await api.get<Prize[]>(
        `/api/prizes/class/all/ranking?year=${year}&month=${month}`
      );
      // Fallback - boshqa endpoint
      setPrizes([]);
    } catch {
      setPrizes([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadPending() {
    try {
      const res = await api.get<any[]>("/api/prizes/pending");
      // Faqat maktab miqyosida
      setPrizes((Array.isArray(res) ? res : []) as Prize[]);
    } catch {
      setPrizes([]);
    }
  }

  useEffect(() => {
    if (!user?.id) return;
    loadPending();
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <Gift className="w-8 h-8 text-amber-500" />
          Sovg&apos;alar
        </h1>
        <p className="text-stone-500 mt-1">Oylik TOP-3 sovg&apos;alari</p>
      </motion.div>

      <Card className="bg-gradient-to-br from-amber-500 to-amber-700 text-white !border-amber-500">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Sovg&apos;a fondi</h3>
              <p className="text-amber-50 text-sm mt-1">
                Har oy TOP-3 o&apos;quvchi pul yoki Telegram Premium tanlaydi
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { place: "🥇", amount: "100 000" },
            { place: "🥈", amount: "40 000" },
            { place: "🥉", amount: "20 000" },
          ].map((p) => (
            <div key={p.place} className="p-3 rounded-2xl bg-white/10 backdrop-blur text-center">
              <p className="text-2xl mb-1">{p.place}</p>
              <p className="text-sm font-bold">{p.amount}</p>
              <p className="text-xs text-amber-100">so&apos;m</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-amber-950 mb-4">
          Kutilayotgan sovg&apos;alar
        </h3>
        {prizes.length === 0 ? (
          <div className="text-center py-12">
            <Gift className="w-16 h-16 text-amber-300 mx-auto mb-4" />
            <p className="text-stone-500">Hozircha tasdiqlanmagan sovg&apos;alar yo&apos;q</p>
            <p className="text-xs text-stone-400 mt-2">
              Har oy 1-sanasi avtomatik hisoblanadi
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {prizes.map((p) => (
              <div key={p.id} className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-amber-950">{p.studentName}</p>
                    <p className="text-xs text-stone-500">{p.classId}</p>
                    <p className="text-sm text-amber-700 mt-1">
                      {p.place}-o&apos;rin · {p.choice === "money"
                        ? `${p.moneyAmount.toLocaleString()} so'm`
                        : `${p.premiumMonths} oy Premium`}
                    </p>
                  </div>
                  <Badge variant="warning">{p.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}