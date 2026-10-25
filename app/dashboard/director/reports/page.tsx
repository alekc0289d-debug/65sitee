"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FileText, Loader2, Download, TrendingUp, Users, Award,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api/client";

export default function DirectorReportsPage() {
  const { user, loading: authLoading } = useAuth(true);
  const [data, setData] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    api.get<any>("/api/dashboard/director")
      .then((res) => {
        setData(res.school);
        setClasses(res.classes || []);
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  function downloadCSV() {
    if (!classes.length) return;
    setBusy(true);
    try {
      const rows = [
        ["Sinf", "O'quvchilar", "O'rtacha", "Muammoli"],
        ...classes.map((c) => [c.classId, c.students, c.avg, c.struggling]),
      ];
      const csv = rows.map((r) => r.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `maktab-hisobot-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-950 flex items-center gap-3">
            <FileText className="w-8 h-8 text-amber-500" />
            Hisobotlar
          </h1>
          <p className="text-stone-500 mt-1">Maktab statistikasi</p>
        </div>
        <Button onClick={downloadCSV} disabled={busy}>
          <Download className="w-4 h-4" /> CSV yuklab olish
        </Button>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <Users className="w-6 h-6 text-blue-600 mb-3" />
          <p className="text-sm text-stone-500 mb-1">O&apos;quvchilar</p>
          <p className="text-3xl font-bold text-amber-950">{data?.students || 0}</p>
        </Card>
        <Card>
          <Award className="w-6 h-6 text-amber-600 mb-3" />
          <p className="text-sm text-stone-500 mb-1">Sinflar</p>
          <p className="text-3xl font-bold text-amber-950">{data?.classes || 0}</p>
        </Card>
        <Card>
          <TrendingUp className="w-6 h-6 text-green-600 mb-3" />
          <p className="text-sm text-stone-500 mb-1">O&apos;rtacha</p>
          <p className="text-3xl font-bold text-amber-950">{data?.avg || 0}</p>
        </Card>
        <Card>
          <FileText className="w-6 h-6 text-orange-600 mb-3" />
          <p className="text-sm text-stone-500 mb-1">Sinflar</p>
          <p className="text-3xl font-bold text-amber-950">{classes.length}</p>
        </Card>
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="p-5 border-b border-amber-100">
          <h3 className="font-bold text-amber-950">Sinflar bo&apos;yicha hisobot</h3>
        </div>
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
                  className="hover:bg-amber-50/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-xs">
                        {c.classId}
                      </div>
                      <span className="font-semibold text-amber-950">{c.classId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-stone-700">{c.students}</td>
                  <td className="px-6 py-4 font-bold text-amber-700">{c.avg}</td>
                  <td className="px-6 py-4">
                    {c.struggling > 0 ? <Badge variant="warning">{c.struggling} ta</Badge> : <span className="text-stone-400">—</span>}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}