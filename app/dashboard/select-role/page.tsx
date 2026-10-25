"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { GraduationCap, UserCog, Shield, Users, BookOpen } from "lucide-react";
import { getStoredUser, saveSession, getToken } from "@/lib/api/auth";

const ROLE_LABELS: Record<string, { label: string; icon: any; path: string }> = {
  student: { label: "O'quvchi", icon: GraduationCap, path: "/dashboard/student" },
  class_admin: { label: "Sinf admini", icon: UserCog, path: "/dashboard/class-admin" },
  teacher: { label: "O'qituvchi", icon: BookOpen, path: "/dashboard/teacher" },
  director: { label: "Direktor", icon: Users, path: "/dashboard/director" },
  bosh_admin: { label: "Bosh admin", icon: Shield, path: "/dashboard/superadmin" },
};

export default function SelectRolePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = getStoredUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    setUser(u);
  }, [router]);

  function handleSelect(role: string) {
    // Rolni vaqtincha almashtirish (localStorage)
    const updatedUser = { ...user, role };
    saveSession(getToken()!, updatedUser);
    router.replace(ROLE_LABELS[role]?.path || "/dashboard");
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-6">
      <Card className="max-w-md w-full !p-8">
        <h1 className="text-2xl font-bold text-amber-950 mb-2 text-center">Qaysi panelga kirmoqchisiz?</h1>
        <p className="text-stone-500 text-center mb-6">Sizda bir nechta rol mavjud</p>

        <div className="space-y-3">
          {(user.roles || [user.role]).map((r: string) => {
            const info = ROLE_LABELS[r];
            if (!info) return null;
            const Icon = info.icon;
            return (
              <button
                key={r}
                onClick={() => handleSelect(r)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-stone-200 hover:border-amber-400 hover:bg-amber-50 transition-all text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="font-bold text-amber-950">{info.label}</p>
                  <p className="text-xs text-stone-500">Kirish</p>
                </div>
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}