"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Xavfsizlik qanday ta'minlanadi?",
    a: "Barcha ma'lumotlar AES-256 bilan shifrlanadi. Emaktab parolingiz shifrlangan holda saqlanadi va hech kimga ko'rinmaydi. Trafik HTTPS orqali.",
  },
  {
    q: "Emaktab bilan qanday bog'lanadi?",
    a: "Siz emaktab login va parolingizni kiritasiz. Tizim avtomatik ravishda sizning hisobingizdan baholarni, fanlarni va jadvalni yuklaydi. Baholar o'zgartirilmaydi — faqat tahlil qilinadi.",
  },
  {
    q: "Sovg'alar qanday beriladi?",
    a: "Har oy oxirida TOP-3 o'quvchi aniqlanadi. Ular pul yoki 1 oy Telegram Premium tanlaydi. Superadmin tasdiqlagach sovg'a beriladi.",
  },
  {
    q: "Narxlar qanday hisoblanadi?",
    a: "Yiliga 5 000 so'm — o'quvchi uchun. Bu sinf admini tomonidan yig'iladi va maktabga topshiriladi. Premium obuna — ixtiyoriy, qo'shimcha imkoniyatlar uchun.",
  },
  {
    q: "Farzandimni qanday kuzataman?",
    a: "Telegram bot yoki sayt orqali. Har kuni 20:00 da kunlik hisobot keladi. Muhim o'zgarishlar (2 baho, davomat) darhol xabar qilinadi.",
  },
  {
    q: "Hisobni qanday o'chiraman?",
    a: "Sozlamalar → Xavfsizlik → Hisobni o'chirish. Barcha ma'lumotlar (baholar, shaxsiy ma'lumotlar) darhol o'chiriladi va qaytarilmaydi.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="card !p-0 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-amber-50/50 transition-colors"
      >
        <span className="font-semibold text-amber-950 pr-4">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-amber-500 flex-shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-5 pb-5 text-stone-600 leading-relaxed">{a}</div>
      </motion.div>
    </div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="max-w-3xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">
          Savollar
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-amber-950 mt-3 mb-4">
          Ko'p so'raladigan savollar
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((f, i) => (
          <FAQItem key={i} q={f.q} a={f.a} />
        ))}
      </div>
    </section>
  );
}