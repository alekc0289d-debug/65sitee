"use client";

import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap, LayoutDashboard, Trophy, Gift, MessageCircle,
  Users, CreditCard, FileText, Settings, LogOut, X,
  BookOpen, CheckSquare, Newspaper, Calendar, Award,
  BarChart3, Building2, Activity, UserCog, Bot, School,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { Role } from "@/types";

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

// ============================================================
// Rol bo'yicha navigatsiya
// ============================================================
const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  student: [
    { href: "/dashboard/student", icon: <LayoutDashboard className="w-5 h-5" />, label: "Bosh sahifa" },
    { href: "/dashboard/student/grades", icon: <BookOpen className="w-5 h-5" />, label: "Baholarim" },
    { href: "/dashboard/student/ranking", icon: <Trophy className="w-5 h-5" />, label: "Reyting" },
    { href: "/dashboard/student/tasks", icon: <CheckSquare className="w-5 h-5" />, label: "Topshiriqlar" },
    { href: "/dashboard/student/tests", icon: <Award className="w-5 h-5" />, label: "Testlar" },
    { href: "/dashboard/student/prizes", icon: <Gift className="w-5 h-5" />, label: "Sovg'alar" },
    { href: "/dashboard/student/schedule", icon: <Calendar className="w-5 h-5" />, label: "Jadval" },
    { href: "/dashboard/student/news", icon: <Newspaper className="w-5 h-5" />, label: "Yangiliklar" },
    { href: "/dashboard/student/chat", icon: <MessageCircle className="w-5 h-5" />, label: "Chat" },
  ],
  parent: [
    { href: "/dashboard/parent", icon: <LayoutDashboard className="w-5 h-5" />, label: "Bosh sahifa" },
    { href: "/dashboard/parent/children", icon: <Users className="w-5 h-5" />, label: "Farzandlarim" },
    { href: "/dashboard/parent/payments", icon: <CreditCard className="w-5 h-5" />, label: "To'lovlar" },
    { href: "/dashboard/parent/news", icon: <Newspaper className="w-5 h-5" />, label: "Yangiliklar" },
    { href: "/dashboard/parent/chat", icon: <MessageCircle className="w-5 h-5" />, label: "Chat" },
  ],
  teacher: [
    { href: "/dashboard/teacher", icon: <LayoutDashboard className="w-5 h-5" />, label: "Bosh sahifa" },
    { href: "/dashboard/teacher/classes", icon: <Users className="w-5 h-5" />, label: "Sinflarim" },
    { href: "/dashboard/teacher/grades", icon: <BookOpen className="w-5 h-5" />, label: "Baholash" },
    { href: "/dashboard/teacher/reports", icon: <FileText className="w-5 h-5" />, label: "Hisobotlar" },
    { href: "/dashboard/teacher/news", icon: <Newspaper className="w-5 h-5" />, label: "Yangiliklar" },
    { href: "/dashboard/teacher/chat", icon: <MessageCircle className="w-5 h-5" />, label: "Chat" },
  ],
  class_admin: [
    { href: "/dashboard/class-admin", icon: <LayoutDashboard className="w-5 h-5" />, label: "Bosh sahifa" },
    { href: "/dashboard/class-admin/payments", icon: <CreditCard className="w-5 h-5" />, label: "To'lovlar" },
    { href: "/dashboard/class-admin/reports", icon: <FileText className="w-5 h-5" />, label: "Hisobotlar" },
    { href: "/dashboard/class-admin/schedule", icon: <Calendar className="w-5 h-5" />, label: "Jadval" },
    { href: "/dashboard/class-admin/students", icon: <Users className="w-5 h-5" />, label: "O'quvchilar" },
    { href: "/dashboard/class-admin/news", icon: <Newspaper className="w-5 h-5" />, label: "Yangiliklar" },
    { href: "/dashboard/class-admin/chat", icon: <MessageCircle className="w-5 h-5" />, label: "Chat" },
  ],
  director: [
    { href: "/dashboard/director", icon: <LayoutDashboard className="w-5 h-5" />, label: "Bosh sahifa" },
    { href: "/dashboard/director/classes", icon: <School className="w-5 h-5" />, label: "Sinflar" },
    { href: "/dashboard/director/teachers", icon: <GraduationCap className="w-5 h-5" />, label: "O'qituvchilar" },
    { href: "/dashboard/director/payments", icon: <CreditCard className="w-5 h-5" />, label: "To'lovlar" },
    { href: "/dashboard/director/prizes", icon: <Gift className="w-5 h-5" />, label: "Sovg'alar" },
    { href: "/dashboard/director/reports", icon: <BarChart3 className="w-5 h-5" />, label: "Hisobotlar" },
    { href: "/dashboard/director/news", icon: <Newspaper className="w-5 h-5" />, label: "Yangiliklar" },
  ],
  bosh_admin: [
    { href: "/dashboard/superadmin", icon: <LayoutDashboard className="w-5 h-5" />, label: "Bosh sahifa" },
    { href: "/dashboard/superadmin/schools", icon: <Building2 className="w-5 h-5" />, label: "Maktablar" },
    { href: "/dashboard/superadmin/users", icon: <UserCog className="w-5 h-5" />, label: "Foydalanuvchilar" },
    { href: "/dashboard/superadmin/bot", icon: <Bot className="w-5 h-5" />, label: "Bot boshqaruvi" },
    { href: "/dashboard/superadmin/finance", icon: <CreditCard className="w-5 h-5" />, label: "Moliya" },
    { href: "/dashboard/superadmin/news", icon: <Newspaper className="w-5 h-5" />, label: "Yangiliklar" },
    { href: "/dashboard/superadmin/logs", icon: <Activity className="w-5 h-5" />, label: "Loglar" },
    { href: "/dashboard/superadmin/reports", icon: <FileText className="w-5 h-5" />, label: "Hisobotlar" },
  ],
};

