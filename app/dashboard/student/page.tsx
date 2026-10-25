"use client";

import { motion } from "framer-motion";
import {
  BookOpen, Trophy, Flame, TrendingUp, Gift,
  Calendar, Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/dashboard/StatCard";
import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";

const recentGrades = [
  { subject: "Matematika", score: 5, date: "Bugun", teacher: "Tursinova M.A." },
  { subject: "Fizika", score: 4, date: "Bugun", teacher: "Samadova Y.S." },
  { subject: "Ingliz tili", score: 5, date: "Kecha", teacher: "Normamatova S.O." },
  { subject: "Kimyo", score: 5, date: "Kecha", teacher: "Ro'ziyeva M.N." },
];

const subjects = [
  { name: "Matematika", score: 92 },
  { name: "Fizika", score: 78 },
  { name: "Ingliz tili", score: 95 },
  { name: "Kimyo", score: 85 },
  { name: "Biologiya", score: 70 },
  { name: "Tarix", score: 88 },
];

const topStudents = [
  { rank: 1, name: "Aziza Karimova", score: 4.9, you: true },
  { rank: 2, name: "Sardor Aliyev", score: 4.8, you: false },
  { rank: 3, name: "Laylo Rahimova", score: 4.6, you: false },
  { rank: 4, name: "Bobur Karimov", score: 4.5, you: false },
  { rank: 5, name: "Nilufar Sattorova", score: 4.4, you: false },
];

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-amber-950">
            Salom, Aziza! 👋
          </h1>
          <p className="text-stone-500 mt-1">
            Bugun ham ajoyib kun bo'lsin
          </p>
        </div>
        <Badge variant="success" className="!text-base !px-4 !py-2">
          🍂 Faol
        </Badge>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="O'rtacha ball"
          value="4.7"
          icon={<BookOpen className="w-6 h-6" />}
          trend={5}
          color="amber"
          delay={0}
        />
        <StatCard
          label="Daraja"
          value="Oltin"
          icon={<Trophy className="w-6 h-6" />}
          color="orange"
          delay={0.1}
        />
        <StatCard
          label="Streak"
          value="12 kun"
          icon={<Flame className="w-6 h-6" />}
          trend={8}
          color="red"
          delay={0.2}
        />
      </div>

      {/* Chart + Ranking */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Growth chart */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-amber-950">O'sish grafigi</h3>
              <p className="text-sm text-stone-500">Oxirgi 3 oy</p>
            </div>
            <Badge variant="success">
              <TrendingUp className="w-3 h-3 inline mr-1" /> +15%
            </Badge>
          </div>
          <div className="h-56 flex items-end gap-2">
            {[60, 65, 70, 68, 75, 80, 78, 85, 88, 90, 92, 95].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 0.3 + i * 0.04, duration: 0.4 }}
                className="flex-1 rounded-t-lg bg-gradient-to-t from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 transition-colors cursor-pointer"
              />
            ))}
          </div>
        </Card>

        {/* Ranking */}
        <Card>
          <h3 className="text-xl font-bold text-amber-950 mb-4">
            🏆 Sinf reytingi
          </h3>
          <div className="space-y-2">
            {topStudents.map((s) => (
              <div
                key={s.rank}
                className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                  s.you
                    ? "bg-gradient-to-r from-amber-100 to-amber-50 border-2 border-amber-300"
                    : "hover:bg-amber-50/50"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    s.rank === 1
                      ? "bg-yellow-400 text-yellow-900"
                      : s.rank === 2
                      ? "bg-stone-300 text-stone-700"
                      : s.rank === 3
                      ? "bg-amber-600 text-white"
                      : "bg-stone-100 text-stone-500"
                  }`}
                >
                  {s.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-amber-950 truncate">
                    {s.name} {s.you && "(siz)"}
                  </p>
                </div>
                <span className="text-sm font-bold text-amber-700">
                  {s.score}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Subjects */}
      <Card>
        <h3 className="text-xl font-bold text-amber-950 mb-6">
          📊 Fan bo'yicha
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {subjects.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-stone-700">{s.name}</span>
                <span className="font-bold text-amber-700">{s.score}%</span>
              </div>
              <Progress
                value={s.score}
                color={s.score >= 85 ? "green" : s.score >= 70 ? "amber" : "red"}
              />
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Recent grades + Prize */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h3 className="text-xl font-bold text-amber-950 mb-4">
            📝 Oxirgi baholar
          </h3>
          <div className="space-y-2">
            {recentGrades.map((g, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-amber-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
                      g.score === 5
                        ? "bg-green-500"
                        : g.score === 4
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                  >
                    {g.score}
                  </div>
                  <div>
                    <p className="font-semibold text-amber-950 text-sm">
                      {g.subject}
                    </p>
                    <p className="text-xs text-stone-500">
                      {g.teacher} · {g.date}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-amber-100 to-orange-100 !border-amber-200">
          <div className="flex items-center gap-2 mb-4">
            <Gift className="w-6 h-6 text-amber-700" />
            <h3 className="text-lg font-bold text-amber-900">Oy sovg'asi</h3>
          </div>
          <p className="text-4xl mb-3">🎁</p>
          <p className="text-sm font-semibold text-amber-800 mb-1">
            Sizga 3 245 ball kerak
          </p>
          <Progress value={67} max={100} color="amber" showLabel />
          <p className="text-xs text-amber-700 mt-3">
            +5 ta a'lo baho qolgach — sovg'a sizni kutmoqda!
          </p>
        </Card>
      </div>

      {/* AI hint */}
      <Card className="bg-gradient-to-br from-amber-500 to-amber-700 text-white !border-amber-500">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">AI Tavsiya</h3>
            <p className="text-amber-50 text-sm leading-relaxed">
              Fizika fanida o'rtacha ballingiz 78% — bu yaxshi, lekin yaxshilash mumkin.
              Har kuni 20 daqiqa mashq qilsangiz, 2 haftada 90%ga chiqishingiz mumkin.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}