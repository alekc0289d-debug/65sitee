import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ro'yxatdan o'tish",
  description: "Maktabim+ da 4 qadamda ro'yxatdan o'ting. Emaktab hisobingizni xavfsiz ulang.",
  icons: {
    icon: [
      {
        url: `data:image/svg+xml,${encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>`
        )}`,
      },
    ],
  },
  openGraph: {
    title: "Ro'yxatdan o'tish · Maktabim+",
    description: "4 qadamda boshlang",
    images: ["/og/register.png"],
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}