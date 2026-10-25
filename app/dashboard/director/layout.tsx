import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Direktor paneli",
  description: "Maktab statistikasi, sinflar va hisobotlar",
  icons: {
    icon: [{
      url: `data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 12l3-3 4 4 5-5"/></svg>`
      )}`,
    }],
  },
};

export default function DirectorLayout({ children }: { children: React.ReactNode }) {
  return children;
}