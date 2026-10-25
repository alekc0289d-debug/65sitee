"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Loader2, ArrowRight, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api/client";
import Link from "next/link";

interface Child {
  id: string; fullName: string; classId: string;
  avg: number; gradesCount: number;
  todayGrades: { subject: string; score: number }[];
}

export default function ParentChildrenPage() {
  const { user, loading: authLoading } = useAuth(true);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    api.get<any>(`/api/dashboard/parent/${user.id}`)
      .then((res) => setChildren(res.children || []))
      .finally(() => setLoading(false));
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
          <Users className="w-8 h-8 text-amber-500" />
          Farzandlarim
        </h1>
        <p className="text-stone-500 mt-1">{children.length} ta farzand</p>
      </motion.div>

      {children.length === 0 ? (
        <Card>
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-amber-300 mx-auto mb-4" />
            <p className="text-stone-600 mb-2">Farzandlar topilmadi</p>
            <p className="text-xs text-stone-400">
              Farzandingiz ro&apos;yxatdan o&apos;tganda sizning raqamingizni kiritishi shart
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {children.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card hover>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-2xl">
                    {c.fullName[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-amber-950">{c.fullName}</h3>
                    <p className="text-sm text-stone-500">{c.classId} sinf</p>
                  </div>
                  <Badge variant="amber">{c.avg}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-2xl bg-amber-50 text-center">
                    <p className="text-xs text-stone-500 mb-1">Baholar</p>
                    <p className="text-lg font-bold text-amber-800">{c.gradesCount}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-green-50 text-center">
                    <p className="text-xs text-stone-500 mb-1">Bugun</p>
                    <p className="text-lg font-bold text-green-700">{c.todayGrades.length}</p>
                  </div>
                </div>

                {c.todayGrades.length > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs text-stone-500">Bugun:</span>
                    <div className="flex gap-1">
                      {c.todayGrades.map((g, idx) => (
                        <span key={idx} className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white text-xs ${
                          g.score === 5 ? "bg-green-500" : g.score === 4 ? "bg-amber-500" : "bg-red-500"
                        }`} title={g.subject}>
                          {g.score}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-stone-600">O&apos;zlashtirish</span>
                    <span className="font-bold text-amber-700">{((c.avg / 5) * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={(c.avg / 5) * 100} color="amber" />
                </div>

                <Link href={`/dashboard/children/${c.id}`} className="btn-secondary w-full flex items-center justify-center gap-2 !py-3">
                  Batafsil <ArrowRight className="w-4 h-4" />
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}