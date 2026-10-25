"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Loader2, Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface LogEntry {
  id: string; action: string; studentId?: string;
  status?: string; timestamp?: string; method?: string;
}

export default function SuperAdminLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Hozircha bo'sh — backend endpoint qo'shganda to'ldiriladi
    setLogs([]);
    setLoading(false);
  }, []);

  const filtered = logs.filter(
    (l) => !search || l.action.toLowerCase().includes(search.toLowerCase()) ||
      (l.studentId || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-amber-950 flex items-center gap-3">
          <Activity className="w-8 h-8 text-amber-500" />
          Loglar
        </h1>
        <p className="text-stone-500 mt-1">Barcha amallar tarixi</p>
      </motion.div>

      <Card>
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-amber-50/50 border border-amber-100">
          <Search className="w-4 h-4 text-stone-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Amal yoki ID bo'yicha qidirish..."
            className="flex-1 bg-transparent text-sm focus:outline-none"
          />
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <div className="text-center py-16">
            <Activity className="w-16 h-16 text-amber-300 mx-auto mb-4" />
            <p className="text-stone-500">Loglar hozircha mavjud emas</p>
            <p className="text-xs text-stone-400 mt-2">
              Tizim log yozishi yoqilganda bu yerda ko&apos;rinadi
            </p>
          </div>
        </Card>
      ) : (
        <Card className="!p-0 overflow-hidden">
          <div className="divide-y divide-amber-50">
            {filtered.map((l, i) => (
              <motion.div key={l.id || i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="p-4 hover:bg-amber-50/30">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                  <Badge variant="info" size="sm">{l.action}</Badge>
                  {l.status && <Badge variant={l.status === "success" ? "success" : "danger"} size="sm">{l.status}</Badge>}
                  <span className="text-xs text-stone-500 flex-1 truncate">{l.studentId}</span>
                  <span className="text-xs text-stone-400">{l.timestamp}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}