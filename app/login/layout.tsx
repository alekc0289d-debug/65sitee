import type { Metadata } from "next";
import { LogIn } from "lucide-react";

export const metadata: Metadata = {
  title: "Kirish",
  description: "Maktabim+ hisobingizga kiring. Telefon raqam va parol orqali xavfsiz kirish.",
  icons: {
    icon: [
      {
        url: `data:image/svg+xml,${encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>`
        )}`,
      },
    ],
  },
  openGraph: {
    title: "Kirish · Maktabim+",
    description: "Hisobingizga kiring",
    images: ["/og/login.png"],
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}