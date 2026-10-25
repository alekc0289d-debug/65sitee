import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/hooks/useTheme";
import { LanguageProvider } from "@/hooks/useLanguage";

// ✅ dynamic ni fayl boshiga qo'yamiz (komponentdan oldin)
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Maktabim+ — Maktabingizni raqamlashtiring",
    template: "%s · Maktabim+",
  },
  description:
    "Baholar, reyting, sovg'alar va ota-onalar bilan aloqa — 65-maktab uchun zamonaviy platforma.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f59e0b" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1410" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body className="min-h-screen antialiased bg-cream text-stone-900">
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}