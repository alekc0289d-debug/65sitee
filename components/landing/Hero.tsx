"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight, Sparkles, Star, Trophy, Shield, Zap, Users, Award,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 md:pt-32 md:pb-32">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/80 border border-amber-200 text-amber-800 text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            2026-2027 o&apos;quv yili boshlanmoqda
          </motion.span>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-amber-950 leading-[1.05] mb-6">
            Maktabingizni
            <br />
            <span className="gradient-text">raqamlashtiring</span>
          </h1>

          <p className="text-lg md:text-xl text-stone-600 leading-relaxed mb-8 max-w-lg">
            Baholar, reyting, sovg&apos;alar va ota-onalar bilan aloqa — hammasi
            bitta iliq va qulay platformada.{" "}
            <span className="text-amber-700 font-medium">65-maktab</span> uchun maxsus.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/register" className="btn-primary group">
              Boshlash
              <ArrowRight className="w-4 h-4 inline ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#features" className="btn-secondary">
              Batafsil
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-stone-600">
              <Shield className="w-4 h-4 text-green-600" />
              <span>AES-256 shifrlash</span>
            </div>
            <div className="flex items-center gap-2 text-stone-600">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>Avtomatik sinxron</span>
            </div>
            <div className="flex items-center gap-2 text-stone-600">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Bepul boshlash</span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT — xususiyatlar kartalari (demo AZIZA emas!) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/20 to-transparent rounded-[2.5rem] blur-3xl" />

          <div className="relative card !p-6 md:!p-8 !rounded-[2rem]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-stone-400 uppercase tracking-wider">
                  Imkoniyatlar
                </p>
                <h3 className="text-lg font-bold text-amber-900">
                  Nimalar bor?
                </h3>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                🍂 Yangi
              </div>
            </div>

            {/* Feature cards grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <FeatureMini
                icon={<Trophy className="w-4 h-4 text-white" />}
                bg="bg-gradient-to-br from-yellow-400 to-yellow-600"
                title="Reyting"
                desc="Sinf va maktab"
              />
              <FeatureMini
                icon={<Award className="w-4 h-4 text-white" />}
                bg="bg-gradient-to-br from-amber-500 to-amber-700"
                title="Sovg'alar"
                desc="Har oy TOP-3"
              />
              <FeatureMini
                icon={<Zap className="w-4 h-4 text-white" />}
                bg="bg-gradient-to-br from-orange-400 to-red-500"
                title="Tez sinxron"
                desc="Har soatda"
              />
              <FeatureMini
                icon={<Shield className="w-4 h-4 text-white" />}
                bg="bg-gradient-to-br from-green-500 to-emerald-600"
                title="Xavfsiz"
                desc="AES-256"
              />
            </div>

            {/* Highlight box */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-white fill-white" />
                </div>
                <div>
                  <p className="text-xs text-stone-500">Narx</p>
                  <p className="text-sm font-bold text-amber-900">
                    5 000 so&apos;m / yil
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom info */}
            <div className="mt-4 flex items-center justify-between text-xs text-stone-500">
              <span>📱 Telegram bot</span>
              <span>🌐 Veb-sayt</span>
              <span>💬 AI yordamchi</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FeatureMini({
  icon, bg, title, desc,
}: {
  icon: React.ReactNode;
  bg: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="p-3 rounded-2xl bg-stone-50 border border-amber-100 hover:border-amber-300 transition-colors">
      <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-2 shadow-sm`}>
        {icon}
      </div>
      <p className="text-sm font-bold text-amber-950 leading-tight">{title}</p>
      <p className="text-[11px] text-stone-500 mt-0.5">{desc}</p>
    </div>
  );
}