"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Loader2, Medal, Award } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api/client";

interface RankEntry { studentId: string; fullName: string; avg: number; rank: number; }

export default function StudentRankingPage() {
  const { user, loading: authLoading } = useAuth(true);
  const [ranking, setRanking] = useState<RankEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    api.get<any>(`/api/dashboard/student/${user.id}`)
      .then((res) => setRanking(res.ranking || []))
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (authLoading || loading) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
    </div>
  );

  const medalIcons = [
    <Medal key="1" className="w-5 h-5 text-yellow-500" />,
    <Medal key="2" className="w-5 h-5 text-stone-400" />,
    <Medal key="3" className="w-5 h-5 text-amber-600" />,
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-amber-950 flex items-center gap-3">
          <Trophy className="w-8 h-8 text-amber-500" />
          Sinf reytingi
        </h1>
        <p className="text-stone-500 mt-1">TOP o&apos;quvchilar</p>
      </motion.div>

      {ranking.length === 0 ? (
        <Card>
          <div className="text-center py-16">
            <Trophy className="w-16 h-16 text-amber-300 mx-auto mb-4" />
            <p className="text-stone-500">Reyting hali tayyor emas</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {ranking.map((r, i) => (
            <motion.div
              key={r.studentId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={r.studentId === user?.id ? "!border-2 !border-amber-400 bg-amber-50/50" : ""}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white flex-shrink-0 ${
                    r.rank === 1 ? "bg-gradient-to-br from-yellow-400 to-yellow-600" :
                    r.rank === 2 ? "bg-gradient-to-br from-stone-300 to-stone-500" :
                    r.rank === 3 ? "bg-gradient-to-br from-amber-500 to-amber-700" :
                    "bg-stone-200 text-stone-600"
                  }`}>
                    {r.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-amber-950 truncate">
                      {r.fullName} {r.studentId === user?.id && <span className="text-amber-600">(siz)</span>}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-amber-700">{r.avg}</p>
                    <p className="text-xs text-stone-400">o&apos;rtacha</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}