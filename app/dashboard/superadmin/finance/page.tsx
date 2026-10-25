"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Loader2, TrendingUp, CreditCard, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api/client";

export default function SuperAdminFinancePage() {
  const { user, loading: authLoading } = useAuth(true);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    api.get<any>("/api/dashboard/bosh-admin")
      .then((res) => setStats(res.stats))
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
          <DollarSign className="w-8 h-8 text-amber-500" />
          Moliya
        </h1>
        <p className="text-stone-500 mt-1">Umumiy moliyaviy holat</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-100 to-green-50 text-green-700 flex items-center justify-center mb-4">
            <DollarSign className="w-6 h-6" />
          </div>
          <p className="text-sm text-stone-500 mb-1">Bu oy daromad</p>
          <p className="text-3xl font-bold text-amber-950">
            {(stats?.monthlyIncome / 1000 || 0).toFixed(0)}k
          </p>
        </Card>
        <Card>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 text-blue-700 flex items-center justify-center mb-4">
            <Users className="w-6 h-6" />
          </div>
          <p className="text-sm text-stone-500 mb-1">O&apos;quvchilar</p>
          <p className="text-3xl font-bold text-amber-950">{stats?.students || 0}</p>
        </Card>
        <Card>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 text-amber-700 flex items-center justify-center mb-4">
            <CreditCard className="w-6 h-6" />
          </div>
          <p className="text-sm text-stone-500 mb-1">Foydalanuvchilar</p>
          <p className="text-3xl font-bold text-amber-950">{stats?.users || 0}</p>
        </Card>
        <Card>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 text-orange-700 flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-sm text-stone-500 mb-1">Bot ulangan</p>
          <p className="text-3xl font-bold text-amber-950">{stats?.botConnected || 0}</p>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-amber-950 mb-4">To&apos;lov tafsiloti</h3>
        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
          <p className="text-sm text-stone-600">
            Har bir o&apos;quvchi yiliga <b className="text-amber-700">5 000 so&apos;m</b> to&apos;laydi.
            To&apos;lovlar sinf admini tomonidan yig&apos;iladi.
          </p>
        </div>
      </Card>
    </div>
  );
}