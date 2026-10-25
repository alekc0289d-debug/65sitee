"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    // Rolga qarab yo'naltirish
    const role = user?.role || "student";
    if (role === "student") router.replace("/dashboard/student");
    else if (role === "parent") router.replace("/dashboard/parent");
    else if (role === "teacher") router.replace("/dashboard/teacher");
    else if (role === "class_admin") router.replace("/dashboard/class-admin");
    else if (role === "director") router.replace("/dashboard/director");
    else if (role === "superadmin") router.replace("/dashboard/superadmin");
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
    </div>
  );
}