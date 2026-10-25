"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Language = "uz" | "ru" | "en";

interface LangCtx {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LangCtx | null>(null);

// Tarjimalar bazasi (hozircha ozgina, keyin to'ldiriladi)
const translations: Record<Language, Record<string, string>> = {
  uz: {
    "settings.title": "Sozlamalar",
    "settings.profile": "Profil",
    "settings.appearance": "Ko'rinish",
    "settings.language": "Til",
    "settings.save": "Saqlash",
    "settings.light": "Yorug'",
    "settings.dark": "Qorong'i",
  },
  ru: {
    "settings.title": "Настройки",
    "settings.profile": "Профиль",
    "settings.appearance": "Внешний вид",
    "settings.language": "Язык",
    "settings.save": "Сохранить",
    "settings.light": "Светлая",
    "settings.dark": "Тёмная",
  },
  en: {
    "settings.title": "Settings",
    "settings.profile": "Profile",
    "settings.appearance": "Appearance",
    "settings.language": "Language",
    "settings.save": "Save",
    "settings.light": "Light",
    "settings.dark": "Dark",
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("uz");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("maktabim_lang") as Language | null;
    if (stored) setLangState(stored);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("maktabim_lang", lang);
    document.documentElement.lang = lang;
  }, [lang, mounted]);

  function setLang(l: Language) {
    setLangState(l);
  }

  function t(key: string): string {
    return translations[lang]?.[key] || translations.uz[key] || key;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be inside LanguageProvider");
  return ctx;
}