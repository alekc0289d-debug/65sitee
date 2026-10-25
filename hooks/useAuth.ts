"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getToken, getStoredUser, clearSession } from "@/lib/api/auth";
import { API_URL } from "@/lib/api/client";
import type { Role, User } from "@/types";

export function useAuth(requireAuth = false) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      const token = getToken();
      const stored = getStoredUser();

      // Token yo'q → login
      if (!token || !stored) {
        if (!cancelled) {
          clearSession();
          setUser(null);
          setLoading(false);
        }
        return;
      }

      // LocalStorage'dan darhol ko'rsatish
      if (!cancelled) {
        setUser(stored as User);
      }

      // Serverdan tasdiqlash
      try {
        const res = await fetch(
          `${API_URL}/api/auth/me`,
          {
            headers: { "X-User-Token": token },
            cache: "no-store",
          }
        );

        if (res.status === 401) {
          // Token yaroqsiz → tozalaymiz
          console.warn("[Auth] Token yaroqsiz, tozalanmoqda...");
          clearSession();
          if (!cancelled) {
            setUser(null);
          }
        } else if (res.ok) {
          const fresh = await res.json();
          if (!cancelled && fresh) {
            setUser({
              id: fresh.id,
              fullName: fresh.fullName,
              role: fresh.role as Role,
              classId: fresh.classId,
              phone: fresh.phone,
            });
          }
        }
      } catch (e) {
        // Network xato — localStorage'dagi userni ishlatishda davom etamiz
        console.warn("[Auth] Server tekshirish xato:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    router.push("/login");
  }, [router]);

  return {
    user,
    loading,
    logout,
    role: user?.role as Role | undefined,
    isAuthenticated: !!user,
  };
}