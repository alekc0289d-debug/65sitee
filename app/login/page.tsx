"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, Lock, Eye, EyeOff, GraduationCap, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { login as apiLogin, saveSession } from "@/lib/api/auth";
import { formatPhone } from "@/lib/utils/format";

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ phone?: string; password?: string; general?: string }>({});

  function validate() {
    const e: typeof errors = {};
    const cleanPhone = phone.replace(/\D/g, "");
    if (!phone) e.phone = "Telefon raqamni kiriting";
    else if (cleanPhone.length < 12) e.phone = "To'liq raqamni kiriting";
    if (!password) e.password = "Parolni kiriting";
    else if (password.length < 4) e.password = "Parol kamida 4 belgi";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const res = await apiLogin(phone, password);
      if (!res.ok || !res.token || !res.user) {
        setErrors({ general: res.message || "Login yoki parol xato" });
        return;
      }

      saveSession(res.token, res.user);

      // TS xatosini tuzatish uchun optional chaining ishlatamiz (roles?.length)
      if (res.user.roles && res.user.roles.length > 1) {
        router.replace("/dashboard/select-role");
        return;
      }

      const role = res.user.role;
      if (role === "bosh_admin") router.replace("/dashboard/superadmin");
      else if (role === "director") router.replace("/dashboard/director");
      else if (role === "class_admin") router.replace("/dashboard/class-admin");
      else if (role === "teacher") router.replace("/dashboard/teacher");
      else if (role === "parent") router.replace("/dashboard/parent");
      else router.replace("/dashboard/student");

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Kirish amalga oshmadi";
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen relative flex items-center justify-center p-4 md:p-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-cream to-orange-100" />
      <div className="absolute top-20 -left-20 w-96 h-96 rounded-full bg-amber-300/20 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-orange-300/20 blur-3xl" />

      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-stone-600 hover:text-amber-700 font-medium transition-colors z-10">
        <ArrowLeft className="w-4 h-4" /> Bosh sahifa
      </Link>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md z-10">
        <div className="card !p-8 md:!p-10 !rounded-3xl bg-white/95 backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-xl shadow-amber-500/30 mb-4">
              <GraduationCap className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-amber-950 mb-2">Xush kelibsiz!</h1>
            <p className="text-stone-500">Hisobingizga kiring</p>
          </div>

          {errors.general && (
            <div className="flex items-start gap-3 p-4 mb-5 rounded-2xl bg-red-50 border border-red-200">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Telefon raqam</label>
              <div className="relative">
                <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${errors.phone ? "text-red-400" : "text-stone-400"}`} />
                <input type="tel" value={phone} disabled={loading} onChange={(e) => { setPhone(formatPhone(e.target.value)); if (errors.phone) setErrors({ ...errors, phone: undefined }); }} placeholder="+998 90 123 45 67" className={`input-field !pl-12 ${errors.phone ? "input-error" : ""}`} />
              </div>
              {errors.phone && <p className="text-sm text-red-500 mt-2 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Parol</label>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${errors.password ? "text-red-400" : "text-stone-400"}`} />
                <input type={showPass ? "text" : "password"} value={password} disabled={loading} onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: undefined }); }} placeholder="••••••••" className={`input-field !pl-12 !pr-12 ${errors.password ? "input-error" : ""}`} />
                <button type="button" onClick={() => setShowPass(!showPass)} tabIndex={-1} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-600">
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-500 mt-2 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-stone-600 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-stone-300 text-amber-500" />
                Meni eslab qol
              </label>
              <Link href="/forgot-password" className="text-amber-600 hover:text-amber-700 font-semibold">Parolni unutdingizmi?</Link>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Kirilmoqda...</> : "Kirish"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-200" /></div>
            <div className="relative flex justify-center"><span className="px-4 bg-white text-sm text-stone-400">yoki</span></div>
          </div>

          <button type="button" className="w-full py-3.5 border-2 border-stone-200 hover:border-amber-300 hover:bg-amber-50/50 rounded-2xl font-medium text-stone-700 transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
            <span className="text-xl">✈️</span> Telegram orqali kirish
          </button>

          <p className="text-center mt-6 text-stone-600 text-sm">
            Hisobingiz yo&apos;qmi? <Link href="/register" className="text-amber-600 hover:text-amber-700 font-bold">Ro&apos;yxatdan o&apos;tish</Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}