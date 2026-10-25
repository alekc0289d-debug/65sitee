export function formatPhone(v: string): string {
  // Faqat raqamlarni olish
  let digits = v.replace(/\D/g, "");

  // Agar bo'sh bo'lsa — bo'sh qaytaramiz
  if (!digits) return "";

  // 998 bilan boshlanmasa — boshiga qo'shamiz
  if (!digits.startsWith("998")) {
    // Agar 9 bilan boshlansa (90, 91...), 998 qo'shamiz
    if (digits.startsWith("9") && digits.length <= 9) {
      digits = "998" + digits;
    } else if (digits.length > 0) {
      digits = "998" + digits;
    }
  }

  // 12 ta raqamdan oshmasin
  digits = digits.slice(0, 12);

  // Formatlash: +998 XX XXX XX XX
  let out = "+998";
  const rest = digits.slice(3);
  if (rest.length > 0) out += " " + rest.slice(0, 2);
  if (rest.length > 2) out += " " + rest.slice(2, 5);
  if (rest.length > 5) out += " " + rest.slice(5, 7);
  if (rest.length > 7) out += " " + rest.slice(7, 9);
  return out;
}

// Yangi yordamchi — input uchun default qiymat
export function initialPhone(): string {
  return "+998 ";
}

export function formatMoney(n: number): string {
  return new Intl.NumberFormat("uz-UZ").format(n) + " so'm";
}

export function formatDate(d: string | Date): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("uz-UZ", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function getWeekNumber(d: Date): number {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return Math.ceil(((t.getTime() - y0.getTime()) / 86400000 + 1) / 7);
}