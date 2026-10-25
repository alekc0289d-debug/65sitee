"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Globe, Loader2, LogOut, Lock, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage, type Language } from "@/hooks/useLanguage";
import { api } from "@/lib/api/client";

export default function SettingsPage() {
  const { user, loading: authLoading, logout } = useAuth(true);
  const { theme, setTheme } = useTheme();
  const { lang, setLang } = useLanguage();

  // Parol o'zgartirish uchun state'lar
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function changePassword() {
    if (!user?.id) return;
    setPassMsg("");
    if (!oldPass || !newPass || !confirmPass) {
      setPassMsg("Barcha maydonlarni to'ldiring");
      return;
    }
    if (newPass.length < 4) {
      setPassMsg("Yangi parol kamida 4 belgi");
      return;
    }
    if (newPass !== confirmPass) {
      setPassMsg("Parollar mos emas");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post<any>("/api/auth/change-password", {
        userId: user.id,
        oldPassword: oldPass,
        newPassword: newPass,
      });
      if (res.ok) {
        setPassMsg("✅ Parol o'zgartirildi");
        setOldPass(""); setNewPass(""); setConfirmPass("");
      } else {
        setPassMsg(res.message || "Xatolik");
      }
    } catch {
      setPassMsg("Server bilan aloqa yo'q");
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || !user) return <div className="flex justify-center h-96"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-amber-950">Sozlamalar</h1>
      </motion.div>

      {/* Ko'rinish (Theme) */}
      <Card>
        <div className="flex items-center gap-2 mb-5">
          {theme === "dark" ? <Moon className="w-5 h-5 text-amber-600" /> : <Sun className="w-5 h-5 text-amber-600" />}
          <h3 className="text-lg font-bold text-amber-950">Ko'rinish</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setTheme("light")} className={`p-5 rounded-2xl border-2 transition-all ${theme === "light" ? "bg-amber-50 border-amber-400" : "bg-white border-stone-200"}`}>
            <Sun className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-amber-900">Yorug'</p>
          </button>
          <button onClick={() => setTheme("dark")} className={`p-5 rounded-2xl border-2 transition-all ${theme === "dark" ? "bg-amber-50 border-amber-400" : "bg-white border-stone-200"}`}>
            <Moon className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-amber-900">Qorong'i</p>
          </button>
        </div>
      </Card>

      {/* Til (Language) */}
      <Card>
        <div className="flex items-center gap-2 mb-5">
          <Globe className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-bold text-amber-950">Til</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {([
            { value: "uz", flag: "🇺🇿", label: "O'zbekcha" },
            { value: "uz_cyrl", flag: "🇺🇿", label: "Ўзбекча" },
            { value: "ru", flag: "🇷🇺", label: "Русский" },
          ] as const).map((l) => (
            <button key={l.value} onClick={() => setLang(l.value as Language)} className={`p-4 rounded-2xl border-2 transition-all ${lang === l.value ? "bg-amber-50 border-amber-400" : "bg-white border-stone-200"}`}>
              <p className="text-3xl mb-2">{l.flag}</p>
              <p className="text-sm font-bold text-amber-900">{l.label}</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Xavfsizlik */}
      <Card>
        <div className="flex items-center gap-2 mb-5">
          <Lock className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-bold text-amber-950">Parolni o'zgartirish</h3>
        </div>
        <div className="space-y-4">
          <Input type="password" label="Hozirgi parol" value={oldPass} onChange={(e) => setOldPass(e.target.value)} placeholder="••••••••" />
          <Input type="password" label="Yangi parol" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="••••••••" />
          <Input type="password" label="Parolni tasdiqlang" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} placeholder="••••••••" />
          
          {passMsg && (
            <p className={`text-sm ${passMsg.startsWith("✅") ? "text-green-600" : "text-red-500"}`}>{passMsg}</p>
          )}
          
          <Button onClick={changePassword} disabled={loading} variant="secondary">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Parolni saqlash"}
          </Button>
        </div>
      </Card>

      {/* Chiqish */}
      <Card className="!border-red-200 bg-red-50/30">
        <Button variant="danger" onClick={logout} className="w-full">
          <LogOut className="w-4 h-4" /> Hisobdan chiqish
        </Button>
      </Card>
    </div>
  );
}