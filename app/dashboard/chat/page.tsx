"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Loader2, Send, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api/client";

export default function ChatPage() {
  const { user, loading: authLoading } = useAuth(true);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  async function load() {
    try {
      const res = await api.get<any[]>(
        `/api/chat/messages?classId=${user?.classId || ""}&limit=50`
      );
      setMessages(Array.isArray(res) ? res : []);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!user?.id) return;
    load();
    const i = setInterval(load, 5000);
    return () => clearInterval(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!newMsg.trim() || !user?.id) return;
    setBusy(true);
    try {
      await api.post<any>("/api/chat/send", {
        userId: user.id,
        classId: user.classId,
        text: newMsg.trim(),
      });
      setNewMsg("");
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
    <div className="space-y-6 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-amber-950 flex items-center gap-3">
          <MessageCircle className="w-8 h-8 text-amber-500" />
          Chat
        </h1>
        <p className="text-stone-500 mt-1">
          {user?.classId ? `${user.classId} sinfi` : "Umumiy chat"}
        </p>
      </motion.div>

      <Card className="!p-0 overflow-hidden" style={{ height: "60vh", display: "flex", flexDirection: "column" }}>
        <div className="p-4 border-b border-amber-100 flex items-center justify-between bg-amber-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-amber-950 text-sm">
                {user?.classId ? `${user.classId} guruhi` : "Umumiy"}
              </p>
              <p className="text-xs text-stone-500">Real-time chat</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-16">
              <MessageCircle className="w-16 h-16 text-amber-300 mx-auto mb-4" />
              <p className="text-stone-500 text-sm">Xabarlar yo&apos;q</p>
              <p className="text-xs text-stone-400 mt-2">Birinchi bo&apos;lib yozing!</p>
            </div>
          ) : (
            messages.map((m, i) => {
              const isMine = m.userId === user?.id;
              return (
                <div key={m.id || i} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] p-3 rounded-2xl ${
                    isMine
                      ? "bg-gradient-to-br from-amber-500 to-amber-600 text-white"
                      : "bg-stone-100 text-stone-800"
                  }`}>
                    {!isMine && (
                      <p className="text-xs font-semibold mb-1 opacity-80">
                        {m.authorName}
                      </p>
                    )}
                    <p className="text-sm break-words">{m.text}</p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-amber-100 bg-white">
          <div className="flex gap-2">
            <input
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Xabar yozing..."
              className="input-field flex-1 !py-3"
              disabled={busy}
            />
            <Button onClick={send} disabled={busy || !newMsg.trim()}>
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}