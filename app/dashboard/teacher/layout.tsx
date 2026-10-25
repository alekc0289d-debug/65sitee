import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "O'qituvchi paneli",
  description: "Sinflar, o'quvchilar va baholash",
  icons: {
    icon: [{
      url: `data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`
      )}`,
    }],
  },
};

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return children;
}