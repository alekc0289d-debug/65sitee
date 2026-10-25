"use client";

import { motion } from "framer-motion";
import {
  BookOpen, Trophy, Gift, MessageCircle, Calendar, Sparkles,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Baholar",
    desc: "Real vaqtda emaktab'dan avtomatik yuklanadi. Har bir baho, har bir fan — nazoratda.",
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
  {
    icon: Trophy,
    title: "Reyting",
    desc: "Sinf va maktab bo'yicha TOP o'quvchilar. O'sishni ko'rib, rag'bat toping.",
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
  {
    icon: Gift,
    title: "Sovg'alar",
    desc: "Har oy TOP-3 uchun pul yoki Telegram Premium. Motivatsiya — doimiy.",
    color: "text-yellow-600",
    bg: "bg-yellow-100",
  },
  {
    icon: MessageCircle,
    title: "Chat",
    desc: "O'qituvchi, o'quvchi va ota-ona o'rtasida tez va qulay aloqa.",
    color: "text-red-500",
    bg: "bg-red-100",
  },
  {
    icon: Calendar,
    title: "Davomat",
    desc: "Avtomatik kuzatish. Kunlik, haftalik va oylik xulosalar.",
    color: "text-amber-700",
    bg: "bg-amber-100",
  },
  {
    icon: Sparkles,
    title: "AI Yordamchi",
    desc: "Har bir o'quvchi uchun shaxsiy tavsiyalar. \"Qanday yaxshilanaman?\"",
    color: "text-orange-500",
    bg: "bg-orange-100",
  },
];

export function Features() {
  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">
          Imkoniyatlar
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-amber-950 mt-3 mb-4">
          Hammasi bitta joyda
        </h2>
        <p className="text-lg text-stone-600">
          O'quvchi, ota-ona, o'qituvchi va direktor uchun qulay vositalar
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="card card-hover group"
          >
            <div
              className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
            >
              <f.icon className={`w-7 h-7 ${f.color}`} />
            </div>
            <h3 className="text-xl font-bold text-amber-950 mb-2">
              {f.title}
            </h3>
            <p className="text-stone-600 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}