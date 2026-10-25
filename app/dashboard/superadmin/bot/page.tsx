"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bot, Loader2, CheckCircle, AlertCircle, XCircle, Users,
  Search, Link as LinkIcon,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { getBotStatus, type BotStatusResponse, type BotStudent } from "@/lib/api/bot";

type Tab = "connected" | "pending" | "blocked" | "not_registered";

const TABS: { key: Tab; label: string; color: "success" | "warning" | "danger" | "neutral"; icon: React.ReactNode }[] = [
  { key: "connected", label: "Ulangan", color: "success", icon: <CheckCircle className="w-4 h-4" /> },
  { key: "pending", label: "Kutilmoqda", color: "warning", icon: <AlertCircle className="w-4 h-4" /> },
  { key: "blocked", label: "Bloklagan", color: "danger", icon: <XCircle className="w-4 h-4" /> },
  { key: "not_registered", label: "Ro'yxatdan o'tmagan", color: "neutral", icon: <Users className="w-4 h-4" /> },
];

export default function SuperAdminBotPage() {
  const { user, loading: authLoading } = useAuth(true);
  const [data, setData] = useState<BotStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("connected");
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await getBotStatus();
      setData(res);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (user?.id) load(); }, [user?.id]);

  function copyBotLink() {
    const link = "https://t.me/maktabim65_bot";
    navigator.clipboard.writeText(link);
    alert("✅ Bot linki nusxalandi: " + link);
  }

  if (authLoading || loading || !data) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
    </div>
  );

  const list = data[tab] || [];
  const filtered = search
    ? list.filter((s) => s.fullName.toLowerCase().includes(search.toLowerCase()) || s.phone.includes(search))
    : list;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-950 flex items-center gap-3">
            <Bot className="w-8 h-8 text-amber-500" />
            Bot holati
          </h1>
          <p className="text-stone-500 mt-1">Jami: {data.total} o&apos;quvchi</p>
        </div>
        <Button variant="secondary" onClick={copyBotLink}>
          <LinkIcon className="w-4 h-4" /> Bot linkini nusxalash
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button onClick={() => setTab("connected")}
          className={`text-left transition-all ${tab === "connected" ? "scale-[1.02]" : ""}`}>
          <Card className={tab === "connected" ? "!border-2 !border-green-400" : ""}>
            <CheckCircle className="w-6 h-6 text-green-600 mb-3" />
            <p className="text-sm text-stone-500 mb-1">Ulangan</p>
            <p className="text-3xl font-bold text-green-700">{data.stats.connected}</p>
          </Card>
        </button>
        <button onClick={() => setTab("pending")}
          className={`text-left transition-all ${tab === "pending" ? "scale-[1.02]" : ""}`}>
          <Card className={tab === "pending" ? "!border-2 !border-amber-400" : ""}>
            <AlertCircle className="w-6 h-6 text-amber-600 mb-3" />
            <p className="text-sm text-stone-500 mb-1">Kutilmoqda</p>
            <p className="text-3xl font-bold text-amber-700">{data.stats.pending}</p>
          </Card>
        </button>
        <button onClick={() => setTab("blocked")}
          className={`text-left transition-all ${tab === "blocked" ? "scale-[1.02]" : ""}`}>
          <Card className={tab === "blocked" ? "!border-2 !border-red-400" : ""}>
            <XCircle className="w-6 h-6 text-red-600 mb-3" />
            <p className="text-sm text-stone-500 mb-1">Bloklagan</p>
            <p className="text-3xl font-bold text-red-700">{data.stats.blocked}</p>
          </Card>
        </button>
        <button onClick={() => setTab("not_registered")}
          className={`text-left transition-all ${tab === "not_registered" ? "scale-[1.02]" : ""}`}>
          <Card className={tab === "not_registered" ? "!border-2 !border-stone-400" : ""}>
            <Users className="w-6 h-6 text-stone-600 mb-3" />
            <p className="text-sm text-stone-500 mb-1">Ro&apos;yxatsiz</p>
            <p className="text-3xl font-bold text-stone-700">{data.stats.not_registered}</p>
          </Card>
        </button>
      </div>

      {/* Search */}
      <Card>
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-amber-50/50 border border-amber-100">
          <Search className="w-4 h-4 text-stone-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Ism yoki telefon..." className="flex-1 bg-transparent text-sm focus:outline-none" />
        </div>
      </Card>

      {/* List */}
      <Card className="!p-0 overflow-hidden">
        <div className="p-4 border-b border-amber-100 flex items-center justify-between">
          <h3 className="font-bold text-amber-950">
            {TABS.find((t) => t.key === tab)?.label} ({filtered.length})
          </h3>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-stone-500">Bu toifada hech kim yo&apos;q</p>
          </div>
        ) : (
          <div className="divide-y divide-amber-50 max-h-[600px] overflow-y-auto">
            {filtered.map((s, i) => (
              <motion.div key={s.studentId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                className="p-4 flex items-center gap-4 hover:bg-amber-50/30">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                  s.status === "connected" ? "bg-green-500" :
                  s.status === "pending" ? "bg-amber-500" :
                  s.status === "blocked" ? "bg-red-500" : "bg-stone-400"
                }`}>
                  {s.fullName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-amber-950 truncate">{s.fullName}</p>
                  <div className="flex flex-wrap gap-2 items-center text-xs text-stone-500 mt-0.5">
                    <span>{s.classId}</span>
                    <span>·</span>
                    <span>{s.phone}</span>
                    {s.telegramId && (
                      <>
                        <span>·</span>
                        <span className="font-mono">TG: {s.telegramId}</span>
                      </>
                    )}
                  </div>
                </div>
                <Badge variant={
                  s.status === "connected" ? "success" :
                  s.status === "pending" ? "warning" :
                  s.status === "blocked" ? "danger" : "neutral"
                }>
                  {s.status === "connected" ? "Ulangan" :
                   s.status === "pending" ? "Kutilmoqda" :
                   s.status === "blocked" ? "Bloklagan" : "Ro'yxatsiz"}
                </Badge>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}