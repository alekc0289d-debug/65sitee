"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Loader2, Download, Users, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api/client";

export default function TeacherReportsPage() {
  const { user, loading: authLoading } = useAuth(true);
  const [classes, setClasses] = useState<any[]>([]);
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    api.get<any>(`/api/dashboard/teacher/${user.id}`)
      .then((res) => {
        setClasses(res.classes || []);
        setTeacher(res.teacher);
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  function downloadCSV() {
    if (!classes.length) return;
    const rows = [
      ["Sinf", "O'quvchilar", "O'rtacha"],
      ...classes.map((c) => [c.classId, c.students, c.avg]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `oquvchi-hisobot.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
          <p className="text-stone-500 mt-1">{teacher?.fullName} · {teacher?.subject || "O'qituvchi"}</p>
        </div>
        <Button onClick={downloadCSV} disabled={!classes.length}>
          <Download className="w-4 h-4" /> CSV
        </Button>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-4">
        {classes.map((c, i) => (
          <motion.div key={c.classId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold">
                    {c.classId}
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-950">{c.classId}</h3>
                    <p className="text-xs text-stone-500">{c.students} o&apos;quvchi</p>
                  </div>
                </div>
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-stone-600">O&apos;rtacha</span>
                <span className="font-bold text-amber-700">{c.avg}/5</span>
              </div>
              <Progress value={(c.avg / 5) * 100} color={c.avg >= 4.5 ? "green" : c.avg >= 3.5 ? "amber" : "red"} />
            </Card>
          </motion.div>
        ))}
      </div>

      {classes.length === 0 && (
        <Card>
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-amber-300 mx-auto mb-4" />
            <p className="text-stone-500">Sinflar topilmadi</p>
          </div>
        </Card>
      )}
    </div>
  );
}