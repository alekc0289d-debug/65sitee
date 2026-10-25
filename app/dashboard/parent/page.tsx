"use client";

import { motion } from "framer-motion";
import {
  Users, TrendingUp, AlertTriangle, MessageCircle,
  CreditCard, CheckCircle, ArrowRight, Heart,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import Link from "next/link";

const children = [
  {
    id: "c1",
    name: "Aziza Karimova",
    classId: "9-A",
    avg: 4.7,
    growth: 5,
    attendance: 96,
    todayGrades: [5, 4, 5],
  },
  {
    id: "c2",
    name: "Bobur Karimov",
    classId: "7-B",
    avg: 4.3,
    growth: 3,
    attendance: 92,
    todayGrades: [4, 4],
  },
];

const alerts = [
  {
    type: "warning",
    title: "Fizika fanidan pasayish",
    desc: "Aziza'ning fizika bahosi oxirgi haftada 4.2 dan 3.8 ga tushdi",
    time: "2 soat oldin",
  },
  {
    type: "info",
    title: "Uy vazifasi kechikdi",
    desc: "Bobur kechagi matematika vazifasini topshirmadi",
    time: "Kecha",
  },
];

const messages = [
  {
    teacher: "Tursinova M.A.",
    subject: "Matematika o'qituvchisi",
    text: "Aziza bugun matematikadan ajoyib javob berdi! Rag'batlantirish kerak.",
    time: "1 soat oldin",
    unread: true,
  },
  {
    teacher: "Samadova Y.S.",
    subject: "Fizika o'qituvchisi",
    text: "Farzandingizga fizika bo'yicha qo'shimcha mashg'ulot kerak.",
    time: "Kecha",
    unread: false,
  },
];

export default function ParentDashboard() {
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
            Farzandlarim 👨‍👩‍👧
          </h1>
          <p className="text-stone-500 mt-1">
            {children.length} ta farzandingiz kuzatilmoqda
          </p>
        </div>
        <Badge variant="success" className="!text-base !px-4 !py-2">
          💚 Hammasi yaxshi
        </Badge>
      </motion.div>

      {/* Children cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {children.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card hover className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-transparent rounded-full blur-2xl" />

              <div className="relative">
                {/* Avatar + name */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-amber-500/30">
                    {c.name[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-amber-950">
                      {c.name}
                    </h3>
                    <p className="text-sm text-stone-500">{c.classId} sinf</p>
                  </div>
                  <Badge variant="amber">{c.avg}</Badge>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="p-3 rounded-2xl bg-amber-50 text-center">
                    <p className="text-xs text-stone-500 mb-1">O'rtacha</p>
                    <p className="text-lg font-bold text-amber-800">{c.avg}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-green-50 text-center">
                    <p className="text-xs text-stone-500 mb-1">O'sish</p>
                    <p className="text-lg font-bold text-green-700">
                      +{c.growth}%
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-blue-50 text-center">
                    <p className="text-xs text-stone-500 mb-1">Davomat</p>
                    <p className="text-lg font-bold text-blue-700">
                      {c.attendance}%
                    </p>
                  </div>
                </div>

                {/* Today's grades */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-stone-500">Bugun:</span>
                  <div className="flex gap-1.5">
                    {c.todayGrades.map((g, idx) => (
                      <span
                        key={idx}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white text-sm ${
                          g === 5
                            ? "bg-green-500"
                            : g === 4
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-stone-600">O'zlashtirish</span>
                    <span className="font-bold text-amber-700">
                      {c.attendance}%
                    </span>
                  </div>
                  <Progress value={c.attendance} color="amber" />
                </div>

                <Link
                  href={`/dashboard/children/${c.id}`}
                  className="btn-secondary w-full flex items-center justify-center gap-2 !py-3"
                >
                  Batafsil
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Alerts + Messages */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <Card>
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-bold text-amber-950">
              Ogohlantirishlar
            </h3>
            <Badge variant="warning" size="sm">
              {alerts.length}
            </Badge>
          </div>

          <div className="space-y-3">
            {alerts.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-4 rounded-2xl border-2 ${
                  a.type === "warning"
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      a.type === "warning"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-blue-200 text-blue-800"
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-stone-800">
                      {a.title}
                    </p>
                    <p className="text-xs text-stone-600 mt-1">{a.desc}</p>
                    <p className="text-xs text-stone-400 mt-2">{a.time}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Messages */}
        <Card>
          <div className="flex items-center gap-2 mb-5">
            <MessageCircle className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-bold text-amber-950">
              O'qituvchilardan
            </h3>
            <Badge variant="danger" size="sm">
              {messages.filter((m) => m.unread).length} yangi
            </Badge>
          </div>

          <div className="space-y-3">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-4 rounded-2xl transition-colors cursor-pointer ${
                  m.unread
                    ? "bg-amber-50 border border-amber-200"
                    : "hover:bg-amber-50/50"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="font-semibold text-sm text-amber-950">
                      {m.teacher}
                    </p>
                    <p className="text-xs text-stone-500">{m.subject}</p>
                  </div>
                  <span className="text-xs text-stone-400 whitespace-nowrap">
                    {m.time}
                  </span>
                </div>
                <p className="text-sm text-stone-700 leading-relaxed">
                  {m.text}
                </p>
              </motion.div>
            ))}
          </div>

          <Button variant="secondary" className="w-full mt-4">
            Barcha xabarlar
          </Button>
        </Card>
      </div>

      {/* Payments */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 !border-amber-200">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30 flex-shrink-0">
              <CreditCard className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-950">
                Yillik to'lov
              </h3>
              <p className="text-sm text-stone-600 mt-1">
                Har bir farzand uchun 5 000 so'm (yiliga)
              </p>
              <div className="flex gap-4 mt-3 text-sm">
                <div className="flex items-center gap-1.5 text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-semibold">2 / 2 to'langan</span>
                </div>
              </div>
            </div>
          </div>
          <Button>
            <CreditCard className="w-4 h-4" />
            Batafsil
          </Button>
        </div>
      </Card>

      {/* Tip */}
      <Card className="bg-gradient-to-br from-pink-50 to-rose-50 !border-pink-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-500 flex items-center justify-center flex-shrink-0">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-pink-900 mb-1">
              Ota-ona maslahati
            </h3>
            <p className="text-sm text-pink-800 leading-relaxed">
              Farzandingizning muvaffaqiyatini har kuni 5 daqiqa suhbat bilan
              rag'batlantiring. Tadqiqotlar ko'rsatishicha, ota-ona e'tibori
              o'quv natijalarini 30%ga yaxshilaydi.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}