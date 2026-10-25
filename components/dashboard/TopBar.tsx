"use client";

import { Menu, Bell, Search, User } from "lucide-react";
import { useState } from "react";

interface TopBarProps {
  title?: string;
  user?: { fullName: string; role: string };
  onMenuClick?: () => void;
}

export function TopBar({ title, user, onMenuClick }: TopBarProps) {
  const [showNotif, setShowNotif] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-amber-100">
      <div className="px-4 md:px-6 h-16 flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-amber-50"
        >
          <Menu className="w-5 h-5 text-stone-700" />
        </button>

        <div className="flex-1">
          <h1 className="text-lg md:text-xl font-bold text-amber-950">{title || "Dashboard"}</h1>
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50/50 border border-amber-100 w-64">
          <Search className="w-4 h-4 text-stone-400" />
          <input
            placeholder="Qidirish..."
            className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-stone-400"
          />
        </div>

        {/* Notifications */}
        <button
          onClick={() => setShowNotif(!showNotif)}
          className="relative p-2 rounded-xl hover:bg-amber-50"
        >
          <Bell className="w-5 h-5 text-stone-700" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-amber-100">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm">
            {user?.fullName?.[0] || "U"}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-amber-950 leading-tight">
              {user?.fullName || "Foydalanuvchi"}
            </p>
            <p className="text-xs text-stone-500 capitalize">
              {user?.role || "student"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}