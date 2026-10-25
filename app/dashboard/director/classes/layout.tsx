import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sinflar boshqaruvi",
  description: "Sinf ochish, tahrirlash va boshqarish",
};

export default function ClassesLayout({ children }: { children: React.ReactNode }) {
  return children;
}