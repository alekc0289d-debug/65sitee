"use client";

import { motion } from "framer-motion";
import {
  Users, BookOpen, TrendingUp, AlertTriangle, CheckCircle,
  MessageCircle, FileText, Award, Calendar,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/dashboard/StatCard";
import { Progress } from "@/components/ui/Progress";

const classes = [
  { id: "9-A", students: 28, avg: 4.5, attendance: 96 },
  { id: "9-B", students: 26, avg: 4.2, attendance: 92 },
  { id: "10-A", students: 24, avg: 4.6, attendance: 94 },
];

const topStudents = [
  { rank: 1, name: "Aziza Karimova", classId: "9-A", score: 5.0 },
  { rank: 2, name: "Sardor Aliyev", classId: "9-A", score: 4.9 },
  { rank: 3, name: "Dilnoza Yusupova", classId: "10-A", score: 4.8 },
  { rank: 4, name: "Bobur Karimov", classId: "9-B", score: 4.7 },
];

const struggling = [
  {
    name: "Jasur Toshmatov",
    classId: "9-A",
    subject: "Algebra",
    score: 3.2,
    issue: "Oxirgi 3 ta nazorat ishida past",
  },
  {
    name: "Nilufar Sattorova",
    classId: "9-B",
    subject: "Geometriya",
    score: 3.5,
    issue: "Uy vazifalarini tez-tez qoldiradi",
  },
];

const todayLessons = [
  { time: "08:00 - 08:45", class: "9-A", subject: "Algebra", room: "7-xona" },
  { time: "09:40 - 10:25", class: "9-B", subject: "Geometriya", room: "7-xona" },
  { time: "11:25 - 12:10", class: "10-A", subject: "Algebra", room: "8-xona" },
];

export default function TeacherDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-amber-950">
            Tursinova M.A. 👨‍🏫
          </h1>
          <p className="text-stone-500 mt-1">
            Matematika o'qituvchisi · 3 ta sinf
          </p>
        </div>
        <Badge variant="amber" className="!text-base !px-4 !py-2">
          📚 Bugun 3 ta dars
        </Badge>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="O'quvchilar"
          value={78}
          icon={<Users className="w-6 h-6" />}
          color="blue"
          delay={0}
        />
        <StatCard
          label="O'rtacha"
          value="4.4"
          icon={<TrendingUp className="w-6 h-6" />}
          trend={6}
          color="amber"
          delay={0.1}
        />
        <StatCard
          label="Davomat"
          value="94%"
          icon={<CheckCircle className="w-6 h-6" />}
          color="green"
          delay={0.2}
        />
        <StatCard
          label="Muammoli"
          value={2}
          icon={<AlertTriangle className="w-6 h-6" />}
          color="red"
          delay={0.3}
        />
      </div>

      {/* Today's lessons */}
      <Card>
        <div className="flex items-center gap-2 mb-5">
          <Calendar className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-bold text-amber-950">
            Bugungi darslar
          </h3>
        </div>
        <div className="space-y-3">
          {todayLessons.map((l, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-transparent border-l-4 border-amber-400"
            >
              <div className="text-center flex-shrink-0 w-24">
                <p className="text-xs text-stone-500">Vaqt</p>
                <p className="text-sm font-bold text-amber-700">{l.time}</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-amber-950">
                  {l.subject}
                </p>
                <p className="text-xs text-stone-500">
                  {l.class} · {l.room}
                </p>
              </div>
              <Button size="sm" variant="secondary">
                Davomat
              </Button>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Classes */}
      <div className="grid md:grid-cols-3 gap-4">
        {classes.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card hover>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold shadow-lg shadow-amber-500/30">
                  {c.id}
                </div>
                <Badge variant="amber">{c.avg}</Badge>
              </div>
              <p className="text-sm text-stone-500 mb-1">O'quvchilar</p>
              <p className="text-2xl font-bold text-amber-950 mb-4">
                {c.students}
              </p>
              <div className="mb-2 flex justify-between text-xs">
                <span className="text-stone-600">Davomat</span>
                <span className="font-bold text-green-700">
                  {c.attendance}%
                </span>
              </div>
              <Progress value={c.attendance} color="green" size="sm" />
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Top + Struggling */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top students */}
        <Card>
          <div className="flex items-center gap-2 mb-5">
            <Award className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-bold text-amber-950">
              TOP o'quvchilar
            </h3>
          </div>
          <div className="space-y-2">
            {topStudents.map((s) => (
              <div
                key={s.rank}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-amber-50/50 transition-colors"
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                    s.rank === 1
                      ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white"
                      : s.rank === 2
                      ? "bg-gradient-to-br from-stone-300 to-stone-400 text-white"
                      : s.rank === 3
                      ? "bg-gradient-to-br from-amber-500 to-amber-700 text-white"
                      : "bg-stone-100 text-stone-500"
                  }`}
                >
                  {s.rank}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-amber-950">
                    {s.name}
                  </p>
                  <p className="text-xs text-stone-500">{s.classId}</p>
                </div>
                <span className="text-lg font-bold text-amber-700">
                  {s.score}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Struggling */}
        <Card>
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-bold text-amber-950">
              Diqqat talab qiladi
            </h3>
            <Badge variant="danger" size="sm">
              {struggling.length}
            </Badge>
          </div>
          <div className="space-y-3">
            {struggling.map((s, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-red-50 border border-red-200"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="font-semibold text-sm text-red-900">
                      {s.name}
                    </p>
                    <p className="text-xs text-red-700">
                      {s.classId} · {s.subject}
                    </p>
                  </div>
                  <Badge variant="danger" size="sm">
                    {s.score}
                  </Badge>
                </div>
                <p className="text-xs text-red-800">{s.issue}</p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="danger" className="flex-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    Ota-onaga
                  </Button>
                  <Button size="sm" variant="secondary" className="flex-1">
                    Batafsil
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <h3 className="text-lg font-bold text-amber-950 mb-4">
          Tezkor amallar
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: BookOpen, label: "Baho qo'yish", color: "amber" },
            { icon: CheckCircle, label: "Davomat", color: "green" },
            { icon: MessageCircle, label: "Xabar yuborish", color: "blue" },
            { icon: FileText, label: "Hisobot", color: "orange" },
          ].map((a, i) => (
            <button
              key={i}
              className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-100 transition-all text-center active:scale-[0.98]"
            >
              <a.icon className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-amber-900">{a.label}</p>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}