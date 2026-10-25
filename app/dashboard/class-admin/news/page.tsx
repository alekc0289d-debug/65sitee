"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Newspaper, Loader2, Eye, Pin, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api/client";
import { useAuth } from "@/hooks/useAuth";

interface NewsItem {
  id: string; title: string; content: string; category: string;
  priority: string; pinned: boolean; authorName: string;
  views: number; createdAt: string;
}

const CATS: Record<string, string> = {
  umumiy: "📰 Umumiy", talim: "🎓 Ta'lim", tadbir: "🎉 Tadbir",
  musobaqa: "🏆 Musobaqa", "e'lon": "📢 E'lon", muvaffaqiyat: "⭐ Muvaffaqiyat",
};

export default function ClassAdminNewsPage() {
  const { user, loading: authLoading } = useAuth(true);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<NewsItem | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get<NewsItem[]>("/api/news?limit=50");
      setNews(Array.isArray(res) ? res : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (user?.id) load(); }, [user?.id]);

  async function handleDelete(id: string, authorId: string) {
    if (!user?.id) return;
    // Faqat o'zi yozgan yangilikni o'chira oladi
    if (authorId !== user.id && user.role !== "bosh_admin") {
      alert("Faqat o'z yangiligingizni o'chira olasiz");
      return;
    }
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
    setBusy(true);
    try {
      await api.del(`/api/news/${id}`);
      await load();
    } finally {
      setBusy(false);
    }
  }

  if (authLoading || loading) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
    </div>
  );

  if (selected) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <button onClick={() => setSelected(null)}
          className="text-sm text-amber-600 hover:text-amber-700 font-semibold">
          ← Orqaga
        </button>
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="amber">{CATS[selected.category] || selected.category}</Badge>
            {selected.pinned && <Badge variant="danger">📌 Muhim</Badge>}
          </div>
          <h1 className="text-3xl font-bold text-amber-950 mb-4">{selected.title}</h1>
          <div className="flex items-center gap-3 text-xs text-stone-500 mb-6 pb-6 border-b border-amber-100">
            <span>✍️ {selected.authorName}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {selected.views}</span>
          </div>
          <div className="prose prose-sm max-w-none text-stone-700 leading-relaxed whitespace-pre-wrap">
            {selected.content}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-amber-950 flex items-center gap-3">
          <Newspaper className="w-8 h-8 text-amber-500" />
          Yangiliklar
        </h1>
        <p className="text-stone-500 mt-1">{news.length} ta yangilik</p>
      </motion.div>

      {news.length === 0 ? (
        <Card>
          <div className="text-center py-16">
            <Newspaper className="w-16 h-16 text-amber-300 mx-auto mb-4" />
            <p className="text-stone-500">Yangiliklar yo&apos;q</p>
          </div>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {news.map((n, i) => (
            <motion.div key={n.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card hover>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="amber" size="sm">{CATS[n.category] || n.category}</Badge>
                    {n.pinned && <Pin className="w-4 h-4 text-red-500" />}
                    {n.priority === "shoshilinch" && <Badge variant="danger" size="sm">Shoshilinch</Badge>}
                  </div>
                  {n.authorName === user?.fullName && (
                    <Button size="sm" variant="danger" onClick={() => handleDelete(n.id, "")} disabled={busy}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                <button onClick={() => setSelected(n)} className="text-left w-full">
                  <h3 className="font-bold text-amber-950 mb-2 line-clamp-2">{n.title}</h3>
                  <p className="text-sm text-stone-600 line-clamp-3 mb-3">{n.content}</p>
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span>{n.authorName}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {n.views}</span>
                  </div>
                </button>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}