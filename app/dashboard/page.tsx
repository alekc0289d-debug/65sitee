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
    const role = user?.role;
    
    if (role === "bosh_admin") router.replace("/dashboard/superadmin");
    else if (role === "director") router.replace("/dashboard/director");
    else if (role === "class_admin") router.replace("/dashboard/class-admin");
    else if (role === "teacher") router.replace("/dashboard/teacher");
    else if (role === "parent") router.replace("/dashboard/parent");
    else router.replace("/dashboard/student");
    
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
    </div>
  );
}