"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  Phone, ArrowLeft, Loader2, Check, Key, Bot,
  AlertCircle, Send, ExternalLink,
} from "lucide-react";
import { forgotPassword } from "@/lib/api/auth";
import { formatPhone, initialPhone } from "@/lib/utils/format";

const BOT_LINK = "https://t.me/maktabim65_bot";

type ResultState =
  | { type: "success"; message: string }
  | { type: "bot_not_connected"; message: string; botLink: string }
  | { type: "bot_blocked"; message: string; botLink: string }
  | { type: "send_failed"; message: string }
  | null;

export default function ForgotPasswordPage() {
  const [phone, setPhone] = useState(initialPhone());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ResultState>(null);

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setError("");

    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length < 12) {
      setError("To'liq telefon raqamni kiriting");
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPassword(phone);

      // Botga ulanmagan
      if (!res.ok && (res as any).code === "BOT_NOT_CONNECTED") {
        setResult({
          type: "bot_not_connected",
          message: (res as any).message || "Avval botga ulaning",
          botLink: (res as any).botLink || BOT_LINK,
        });
        return;
      }

      // Bloklangan
      if (!res.ok && (res as any).code === "BOT_BLOCKED") {
        setResult({
          type: "bot_blocked",
          message: (res as any).message || "Bot bloklangan",
          botLink: (res as any).botLink || BOT_LINK,
        });
        return;
      }

      // Yuborishda xato
      if (!res.ok) {
        setResult({
          type: "send_failed",
          message: (res as any).message || "Xatolik",
        });
        return;
      }

      // Muvaffaqiyat
      setResult({
        type: "success",
        message: res.message || "Yangi parol Telegram botga yuborildi",
      });

    } catch (e) {
      setError(e instanceof Error ? e.message : "Server bilan aloqa yo'q");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setPhone(initialPhone());
    setError("");
  }

  return (
    <main className="min-h-screen relative flex items-center justify-center p-4 md:p-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-cream to-orange-100" />
      <div className="absolute top-20 -left-20 w-96 h-96 rounded-full bg-amber-300/20 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-orange-300/20 blur-3xl" />

      <Link href="/login" className="absolute top-6 left-6 flex items-center gap-2 text-stone-600 hover:text-amber-700 font-medium transition-colors z-10">
        <ArrowLeft className="w-4 h-4" /> Kirish sahifasi
      </Link>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md z-10">
        <div className="card !p-8 md:!p-10 !rounded-3xl bg-white/95 backdrop-blur-sm">
          {!result && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-xl shadow-amber-500/30 mb-4">
                  <Key className="w-9 h-9 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-amber-950 mb-2">Parolni tiklash</h1>
                <p className="text-stone-500 text-sm">
                  Yangi parol <b>Telegram bot</b> orqali yuboriladi
                </p>
              </div>

              {/* Bot info */}
              <div className="flex items-start gap-3 p-4 mb-5 rounded-2xl bg-blue-50 border border-blue-200">
                <Bot className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-900">
                    Avval botga ulangan bo&apos;lishingiz kerak
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Parol faqatgina Telegram bot orqali yuboriladi
                  </p>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 mb-5 rounded-2xl bg-red-50 border border-red-200">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">
                    Telefon raqam
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <input
                      type="tel"
                      inputMode="tel"
                      value={phone}
                      disabled={loading}
                      onChange={(e) => {
                        const c = e.target.value.replace(/\D/g, "");
                        if (c.length === 0) { setPhone(initialPhone()); return; }
                        setPhone(formatPhone(e.target.value));
                      }}
                      onFocus={() => {
                        if (!phone.trim() || phone.trim() === "+998") {
                          setPhone(initialPhone());
                        }
                      }}
                      placeholder="+998 90 123 45 67"
                      className="input-field !pl-12"
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Yuborilmoqda...</>
                  ) : (
                    <><Send className="w-5 h-5" /> Parolni botga yuborish</>
                  )}
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white text-sm text-stone-400">yoki</span>
                </div>
              </div>

              <a
                href={BOT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 rounded-2xl font-medium text-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <Bot className="w-5 h-5" />
                Botga ulanish
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </>
          )}

          {/* SUCCESS */}
          {result?.type === "success" && (
            <div className="text-center py-4">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
                className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30 mb-6">
                <Check className="w-10 h-10 text-white" />
              </motion.div>

              <h2 className="text-2xl font-bold text-amber-950 mb-2">Yuborildi! 🎉</h2>
              <p className="text-stone-600 text-sm mb-6">{result.message}</p>

              <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-200 mb-6">
                <Bot className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <p className="text-sm text-amber-800">
                  Telegram botni oching va yangi parolingizni ko&apos;ring
                </p>
              </div>

              <div className="space-y-2">
                <a href={BOT_LINK} target="_blank" rel="noopener noreferrer"
                  className="btn-primary w-full flex items-center justify-center gap-2">
                  <Bot className="w-5 h-5" /> Botni ochish
                </a>
                <Link href="/login" className="btn-secondary w-full block text-center">
                  Kirish sahifasiga o&apos;tish
                </Link>
              </div>
            </div>
          )}

          {/* BOT NOT CONNECTED */}
          {result?.type === "bot_not_connected" && (
            <div className="text-center py-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <Bot className="w-10 h-10 text-blue-500" />
              </div>

              <h2 className="text-xl font-bold text-amber-950 mb-2">Botga ulanmagansiz</h2>
              <p className="text-stone-600 text-sm mb-6">{result.message}</p>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-left mb-6">
                <p className="text-sm font-semibold text-blue-900 mb-2">
                  Qanday qilib botga ulanaman?
                </p>
                <ol className="text-xs text-blue-700 space-y-1.5 list-decimal list-inside">
                  <li>Quyidagi tugmani bosing</li>
                  <li>Telegram botda <code className="bg-white px-1 rounded">/start</code> bosing</li>
                  <li>&quot;📱 Telefon raqamni yuborish&quot; tugmasini bosing</li>
                  <li>Shundan keyin bu sahifaga qaytib, yana urinib ko&apos;ring</li>
                </ol>
              </div>

              <div className="space-y-2">
                <a href={result.botLink} target="_blank" rel="noopener noreferrer"
                  className="btn-primary w-full flex items-center justify-center gap-2">
                  <Bot className="w-5 h-5" /> Botga ulanish
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button onClick={reset} className="btn-secondary w-full">
                  Qayta urinish
                </button>
              </div>
            </div>
          )}

          {/* BOT BLOCKED */}
          {result?.type === "bot_blocked" && (
            <div className="text-center py-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-6">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>

              <h2 className="text-xl font-bold text-red-900 mb-2">Bot bloklangan</h2>
              <p className="text-stone-600 text-sm mb-6">{result.message}</p>

              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-left mb-6">
                <p className="text-sm text-red-800">
                  Botni Telegram ilovangizda <b>blokdan chiqarib</b>, keyin
                  qayta urinib ko&apos;ring.
                </p>
              </div>

              <div className="space-y-2">
                <a href={result.botLink} target="_blank" rel="noopener noreferrer"
                  className="btn-primary w-full flex items-center justify-center gap-2">
                  <Bot className="w-5 h-5" /> Botni ochish
                </a>
                <button onClick={reset} className="btn-secondary w-full">
                  Qayta urinish
                </button>
              </div>
            </div>
          )}

          {/* SEND FAILED */}
          {result?.type === "send_failed" && (
            <div className="text-center py-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-6">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>

              <h2 className="text-xl font-bold text-red-900 mb-2">Xatolik</h2>
              <p className="text-sm text-red-700 mb-6">{result.message}</p>

              <div className="space-y-2">
                <button onClick={reset} className="btn-primary w-full">
                  Qayta urinish
                </button>
                <a href={BOT_LINK} target="_blank" rel="noopener noreferrer"
                  className="btn-secondary w-full flex items-center justify-center gap-2">
                  <Bot className="w-4 h-4" /> Botni tekshirish
                </a>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </main>
  );
}