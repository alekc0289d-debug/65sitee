"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users as UsersIcon, Search, Loader2, AlertCircle, Bot,
  Trash2, UserCog,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import {
  listUsers, updateUserRole, deleteUser,
  type UserItem,
} from "@/lib/api/users";
import { api } from "@/lib/api/client";
import { getInitials } from "@/lib/utils/format";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral" | "amber";

const ROLES = [
  { value: "", label: "Barchasi" },
  { value: "student", label: "O'quvchilar" },
  { value: "parent", label: "Ota-onalar" },
  { value: "teacher", label: "O'qituvchilar" },
  { value: "class_admin", label: "Sinf adminlari" },
  { value: "director", label: "Direktorlar" },
  { value: "bosh_admin", label: "Bosh adminlar" },
];

const ROLE_LABELS: Record<string, string> = {
  student: "O'quvchi",
  parent: "Ota-ona",
  teacher: "O'qituvchi",
  class_admin: "Sinf admini",
  director: "Direktor",
  bosh_admin: "Bosh admin",
};

const ROLE_COLORS: Record<string, BadgeVariant> = {
  student: "amber",
  parent: "success",
  teacher: "info",
  class_admin: "warning",
  director: "danger",
  bosh_admin: "danger",
};

export default function SuperAdminUsersPage() {
  const { user, loading: authLoading } = useAuth(true);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await listUsers({ role: roleFilter, search: search });
      setUsers(res.users || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Yuklanmadi");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!user?.id) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, roleFilter]);

  async function handleRoleChange(u: UserItem, newRole: string) {
    if (!confirm(`"${u.fullName}" rolini "${ROLE_LABELS[newRole]}" ga o'zgartirasizmi?`)) return;
    setBusy(true);
    try {
      const res = await updateUserRole(u.id, newRole);
      if (!res.ok) { alert(res.message || "Xatolik"); return; }
      await load();
    } finally { setBusy(false); }
  }

  async function promoteToAdmin(u: UserItem) {
    if (!confirm(`"${u.fullName}" ni sinf admini qilmoqchimisiz?`)) return;
    setBusy(true);
    try {
      const res = await api.post<any>("/api/users/promote-class-admin", {
        studentId: u.id,
      });
      if (!res.ok) { alert(res.message || "Xatolik"); return; }
      await load();
    } finally { setBusy(false); }
  }

  async function handleDelete(u: UserItem) {
    if (!confirm(`"${u.fullName}" ni o'chirasizmi? (qaytarib bo'lmaydi)`)) return;
    setBusy(true);
    try {
      const res = await deleteUser(u.id);
      if (!res.ok) { alert(res.message || "Xatolik"); return; }
      await load();
    } finally { setBusy(false); }
  }

  if (authLoading) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
    </div>
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-amber-950">Foydalanuvchilar</h1>
        <p className="text-stone-500 mt-1">Jami: <b className="text-amber-700">{users.length}</b> ta</p>
      </motion.div>

      <Card>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-2xl bg-amber-50/50 border border-amber-100">
            <Search className="w-4 h-4 text-stone-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
              placeholder="Ism yoki telefon..." className="flex-1 bg-transparent text-sm focus:outline-none" />
          </div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="input-field !py-3 md:w-56">
            {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          <Button onClick={load} disabled={busy}>Qidirish</Button>
        </div>
      </Card>

      {error && (
        <Card>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        </div>
      ) : users.length === 0 ? (
        <Card>
          <div className="text-center py-16">
            <UsersIcon className="w-16 h-16 text-amber-300 mx-auto mb-4" />
            <p className="text-stone-500">Foydalanuvchilar topilmadi</p>
          </div>
        </Card>
      ) : (
        <Card className="!p-0 overflow-hidden">
          <div className="divide-y divide-amber-50">
            {users.map((u, i) => (
              <motion.div key={u.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                className="p-4 flex items-center gap-4 hover:bg-amber-50/30 transition-colors">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {getInitials(u.fullName)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-amber-950 truncate">{u.fullName}</p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    <Badge variant={ROLE_COLORS[u.role] || "neutral"} size="sm">{ROLE_LABELS[u.role] || u.role}</Badge>
                    {u.classId && <Badge variant="amber" size="sm">{u.classId}</Badge>}
                    {u.botStatus === "connected" && <Badge variant="success" size="sm"><Bot className="w-3 h-3 inline mr-1" /> Bot</Badge>}
                    <span className="text-xs text-stone-400">{u.phone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {u.role === "student" && (
                    <Button size="sm" variant="secondary" onClick={() => promoteToAdmin(u)} disabled={busy} title="Sinf admini qilish">
                      <UserCog className="w-3.5 h-3.5" />
                    </Button>
                  )}
                  <select value={u.role} onChange={(e) => handleRoleChange(u, e.target.value)} disabled={busy}
                    className="text-xs rounded-lg border border-stone-200 px-2 py-1.5 bg-white focus:outline-none">
                    {Object.entries(ROLE_LABELS).map(([val, label]) => <option key={val} value={val}>{label}</option>)}
                  </select>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(u)} disabled={busy}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}