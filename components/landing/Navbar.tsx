"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { GraduationCap, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: "#features", label: "Imkoniyatlar" },
    { href: "#pricing", label: "Narxlar" },
    { href: "#faq", label: "Savollar" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b border-transparent",
        scrolled
          ? "bg-white/80 backdrop-blur-lg border-amber-100 shadow-sm py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-amber-950">
            Maktabim<span className="text-amber-500">+</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="relative text-stone-600 hover:text-amber-700 font-medium transition-colors group py-2">
              {l.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="px-5 py-2.5 rounded-xl font-semibold text-stone-700 hover:bg-amber-50 hover:text-amber-700 transition-colors">
            Kirish
          </Link>
          <Link href="/register" className="px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/30 transition-all hover:scale-105 active:scale-95">
            Boshlash
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-xl hover:bg-amber-50 transition-colors">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden border-t border-amber-100 bg-white/95 backdrop-blur-xl overflow-hidden">
            <div className="px-6 py-4 space-y-2">
              {links.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-3 px-4 rounded-xl text-stone-700 font-medium hover:bg-amber-50 hover:text-amber-700 transition-colors">
                  {l.label}
                </a>
              ))}
              <div className="pt-4 border-t border-amber-100 flex flex-col gap-2">
                <Link href="/login" className="block py-3 text-center rounded-xl font-semibold text-stone-700 border-2 border-stone-200 hover:border-amber-400 transition-colors">
                  Kirish
                </Link>
                <Link href="/register" className="block py-3 text-center rounded-xl font-semibold text-white bg-amber-500 hover:bg-amber-600 transition-colors">
                  Boshlash
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}