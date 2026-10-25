"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-24">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-500 to-amber-700 p-12 text-center text-white shadow-2xl shadow-amber-500/30">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, white 0%, transparent 50%), radial-gradient(circle at 80% 70%, white 0%, transparent 50%)",
          }}
        />
        <div className="relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Bugun boshlang
          </h2>
          <p className="text-lg text-amber-50 mb-8 max-w-xl mx-auto">
            Ro'yxatdan o'ting va farzandingizning o'qishini bir zumda kuzatib
            boring
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-700 rounded-2xl font-bold hover:bg-amber-50 transition-colors shadow-xl"
          >
            Bepul boshlash
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}