"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Loader2, TrendingUp, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api/client";

const YEAR = new Date().getFullYear();

export default function DirectorPaymentsPage() {
  const { user, loading: authLoading } = useAuth(true);
  const [data, setData] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    api.get<any>("/api/dashboard/director")
      .then((res) => {
        setData(res.school);
        setClasses(res.classes || []);
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (authLoading || loading) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
    </div>
  );

  const total = data?.students || 0;
  const expectedAmount = total * 5000;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-amber-950 flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-amber-500" />
          To&apos;lovlar
        </h1>
        <p className="text-stone-500 mt-1">{YEAR}-yil · Maktab miqyosida</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <p className="text-sm text-stone-500 mb-1">Jami o&apos;quvchilar</p>
          <p className="text-3xl font-bold text-amber-950">{total}</p>
        </Card>
        <Card>
          <p className="text-sm text-stone-500 mb-1">Kutilayotgan</p>
          <p className="text-3xl font-bold text-amber-700">
            {expectedAmount.toLocaleString()}
          </p>
          <p className="text-xs text-stone-400 mt-1">so&apos;m</p>
        </Card>
        <Card>
          <p className="text-sm text-stone-500 mb-1">Yillik to&apos;lov</p>
          <p className="text-3xl font-bold text-amber-700">5 000</p>
          <p className="text-xs text-stone-400 mt-1">so&apos;m / o&apos;quvchi</p>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-amber-950 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-amber-600" />
          Sinflar bo&apos;yicha
        </h3>
        {classes.length === 0 ? (
          <p className="text-sm text-stone-400 text-center py-8">Sinflar yo&apos;q</p>
        ) : (
          <div className="space-y-3">
            {classes.map((c: any) => (
              <div key={c.classId} className="p-4 rounded-2xl bg-stone-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-xs">
                      {c.classId}
                    </div>
                    <div>
                      <p className="font-semibold text-amber-950">{c.classId} sinfi</p>
                      <p className="text-xs text-stone-500">{c.students} o&apos;quvchi</p>
                    </div>
                  </div>
                  <Badge variant="amber">
                    {(c.students * 5000).toLocaleString()} so&apos;m
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}