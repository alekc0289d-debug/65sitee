"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, BookOpen, GraduationCap, UserCog, Shield, Users, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-cream py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-stone-600 hover:text-amber-700 font-medium transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Bosh sahifa
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-amber-950 mb-4">Maktabim+ qanday ishlaydi?</h1>
          <p className="text-lg text-stone-600">Tizimdan foydalanish bo'yicha qo'llanma</p>
        </motion.div>

        <div className="space-y-6">
          {/* O'quvchi */}
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-amber-950">O'quvchilar uchun</h2>
            </div>
            <ul className="space-y-3 text-stone-700">
              <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green-500 mt-0.5" /> <span>Ro'yxatdan o'ting va Emaktab parolingizni kiriting.</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green-500 mt-0.5" /> <span>Telegram botga ulaning (avtomatik xabarlarni olish uchun).</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green-500 mt-0.5" /> <span>Kabinetga kirib baholaringiz, jadval va reytingni kuzatib boring.</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green-500 mt-0.5" /> <span>Testlarni yeching, topshiriqlarni bajaring va ball to'plang.</span></li>
            </ul>
          </Card>

          {/* Sinf Rahbari va Admin */}
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <UserCog className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-amber-950">Sinf rahbari va Admin uchun</h2>
            </div>
            <ul className="space-y-3 text-stone-700">
              <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green-500 mt-0.5" /> <span>Direktor tomonidan sinfga biriktirilasiz.</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green-500 mt-0.5" /> <span>Bot orqali sinf guruhingizni ulaysiz (/setgroup).</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green-500 mt-0.5" /> <span>O'quvchilar to'lovlarini yig'ib, hisobot topshirasiz.</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green-500 mt-0.5" /> <span>Dars jadvalini sayt orqali kiritasiz.</span></li>
            </ul>
          </Card>

          {/* Direktor */}
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-amber-950">Direktor va Bosh Admin uchun</h2>
            </div>
            <ul className="space-y-3 text-stone-700">
              <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green-500 mt-0.5" /> <span>Sinf rahbarlari va adminlarini tayinlaysiz.</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green-500 mt-0.5" /> <span>"Barchasini ishga tushurish" tugmasi orqali Emaktab'dan baholarni yuklatasiz.</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green-500 mt-0.5" /> <span>Favqulodda holatlarda tizimni majburiy sinxronizatsiya qilasiz.</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green-500 mt-0.5" /> <span>Umumiy reyting va moliyaviy hisobotlarni kuzatasiz.</span></li>
            </ul>
          </Card>
        </div>
      </div>
    </main>
  );
}