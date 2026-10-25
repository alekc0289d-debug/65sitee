"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users, Search, Loader2, AlertCircle, Bot, Check,
  X, Edit, Trash2, TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Progress } from "@/components/ui/Progress";
import { useAuth } from "@/hooks/useAuth";
import {
  getClassStudents, getStudentDetail, updateStudent, deleteStudent,
  type ClassStudent,
} from "@/lib/api/users";
import { getInitials } from "@/lib/utils/format";

export default function ClassAdminStudentsPage() {
  const { user, loading: authLoading } = useAuth(true);
  const [students, setStudents] = useState<ClassStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<ClassStudent | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editMother, setEditMother] = useState("");
  const [editFather, setEditFather] = useState("");

  const classId = user?.classId || "";

  async function load() {
    if (!classId) return;
    setLoading(true);
    try {
      const res = await getClassStudents(classId);
      setStudents(res.students || []);
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
  }, [user?.id, classId]);

  function openEdit(s: ClassStudent) {
    setSelected(s);
    setEditName(s.fullName);
    setEditPhone(s.phone);
    setEditMother(s.motherPhone);
    setEditFather(s.fatherPhone);
    setModalOpen(true);
  }

  async function handleSave() {
    if (!selected) return;
    setBusy(true);
    try {
      const res = await updateStudent({
        studentId: selected.studentId,
        fullName: editName.trim(),
        phone: editPhone,
        motherPhone: editMother,
        fatherPhone: editFather,
      });
      if (!res.ok) {
        alert(res.message || "Xatolik");
        return;
      }
      setModalOpen(false);
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(s: ClassStudent) {
    if (!confirm(`"${s.fullName}" ni o'chirasizmi?`)) return;
    setBusy(true);
    try {
      const res = await deleteStudent(s.studentId);
      if (!res.ok) {
        alert(res.message || "Xatolik");
        return;
      }
      await load();
    } finally {
      setBusy(false);
    }
  }

  const filtered = students.filter(
    (s) =>
      !search ||
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search)
  );

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!classId) {
    return (
      <Card>
        <div className="text-center py-16">
          <AlertCircle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <p className="text-stone-600">Siz sinfga biriktirilmagansiz</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-amber-950">
            {classId} — O&apos;quvchilar
          </h1>
          <p className="text-stone-500 mt-1">
            Jami: <b className="text-amber-700">{students.length}</b> ta
          </p>
        </div>
      </motion.div>

      {/* Search */}
      <Card>
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-amber-50/50 border border-amber-100">
          <Search className="w-4 h-4 text-stone-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ism yoki telefon bo'yicha qidirish..."
            className="flex-1 bg-transparent text-sm focus:outline-none"
          />
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

      {filtered.length === 0 ? (
        <Card>
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-amber-300 mx-auto mb-4" />
            <p className="text-stone-500">O&apos;quvchilar topilmadi</p>
          </div>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((s, i) => (
            <motion.div
              key={s.studentId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {getInitials(s.fullName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-amber-950 truncate">
                      {s.fullName}
                    </h3>
                    <p className="text-xs text-stone-500">{s.phone}</p>
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      <Badge variant={s.paid ? "success" : "warning"} size="sm">
                        {s.paid ? "✓ To'langan" : "○ To'lanmagan"}
                      </Badge>
                      {s.botStatus === "connected" ? (
                        <Badge variant="success" size="sm">
                          <Bot className="w-3 h-3 inline mr-1" />
                          Bot
                        </Badge>
                      ) : (
                        <Badge variant="neutral" size="sm">Bot yo&apos;q</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* O'rtacha */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-stone-600">O&apos;rtacha ball</span>
                    <span className="font-bold text-amber-700">
                      {s.avg} ({s.gradesCount} ta baho)
                    </span>
                  </div>
                  <Progress
                    value={(s.avg / 5) * 100}
                    color={s.avg >= 4.5 ? "green" : s.avg >= 3.5 ? "amber" : "red"}
                  />
                </div>

                {/* Phones */}
                <div className="mb-4 p-3 rounded-xl bg-stone-50 text-xs space-y-1">
                  {s.motherPhone && (
                    <p className="text-stone-600">
                      <span className="text-stone-400">Ona:</span> {s.motherPhone}
                    </p>
                  )}
                  {s.fatherPhone && (
                    <p className="text-stone-600">
                      <span className="text-stone-400">Ota:</span> {s.fatherPhone}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => openEdit(s)}
                    disabled={busy}
                  >
                    <Edit className="w-3.5 h-3.5" /> Tahrirlash
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(s)}
                    disabled={busy}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="O'quvchi ma'lumotlari"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              To&apos;liq ism
            </label>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              O&apos;quvchi raqami
            </label>
            <input
              type="tel"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Ona raqami
            </label>
            <input
              type="tel"
              value={editMother}
              onChange={(e) => setEditMother(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Ota raqami
            </label>
            <input
              type="tel"
              value={editFather}
              onChange={(e) => setEditFather(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="secondary"
              onClick={() => setModalOpen(false)}
              disabled={busy}
              className="flex-1"
            >
              <X className="w-4 h-4" /> Bekor
            </Button>
            <Button onClick={handleSave} disabled={busy} className="flex-1">
              {busy ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saqlanmoqda...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" /> Saqlash
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}