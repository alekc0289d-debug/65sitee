"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Newspaper, Plus, Loader2, Trash2, Eye, Pin, Save, X,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api/client";

interface NewsItem {
  id: string; title: string; content: string; category: string;
  priority: string; pinned: boolean; authorName: string;
  views: number; createdAt: string;
}

const CATS = [
  { value: "umumiy", label: "📰 Umumiy" },
  { value: "talim", label: "🎓 Ta'lim" },
  { value: "tadbir", label: "🎉 Tadbir" },
  { value: "musobaqa", label: "🏆 Musobaqa" },
  { value: "e'lon", label: "📢 E'lon" },
  { value: "muvaffaqiyat", label: "⭐ Muvaffaqiyat" },
];

const PRIORITIES = [
  { value: "past", label: "Past" },
  { value: "orta", label: "O'rta" },
  { value: "yuqori", label: "Yuqori" },
  { value: "shoshilinch", label: "Shoshilinch" },
];

export default function SuperAdminNewsPage() {
  const { user, loading: authLoading } = useAuth(true);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("umumiy");
  const [priority, setPriority] = useState("orta");
  const [pinned, setPinned] = useState(false);
  const [formError, setFormError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await api.get<NewsItem[]>("/api/news?limit=50");
      setNews(Array.isArray(res) ? res : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate() {
    setFormError("");
    if (!title.trim() || title.trim().length < 5) {
      setFormError("Sarlavha kamida 5 belgi");
      return;
    }
    if (!content.trim() || content.trim().length < 20) {
      setFormError("Matn kamida 20 belgi");
      return;
    }

    setBusy(true);
    try {
      const res = await api.post<any>("/api/news", {
        authorId: user?.id, authorRole: user?.role,
        title: title.trim(), content: content.trim(),
        category, priority, pinned,
      });
      if (!res.ok) {
        setFormError(res.message || "Xatolik");
        return;
      }
      setModalOpen(false);
      setTitle(""); setContent(""); setPinned(false);
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
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

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-950 flex items-center gap-3">
            <Newspaper className="w-8 h-8 text-amber-500" />
            Yangiliklar
          </h1>
          <p className="text-stone-500 mt-1">{news.length} ta</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4" /> Yangi yangilik
        </Button>
      </motion.div>

      {news.length === 0 ? (
        <Card>
          <div className="text-center py-16">
            <Newspaper className="w-16 h-16 text-amber-300 mx-auto mb-4" />
            <p className="text-stone-500 mb-4">Hozircha yangiliklar yo&apos;q</p>
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="w-4 h-4" /> Birinchi yangilikni yozish
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {news.map((n, i) => (
            <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
              <Card>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant="amber">{CATS.find((c) => c.value === n.category)?.label || n.category}</Badge>
                      {n.pinned && <Badge variant="danger"><Pin className="w-3 h-3 inline mr-1" />Muhim</Badge>}
                      {n.priority === "shoshilinch" && <Badge variant="danger">Shoshilinch</Badge>}
                    </div>
                    <h3 className="font-bold text-amber-950 mb-2 line-clamp-1">{n.title}</h3>
                    <p className="text-sm text-stone-600 line-clamp-2 mb-2">{n.content}</p>
                    <div className="flex items-center gap-3 text-xs text-stone-400">
                      <span>✍️ {n.authorName}</span>
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {n.views}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(n.id)} disabled={busy}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Yangi yangilik" size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Sarlavha *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder="Maktab yangiligi..." autoFocus />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Matn *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="input-field resize-none"
              placeholder="Yangilik matni..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Toifa</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field">
                {CATS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Muhimlik</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className="input-field">
                {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
          </div>
          <label className="flex items-center gap-3 p-3 rounded-2xl border-2 border-stone-200 cursor-pointer hover:border-amber-200">
            <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} className="w-5 h-5 rounded" />
            <span className="text-sm text-stone-700">📌 Tepada ko&apos;rsatish (pinned)</span>
          </label>

          {formError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200">
              <p className="text-sm text-red-700">{formError}</p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={busy} className="flex-1">
              <X className="w-4 h-4" /> Bekor
            </Button>
            <Button onClick={handleCreate} disabled={busy} className="flex-1">
              {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Yuborilmoqda...</> : <><Save className="w-4 h-4" /> Chop etish</>}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}