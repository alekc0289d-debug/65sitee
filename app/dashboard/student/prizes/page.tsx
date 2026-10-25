"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Gift, Loader2, Trophy, Sparkles, Send } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api/client";

interface Prize {
  id: string; place: number; year: number; month: number;
  moneyAmount: number; premiumMonths: number;
  choice: "money" | "premium" | null;
  status: string; studentName: string;
}

export default function StudentPrizesPage() {
  const { user, loading: authLoading } = useAuth(true);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  async function load() {
    if (!user?.id) return;
    try {
      const res = await api.get<Prize[]>(`/api/prizes/awaiting/${user.id}`);
      setPrizes(Array.isArray(res) ? res : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user?.id]);

  async function choose(p: Prize, choice: "money" | "premium") {
    setBusy(true);
    try {
      const res = await api.post<any>("/api/prizes/choose", {
        prizeId: p.id, choice, telegramUsername: "",
      });
      if (res.ok) {
        alert("✅ Tanlov qabul qilindi! Sovg'a tez orada beriladi.");
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

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-amber-950 flex items-center gap-3">
          <Gift className="w-8 h-8 text-amber-500" />
          Sovg&apos;alar
        </h1>
        <p className="text-stone-500 mt-1">TOP-3 oylik sovg&apos;alar</p>
      </motion.div>

      {prizes.length === 0 ? (
        <Card>
          <div className="text-center py-16">
            <Gift className="w-16 h-16 text-amber-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-amber-950 mb-2">
              Hozircha sovg&apos;alar yo&apos;q
            </h3>
            <p className="text-stone-500">
              Har oy TOP-3 ga kirib, pul yoki Telegram Premium oling!
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {prizes.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="!border-2 !border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${
                    p.place === 1 ? "bg-gradient-to-br from-yellow-400 to-yellow-600" :
                    p.place === 2 ? "bg-gradient-to-br from-stone-300 to-stone-500" :
                    "bg-gradient-to-br from-amber-500 to-amber-700"
                  }`}>
                    {p.place === 1 ? "🥇" : p.place === 2 ? "🥈" : "🥉"}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-amber-950">
                      {p.place}-o&apos;rin
                    </h3>
                    <p className="text-sm text-stone-600">
                      {p.month}/{p.year} oyi
                    </p>
                    <Badge variant="success" className="mt-2">
                      <Sparkles className="w-3 h-3 inline mr-1" />
                      Sovg&apos;a kutmoqda
                    </Badge>
                  </div>
                </div>

                <p className="text-center text-stone-700 mb-4 font-semibold">
                  Sovg&apos;ani tanlang:
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => choose(p, "money")}
                    disabled={busy}
                    className="p-5 rounded-2xl bg-white border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-50 transition-all active:scale-[0.98] text-left"
                  >
                    <div className="text-3xl mb-2">💰</div>
                    <p className="font-bold text-amber-950">Pul</p>
                    <p className="text-lg font-bold text-amber-700">
                      {p.moneyAmount.toLocaleString()} so&apos;m
                    </p>
                  </button>

                  <button
                    onClick={() => choose(p, "premium")}
                    disabled={busy}
                    className="p-5 rounded-2xl bg-white border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-50 transition-all active:scale-[0.98] text-left"
                  >
                    <div className="text-3xl mb-2">✈️</div>
                    <p className="font-bold text-amber-950">Telegram Premium</p>
                    <p className="text-lg font-bold text-amber-700">
                      {p.premiumMonths} oy
                    </p>
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}