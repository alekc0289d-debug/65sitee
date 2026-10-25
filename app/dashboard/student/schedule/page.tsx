"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Loader2, Clock, MapPin, User } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api/client";

const DAYS = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];

export default function StudentSchedulePage() {
  const { user, loading: authLoading } = useAuth(true);
  const [schedule, setSchedule] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState("");

  useEffect(() => {
    if (!user?.classId) {
      setLoading(false);
      return;
    }
    api.get<any>(`/api/schedule/${user.classId}`)
      .then((res) => {
        if (res.days) setSchedule(res.days);
        const today = new Date().getDay();
        const dayName = ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"][today];
        setActiveDay(DAYS.includes(dayName) ? dayName : "Dushanba");
      })
      .finally(() => setLoading(false));
  }, [user?.classId]);

  if (authLoading || loading) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
    </div>
  );

  const lessons = schedule[activeDay] || [];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-amber-950 flex items-center gap-3">
          <Calendar className="w-8 h-8 text-amber-500" />
          Dars jadvali
        </h1>
        <p className="text-stone-500 mt-1">{user?.classId} sinfi</p>
      </motion.div>

      {/* Days tabs */}
      <Card>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {DAYS.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDay(d)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeDay === d
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30"
                  : "text-stone-600 hover:bg-amber-50"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </Card>

      {/* Lessons */}
      {lessons.length === 0 ? (
        <Card>
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-amber-300 mx-auto mb-4" />
            <p className="text-stone-500">
              {activeDay} uchun jadval kiritilmagan
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {lessons.map((l: any, i: number) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <Card>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {l.lessonNumber}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-amber-950 mb-1">{l.subject}</h3>
                    <div className="flex flex-wrap gap-3 text-xs text-stone-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" /> {l.teacher || "—"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {l.startTime}–{l.endTime}
                      </span>
                      {l.room && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {l.room}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}