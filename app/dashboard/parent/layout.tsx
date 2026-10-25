import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ota-ona paneli",
  description: "Farzandlaringiz statistikasi, ogohlantirishlar va to'lovlar",
  icons: {
    icon: [{
      url: `data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>`
      )}`,
    }],
  },
};

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return children;
}