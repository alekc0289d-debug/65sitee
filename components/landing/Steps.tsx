"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const steps = [
  { title: "Ro'yxatdan o'ting", desc: "4 qadamda shaxsiy va ota-ona ma'lumotlari" },
  { title: "Emaktab bog'lang", desc: "Login va parolni xavfsiz kiriting" },
  { title: "Sinxron kuting", desc: "Barcha baholar avtomatik yuklanadi" },
  { title: "Kuzatib boring", desc: "Statistika, reyting va sovg'alar" },
];

export function Steps() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">
          Qanday ishlaydi
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-amber-950 mt-3 mb-4">
          4 qadamda tayyor
        </h2>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {steps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative"
          >
            <div className="card text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center font-bold text-lg mb-4 shadow-lg shadow-amber-500/30">
                {i + 1}
              </div>
              <h3 className="font-bold text-amber-950 mb-2">{s.title}</h3>
              <p className="text-sm text-stone-600">{s.desc}</p>
            </div>
            {i < steps.length - 1 && (
              <ArrowRight className="hidden md:block absolute top-1/2 -right-3 w-6 h-6 text-amber-300" />
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}