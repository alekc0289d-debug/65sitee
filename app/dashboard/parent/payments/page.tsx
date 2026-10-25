"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Loader2, Check, Info } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api/client";

export default function ParentPaymentsPage() {
  const { user, loading: authLoading } = useAuth(true);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    api.get<any>(`/api/dashboard/parent/${user.id}`)
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (authLoading || loading) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
    </div>
  );

  const children = data?.children || [];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-amber-950 flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-amber-500" />
          To&apos;lovlar
        </h1>
        <p className="text-stone-500 mt-1">Yillik to&apos;lovlar holati</p>
      </motion.div>

      <Card className="!border-amber-200 bg-amber-50/30">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900 text-sm">
              Yillik to&apos;lov — 5 000 so&apos;m
            </p>
            <p className="text-xs text-amber-700 mt-1">
              Sinf admini tomonidan yig&apos;iladi. Har bir o&apos;quvchi uchun yiliga bir marta.
            </p>
          </div>
        </div>
      </Card>

      {children.length === 0 ? (
        <Card>
          <div className="text-center py-16">
            <CreditCard className="w-16 h-16 text-amber-300 mx-auto mb-4" />
            <p className="text-stone-500">Farzandlar topilmadi</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {children.map((c: any, i: number) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-lg">
                      {c.fullName[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-amber-950">{c.fullName}</h3>
                      <p className="text-xs text-stone-500">{c.classId} sinf</p>
                    </div>
                  </div>
                  <Badge variant="success">
                    <Check className="w-3 h-3 inline mr-1" />
                    Sinf admini tomonidan yig&apos;iladi
                  </Badge>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}