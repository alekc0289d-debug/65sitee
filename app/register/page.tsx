"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User, Lock, Check, ArrowLeft, ArrowRight,
  AlertCircle, Eye, EyeOff, Loader2, GraduationCap, Shield,
  PhoneCall,
} from "lucide-react";
import { register, registerStatus } from "@/lib/api/auth";
import { listClasses, type ClassItem } from "@/lib/api/classes";
import { formatPhone, initialPhone } from "@/lib/utils/format";

// ============================================================
// Tiplar
// ============================================================
type FormData = {
  firstName: string;
  lastName: string;
  classId: string;
  studentPhone: string;
  fatherPhone: string;
  motherPhone: string;
  emaktabLogin: string;
  emaktabPassword: string;
  terms: boolean;
  encryption: boolean;
  parentsNotified: boolean;
};

type Phase = "form" | "processing" | "done" | "error";

const STEPS = ["Shaxsiy", "Telefonlar", "Emaktab", "Shartlar"];

function cleanPhone(p: string): string {
  return p.replace(/\D/g, "");
}

function handlePhoneChange(
  value: string,
  updateFn: (v: string) => void
) {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length === 0) {
    updateFn(initialPhone());
    return;
  }
  updateFn(formatPhone(value));
}

// ============================================================
// Sahifa
// ============================================================
export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>("form");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("Boshlanmoqda...");
  const [result, setResult] = useState<{ fullName: string } | null>(null);

  // Sinflar
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [classesLoading, setClassesLoading] = useState(true);

  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    classId: "",
    studentPhone: initialPhone(),
    fatherPhone: initialPhone(),
    motherPhone: initialPhone(),
    emaktabLogin: "",
    emaktabPassword: "",
    terms: false,
    encryption: false,
    parentsNotified: false,
  });

  // ============================================================
  // Sinflarni yuklash
  // ============================================================
  useEffect(() => {
    let cancelled = false;
    setClassesLoading(true);
    listClasses(true)
      .then((res) => {
        if (!cancelled) setClasses(Array.isArray(res) ? res : []);
      })
      .catch(() => {
        if (!cancelled) setClasses([]);
      })
      .finally(() => {
        if (!cancelled) setClassesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function update<K extends keyof FormData>(key: K, val: FormData[K]) {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key as string]) {
      setErrors((e) => {
        const c = { ...e };
        delete c[key as string];
        return c;
      });
    }
  }

  // ============================================================
  // Validatsiya (Sinf Majburiy!)
  // ============================================================
  function validateStep(): boolean {
    const e: Record<string, string> = {};

    if (step === 0) {
      if (!form.firstName.trim()) e.firstName = "Ismni kiriting";
      else if (form.firstName.trim().length < 2) e.firstName = "Ism juda qisqa";

      if (!form.lastName.trim()) e.lastName = "Familiyani kiriting";
      else if (form.lastName.trim().length < 2) e.lastName = "Familiya juda qisqa";

      // SINIF MAJBURIY!
      if (!form.classId.trim()) {
        e.classId = "Sinfni tanlang yoki kiriting";
      }
    }

    if (step === 1) {
      const sp = cleanPhone(form.studentPhone);
      const fp = cleanPhone(form.fatherPhone);
      const mp = cleanPhone(form.motherPhone);

      if (sp.length < 12) e.studentPhone = "To'liq raqamni kiriting (+998 XX XXX XX XX)";
      if (fp.length < 12) e.fatherPhone = "To'liq raqamni kiriting";
      if (mp.length < 12) e.motherPhone = "To'liq raqamni kiriting";

      if (sp && fp && sp === fp) e.fatherPhone = "Ota va o'quvchi raqami bir xil bo'lmasin";
      if (sp && mp && sp === mp) e.motherPhone = "Ona va o'quvchi raqami bir xil bo'lmasin";
      if (fp && mp && fp === mp) e.motherPhone = "Ota va ona raqami bir xil bo'lmasin";
    }

    if (step === 2) {
      if (!form.emaktabLogin.trim()) e.emaktabLogin = "Login kiriting";
      else if (form.emaktabLogin.trim().length < 4) e.emaktabLogin = "Login juda qisqa";

      if (!form.emaktabPassword) e.emaktabPassword = "Parolni kiriting";
      else if (form.emaktabPassword.length < 4) e.emaktabPassword = "Parol kamida 4 ta belgi";
    }

    if (step === 3) {
      if (!form.terms) e.terms = "Shartlarga rozilik bering";
      if (!form.encryption) e.encryption = "Shifrlashga rozilik bering";
      if (!form.parentsNotified) e.parentsNotified = "Ota-ona xabardorligini tasdiqlang";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (validateStep()) setStep((s) => Math.min(s + 1, 3));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  // ============================================================
  // Yuborish
  // ============================================================
  async function submit() {
    if (!validateStep()) return;

    setLoading(true);
    setPhase("processing");
    setProgress(2);
    setProgressMsg("So'rov yuborilmoqda...");
    setErrors({});

    try {
      const payload = {
        fullName: `${form.firstName} ${form.lastName}`.trim(),
        login: form.emaktabLogin.trim(),
        password: form.emaktabPassword,
        phone: form.studentPhone,
        motherPhone: form.motherPhone,
        fatherPhone: form.fatherPhone,
        classId: form.classId,
        consent: form.terms,
      };

      const res = await register(payload);
      const taskId = res.task_id;
      if (!taskId) throw new Error("Task ID olinmadi. Server xato.");

      let attempts = 0;
      const maxAttempts = 400; // ~10 daqiqa

      const interval = setInterval(async () => {
        attempts++;
        try {
          const s = await registerStatus(taskId);
          setProgress(s.progress || 0);
          setProgressMsg(s.message || "Tekshirilmoqda...");

          if (s.status === "done") {
            clearInterval(interval);
            setResult({
              fullName:
                s.result?.student?.fullName ||
                `${form.firstName} ${form.lastName}`,
            });
            setPhase("done");
            setLoading(false);
          } else if (s.status === "error") {
            clearInterval(interval);
            setErrors({ general: s.message || "Xatolik yuz berdi" });
            setPhase("error");
            setLoading(false);
          } else if (attempts >= maxAttempts) {
            clearInterval(interval);
            setErrors({ general: "Jarayon juda uzoq davom etdi. Qayta urinib ko'ring." });
            setPhase("error");
            setLoading(false);
          }
        } catch (pollErr) {
          console.warn("[POLL] Xato:", pollErr);
        }
      }, 1500);

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Xatolik yuz berdi. Server ishlayaptimi?";
      setErrors({ general: msg });
      setPhase("error");
      setLoading(false);
    }
  }

  function reset() {
    setPhase("form");
    setStep(0);
    setProgress(0);
    setErrors({});
    setResult(null);
  }

  // ============================================================
  // Render
  // ============================================================
  return (
    <main className="min-h-screen relative py-8 px-4 md:py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-cream to-orange-100" />
      <div className="absolute top-0 -left-20 w-96 h-96 rounded-full bg-amber-300/20 blur-3xl" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 rounded-full bg-orange-300/20 blur-3xl" />

      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-stone-600 hover:text-amber-700 font-medium transition-colors z-10">
        <ArrowLeft className="w-4 h-4" /> Bosh sahifa
      </Link>

      <div className="relative max-w-lg mx-auto z-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/30 mb-3">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-amber-950">Ro&apos;yxatdan o&apos;tish</h1>
          <p className="text-stone-500 mt-1">4 qadamda boshlang</p>
        </div>

        {/* Progress dots */}
        {phase === "form" && (
          <div className="flex items-center justify-between mb-8 px-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-shrink-0">
                  <motion.div
                    animate={{
                      scale: i === step ? 1.1 : 1,
                      backgroundColor: i < step ? "#22c55e" : i === step ? "#f59e0b" : "#e7e5e4",
                    }}
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold shadow-md"
                  >
                    {i < step ? <Check className="w-5 h-5" /> : i + 1}
                  </motion.div>
                  <span className={`text-[10px] mt-1.5 font-medium ${i <= step ? "text-amber-700" : "text-stone-400"}`}>{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-1 mx-1 mb-5 rounded-full bg-stone-200 overflow-hidden">
                    <motion.div animate={{ width: i < step ? "100%" : "0%" }} transition={{ duration: 0.4 }} className="h-full bg-gradient-to-r from-green-400 to-green-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="card !p-6 md:!p-8 !rounded-3xl bg-white/95 backdrop-blur-sm">
          {errors.general && phase === "form" && (
            <div className="flex items-start gap-3 p-4 mb-5 rounded-2xl bg-red-50 border border-red-200">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{errors.general}</p>
            </div>
          )}

          {phase === "form" && (
            <>
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                  
                  {/* STEP 0 — Shaxsiy */}
                  {step === 0 && (
                    <div className="space-y-5">
                      <StepHeader icon={<User className="w-5 h-5 text-amber-600" />} title="Shaxsiy ma'lumotlar" subtitle="O'zingiz haqingizda" />
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-semibold text-stone-700 mb-2">Ism <span className="text-amber-600">*</span></label>
                          <input value={form.firstName} onChange={(e) => update("firstName", e.target.value)} placeholder="Aziza" className={`input-field ${errors.firstName ? "input-error" : ""}`} autoFocus />
                          {errors.firstName && <ErrorText t={errors.firstName} />}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-stone-700 mb-2">Familiya <span className="text-amber-600">*</span></label>
                          <input value={form.lastName} onChange={(e) => update("lastName", e.target.value)} placeholder="Karimova" className={`input-field ${errors.lastName ? "input-error" : ""}`} />
                          {errors.lastName && <ErrorText t={errors.lastName} />}
                        </div>
                      </div>
                      
                      <div>
                        {/* SINIF MAJBURIY! */}
                        <label className="block text-sm font-semibold text-stone-700 mb-2">Sinf <span className="text-amber-600">*</span></label>
                        {classesLoading ? (
                          <div className="input-field flex items-center gap-2 text-stone-400">
                            <Loader2 className="w-4 h-4 animate-spin" /> Sinflar yuklanmoqda...
                          </div>
                        ) : classes.length === 0 ? (
                          <input
                            value={form.classId}
                            onChange={(e) => update("classId", e.target.value)}
                            placeholder="Masalan: 9-A"
                            className={`input-field ${errors.classId ? "input-error" : ""}`}
                          />
                        ) : (
                          <select value={form.classId} onChange={(e) => update("classId", e.target.value)} className={`input-field ${errors.classId ? "input-error" : ""}`}>
                            <option value="">Sinfni tanlang</option>
                            {classes.map((c) => (
                              <option key={c.classId} value={c.classId}>{c.classId} {c.description ? `— ${c.description}` : ""}</option>
                            ))}
                          </select>
                        )}
                        {errors.classId && <ErrorText t={errors.classId} />}
                      </div>
                    </div>
                  )}

                  {/* STEP 1 — Telefonlar */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <StepHeader icon={<PhoneCall className="w-5 h-5 text-amber-600" />} title="Telefon raqamlar" subtitle="3 ta alohida raqam" />
                      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 text-sm text-amber-800">
                        💡 Uch raqam bir-biridan <b>farqli</b> bo&apos;lishi shart
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">O&apos;quvchining raqami <span className="text-amber-600">*</span></label>
                        <input type="tel" value={form.studentPhone} onChange={(e) => handlePhoneChange(e.target.value, (v) => update("studentPhone", v))} onFocus={() => { if (!form.studentPhone.trim() || form.studentPhone.trim() === "+998") update("studentPhone", initialPhone()); }} placeholder="+998 90 123 45 67" className={`input-field ${errors.studentPhone ? "input-error" : ""}`} />
                        {errors.studentPhone && <ErrorText t={errors.studentPhone} />}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">Ota raqami <span className="text-amber-600">*</span></label>
                        <input type="tel" value={form.fatherPhone} onChange={(e) => handlePhoneChange(e.target.value, (v) => update("fatherPhone", v))} onFocus={() => { if (!form.fatherPhone.trim() || form.fatherPhone.trim() === "+998") update("fatherPhone", initialPhone()); }} placeholder="+998 90 123 45 67" className={`input-field ${errors.fatherPhone ? "input-error" : ""}`} />
                        {errors.fatherPhone && <ErrorText t={errors.fatherPhone} />}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">Ona raqami <span className="text-amber-600">*</span></label>
                        <input type="tel" value={form.motherPhone} onChange={(e) => handlePhoneChange(e.target.value, (v) => update("motherPhone", v))} onFocus={() => { if (!form.motherPhone.trim() || form.motherPhone.trim() === "+998") update("motherPhone", initialPhone()); }} placeholder="+998 90 123 45 67" className={`input-field ${errors.motherPhone ? "input-error" : ""}`} />
                        {errors.motherPhone && <ErrorText t={errors.motherPhone} />}
                      </div>
                    </div>
                  )}

                  {/* STEP 2 — Emaktab */}
                  {step === 2 && (
                    <div className="space-y-5">
                      <StepHeader icon={<Lock className="w-5 h-5 text-amber-600" />} title="Emaktab hisobi" subtitle="emaktab.uz ga kirish uchun" />
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">Emaktab login <span className="text-amber-600">*</span></label>
                        <input value={form.emaktabLogin} onChange={(e) => update("emaktabLogin", e.target.value)} placeholder="AB1234567" className={`input-field ${errors.emaktabLogin ? "input-error" : ""}`} autoComplete="username" />
                        {errors.emaktabLogin && <ErrorText t={errors.emaktabLogin} />}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">Emaktab parol <span className="text-amber-600">*</span></label>
                        <div className="relative">
                          <input type={showPass ? "text" : "password"} value={form.emaktabPassword} onChange={(e) => update("emaktabPassword", e.target.value)} placeholder="••••••••" className={`input-field !pr-12 ${errors.emaktabPassword ? "input-error" : ""}`} autoComplete="current-password" />
                          <button type="button" onClick={() => setShowPass(!showPass)} tabIndex={-1} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-600 transition-colors">
                            {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {errors.emaktabPassword && <ErrorText t={errors.emaktabPassword} />}
                      </div>
                      <div className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                        <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-green-800">Xavfsiz shifrlash</p>
                          <p className="text-xs text-green-700 mt-0.5">Login va parolingiz AES-256 bilan shifrlanadi.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3 — Shartlar */}
                  {step === 3 && (
                    <div className="space-y-5">
                      <StepHeader icon={<Check className="w-5 h-5 text-amber-600" />} title="Shartlar" subtitle="Tasdiqlash kerak" />
                      <CheckboxItem checked={form.terms} onChange={(v) => update("terms", v)} error={errors.terms} title="Foydalanuvchi shartlariga roziman" desc="Platformadan foydalanish qoidalarini qabul qilaman" />
                      <CheckboxItem checked={form.encryption} onChange={(v) => update("encryption", v)} error={errors.encryption} title="Ma'lumotlarim shifrlangan saqlanishiga roziman" desc="Emaktab login/parolim AES-256 bilan himoyalanadi" />
                      <CheckboxItem checked={form.parentsNotified} onChange={(v) => update("parentsNotified", v)} error={errors.parentsNotified} title="Ota-onam xabardor" desc="Ular bu ro'yxatdan o'tishdan xabardor" />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex gap-3 mt-8">
                {step > 0 && (
                  <button type="button" onClick={back} disabled={loading} className="btn-secondary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Orqaga
                  </button>
                )}
                {step < 3 ? (
                  <button type="button" onClick={next} disabled={classesLoading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                    Keyingi <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button type="button" onClick={submit} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                    {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Yuborilmoqda...</> : <><Check className="w-5 h-5" /> Ro&apos;yxatdan o&apos;tish</>}
                  </button>
                )}
              </div>
            </>
          )}

          {phase === "processing" && (
            <div className="py-8 text-center">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/30 mb-6">
                <Loader2 className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-xl font-bold text-amber-950 mb-2">Jarayon davom etmoqda</h2>
              <p className="text-sm text-stone-500 mb-6">{progressMsg}</p>
              <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden mb-2">
                <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} className="h-full bg-gradient-to-r from-amber-400 to-amber-600" />
              </div>
              <p className="text-xs text-stone-400">{progress}%</p>
              <p className="text-xs text-stone-400 mt-6">1-2 daqiqa davom etishi mumkin. Sahifani yopmang.</p>
            </div>
          )}

          {phase === "done" && (
            <div className="py-8 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30 mb-6">
                <Check className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-amber-950 mb-2">Tabriklaymiz! 🎉</h2>
              <p className="text-stone-600 mb-2"><span className="font-semibold">{result?.fullName}</span>, hisobingiz yaratildi</p>
              <p className="text-sm text-stone-500 mb-8">Endi Telegram botga ulanib, barcha imkoniyatlardan foydalaning</p>
              <button onClick={() => router.push("/login")} className="btn-primary w-full">Kirish sahifasiga o&apos;tish</button>
            </div>
          )}

          {phase === "error" && (
            <div className="py-8 text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-6">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-red-900 mb-2">Xatolik</h2>
              <p className="text-sm text-red-700 mb-6">{errors.general || "Qayta urinib ko'ring"}</p>
              <button onClick={reset} className="btn-primary w-full">Qayta urinish</button>
            </div>
          )}
        </div>

        {phase === "form" && (
          <p className="text-center mt-6 text-stone-600 text-sm">
            Hisobingiz bormi? <Link href="/login" className="text-amber-600 hover:text-amber-700 font-bold">Kirish</Link>
          </p>
        )}
      </div>
    </main>
  );
}

function StepHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">{icon}</div>
      <div>
        <h2 className="text-xl font-bold text-amber-950">{title}</h2>
        <p className="text-xs text-stone-500">{subtitle}</p>
      </div>
    </div>
  );
}

function ErrorText({ t }: { t: string }) {
  return (
    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-500 mt-2 flex items-center gap-1">
      <AlertCircle className="w-3.5 h-3.5" /> {t}
    </motion.p>
  );
}

function CheckboxItem({ checked, onChange, error, title, desc }: { checked: boolean; onChange: (v: boolean) => void; error?: string; title: string; desc: string }) {
  return (
    <div>
      <label className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${checked ? "bg-amber-50 border-amber-300" : "bg-white border-stone-200 hover:border-amber-200"}`}>
        <div className="relative flex-shrink-0 mt-0.5">
          <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
          <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${checked ? "bg-amber-500 border-amber-500" : "bg-white border-stone-300"}`}>
            {checked && <Check className="w-4 h-4 text-white" />}
          </div>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-stone-800 text-sm">{title}</p>
          <p className="text-xs text-stone-500 mt-0.5">{desc}</p>
        </div>
      </label>
      {error && <ErrorText t={error} />}
    </div>
  );
}