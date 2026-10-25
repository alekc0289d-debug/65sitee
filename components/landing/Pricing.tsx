"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Sparkles, CreditCard, Users } from "lucide-react";

export function Pricing() {
  return (
    <section id="pricing" className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">
          Narxlar
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-amber-950 mt-3 mb-4">
          Bitta narx — hamma imkoniyat
        </h2>
        <p className="text-lg text-stone-600">
          Yashirin to&apos;lovlar yo&apos;q. Faqat yiliga 5 000 so&apos;m.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Badge */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold shadow-lg z-10 whitespace-nowrap">
            ⭐ O&apos;quvchilar uchun
          </div>

          <div className="card !p-8 md:!p-10 border-2 !border-amber-400 shadow-2xl shadow-amber-500/20 rounded-3xl">
            {/* Icon + Title */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-xl shadow-amber-500/30 mb-4">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-amber-950 mb-2">
                Yillik to&apos;lov
              </h3>
              <p className="text-stone-500">Har bir o&apos;quvchi uchun</p>
            </div>

            {/* Price */}
            <div className="text-center mb-10 pb-8 border-b border-amber-100">
              <div className="flex items-end justify-center gap-2">
                <span className="text-6xl font-bold text-amber-800 leading-none">
                  5 000
                </span>
                <div className="text-left pb-2">
                  <p className="text-lg font-bold text-amber-700">so&apos;m</p>
                  <p className="text-xs text-stone-500">/ yiliga</p>
                </div>
              </div>
              <p className="text-xs text-stone-400 mt-3">
                ~417 so&apos;m / oy · Bir marta
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-8">
              <Feature text="To'liq baholar tarixi va tahlili" />
              <Feature text="Sinf va maktab reytingi" />
              <Feature text="TOP-3 oylik sovg'alar (pul yoki Premium)" />
              <Feature text="Telegram bot — kunlik xabarlar" />
              <Feature text="Ota-ona uchun alohida panel" />
              <Feature text="Davomat va ogohlantirishlar" />
              <Feature text="Testlar va topshiriqlar" />
              <Feature text="AI yordamchi — shaxsiy tavsiyalar" />
              <Feature text="Yangiliklar va e'lonlar" />
              <Feature text="Chat — o'qituvchi bilan aloqa" />
            </div>

            {/* Info note */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 mb-6">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-900">
                    Sinf admini tomonidan yig&apos;iladi
                  </p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Yillik to&apos;lov sinf admini orqali. Ota-ona uchun alohida
                    to&apos;lov yo&apos;q.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/register"
              className="btn-primary w-full text-center block"
            >
              Hoziroq boshlash
            </Link>
          </div>
        </motion.div>

        {/* Trust badges */}
        <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg mx-auto">
          <TrustBadge emoji="🔒" text="Xavfsiz" />
          <TrustBadge emoji="⚡" text="Tez" />
          <TrustBadge emoji="💚" text="Ishonchli" />
        </div>
      </div>
    </section>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Check className="w-3.5 h-3.5 text-green-600" />
      </div>
      <span className="text-sm text-stone-700">{text}</span>
    </div>
  );
}

function TrustBadge({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="text-center p-3 rounded-2xl bg-white border border-amber-100">
      <p className="text-2xl mb-1">{emoji}</p>
      <p className="text-xs font-semibold text-stone-600">{text}</p>
    </div>
  );
}