// ============================================================
// Rol nomlari (ko'rsatish uchun)
// ============================================================
const ROLE_LABEL: Record<Role, string> = {
  student: "O'quvchi",
  parent: "Ota-ona",
  teacher: "O'qituvchi",
  class_admin: "Sinf admini",
  director: "Direktor",
  bosh_admin: "Bosh admin",
};

// ============================================================
// Sidebar
// ============================================================
interface SidebarProps {
  role?: Role;
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ role, open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const activeRole: Role = role || user?.role || "student";
  const nav = NAV_BY_ROLE[activeRole] || [];

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 lg:z-0 w-72 h-screen bg-white border-r border-amber-100 flex flex-col transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-amber-100 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-amber-900">
              Maktabim<span className="text-amber-500">+</span>
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-amber-50"
            aria-label="Yopish"
          >
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>

        {/* User info */}
        {user && (
          <div className="p-4 border-b border-amber-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold shadow-md">
                {user.fullName?.[0] || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-amber-950 text-sm truncate">
                  {user.fullName}
                </p>
                <p className="text-xs text-stone-500">
                  {ROLE_LABEL[activeRole] || activeRole}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {nav.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                pathname.startsWith(item.href) &&
                pathname !== "/dashboard");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-2xl font-medium text-sm transition-all",
                  active
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25"
                    : "text-stone-600 hover:bg-amber-50 hover:text-amber-700"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-amber-100 space-y-0.5">
          <Link
            href="/dashboard/settings"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl font-medium text-sm text-stone-600 hover:bg-amber-50 hover:text-amber-700 transition-all"
          >
            <Settings className="w-5 h-5" />
            <span>Sozlamalar</span>
          </Link>
          <button
            onClick={() => {
              if (confirm("Hisobdan chiqmoqchimisiz?")) {
                logout();
                onClose?.();
              }
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl font-medium text-sm text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>
    </>
  );
}