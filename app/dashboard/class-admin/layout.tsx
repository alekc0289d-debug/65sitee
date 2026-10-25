import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sinf admini",
  description: "Sinf statistikasi, to'lovlar va hisobotlar",
  icons: {
    icon: [{
      url: `data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>`
      )}`,
    }],
  },
};

export default function ClassAdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}