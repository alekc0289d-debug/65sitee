"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Loader2, Plus, Trash2, Save, Clock, User, MapPin } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api/client";

const DAYS = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];

interface Lesson {
  lessonNumber: number; subject: string; teacher: string;
  startTime: string; endTime: string; room: string;
}

export default function ClassAdminSchedulePage() {
  const { user, loading: authLoading } = useAuth(true);
  const [schedule, setSchedule] = useState<Record<string, Lesson[]>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [activeDay, setActiveDay] = useState("Dushanba");
  const [dirty, setDirty] = useState(false);

  const classId = user?.classId || "";

  useEffect(() => {
    if (!classId) { setLoading(false); return; }
    api.get<any>(`/api/schedule/${classId}`)
      .then((res) => {
        if (res.days) setSchedule(res.days);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [classId]);

  function addLesson() {
    const lessons = schedule[activeDay] || [];
    const nextNum = lessons.length > 0 ? Math.max(...lessons.map((l) => l.lessonNumber)) + 1 : 1;
    setSchedule({
      ...schedule,
      [activeDay]: [
        ...lessons,
        {
          lessonNumber: nextNum,
          subject: "",
          teacher: "",
          startTime: "",
          endTime: "",
          room: "",
        },
      ],
    });
    setDirty(true);
  }

  function updateLesson(
  idx: number,
  field: "subject" | "teacher" | "startTime" | "endTime" | "room",
  value: string
) {
  const lessons = [...(schedule[activeDay] || [])];
  lessons[idx] = { ...lessons[idx], [field]: value };
  setSchedule({ ...schedule, [activeDay]: lessons });
  setDirty(true);
}

  function removeLesson(idx: number) {
    const lessons = (schedule[activeDay] || []).filter((_, i) => i !== idx);
    setSchedule({ ...schedule, [activeDay]: lessons });
    setDirty(true);
  }

  async function save() {
    if (!classId) return;
    setBusy(true);
    try {
      const res = await api.post<any>("/api/schedule/save", {
        classId,
        days: schedule,
        enteredBy: user?.id || "",
      });
      if (res.ok) {
        alert("✅ Jadval saqlandi");
        setDirty(false);
      } else {
        alert(res.message || "Xatolik");
      }
    } finally {
      setBusy(false);
    }
  }

  if (authLoading || loading) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
    </div>
  );

  if (!classId) return (
    <Card>
      <div className="text-center py-16">
        <Calendar className="w-16 h-16 text-amber-300 mx-auto mb-4" />
        <p className="text-stone-500">Siz sinfga biriktirilmagansiz</p>
      </div>
    </Card>
  );

  const lessons = schedule[activeDay] || [];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-950 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-amber-500" />
            Dars jadvali
          </h1>
          <p className="text-stone-500 mt-1">{classId} sinfi</p>
        </div>
        <Button onClick={save} disabled={busy || !dirty}>
          <Save className="w-4 h-4" />
          {busy ? "Saqlanmoqda..." : "Saqlash"}
        </Button>
      </motion.div>

      {/* Days tabs */}
      <Card>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {DAYS.map((d) => {
            const hasContent = (schedule[d] || []).length > 0;
            return (
              <button
                key={d}
                onClick={() => setActiveDay(d)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all relative ${
                  activeDay === d
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30"
                    : "text-stone-600 hover:bg-amber-50"
                }`}
              >
                {d}
                {hasContent && activeDay !== d && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Lessons */}
      <Card className="!p-0 overflow-hidden">
        <div className="p-5 border-b border-amber-100 flex items-center justify-between">
          <h3 className="font-bold text-amber-950">{activeDay} darslari</h3>
          <Button size="sm" onClick={addLesson}>
            <Plus className="w-3.5 h-3.5" /> Dars qo&apos;shish
          </Button>
        </div>

        {lessons.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-amber-300 mx-auto mb-4" />
            <p className="text-stone-500 mb-4">Bu kunga dars qo&apos;shilmagan</p>
            <Button onClick={addLesson}>
              <Plus className="w-4 h-4" /> Birinchi darsni qo&apos;shish
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-amber-50">
            {lessons.map((l, i) => (
              <div key={i} className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {l.lessonNumber}
                  </div>
                  <input
                    type="text"
                    value={l.subject}
                    onChange={(e) => updateLesson(i, "subject", e.target.value)}
                    placeholder="Fan nomi"
                    className="input-field !py-2 flex-1"
                  />
                  <Button size="sm" variant="danger" onClick={() => removeLesson(i)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <input
                    type="text"
                    value={l.teacher}
                    onChange={(e) => updateLesson(i, "teacher", e.target.value)}
                    placeholder="O'qituvchi"
                    className="input-field !py-2 text-sm"
                  />
                  <input
                    type="text"
                    value={l.startTime}
                    onChange={(e) => updateLesson(i, "startTime", e.target.value)}
                    placeholder="08:00"
                    className="input-field !py-2 text-sm"
                  />
                  <input
                    type="text"
                    value={l.endTime}
                    onChange={(e) => updateLesson(i, "endTime", e.target.value)}
                    placeholder="08:45"
                    className="input-field !py-2 text-sm"
                  />
                  <input
                    type="text"
                    value={l.room}
                    onChange={(e) => updateLesson(i, "room", e.target.value)}
                    placeholder="Xona"
                    className="input-field !py-2 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}