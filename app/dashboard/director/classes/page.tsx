"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  School, Plus, Trash2, Users, Loader2, AlertCircle, Check,
  Power, UserCog, GraduationCap, Edit, X,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { useAuth } from "@/hooks/useAuth";
import {
  listClasses, createClass, deleteClass, toggleClass,
  type ClassItem,
} from "@/lib/api/classes";
import { api } from "@/lib/api/client";
import { formatPhone, initialPhone } from "@/lib/utils/format";

export default function DirectorClassesPage() {
  const { user, loading: authLoading } = useAuth(true);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [busy, setBusy] = useState(false);

  const [newClassId, setNewClassId] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [teacherPhone, setTeacherPhone] = useState(initialPhone());
  const [teacherTg, setTeacherTg] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminPhone, setAdminPhone] = useState(initialPhone());
  const [adminTg, setAdminTg] = useState("");
  const [formError, setFormError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const data = await listClasses(false);
      setClasses(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Yuklanmadi");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!user?.id) return;
    load();
  }, [user?.id]);

  function resetForm() {
    setNewClassId("");
    setNewDesc("");
    setTeacherName("");
    setTeacherPhone(initialPhone());
    setTeacherTg("");
    setAdminName("");
    setAdminPhone(initialPhone());
    setAdminTg("");
    setFormError("");
    setEditMode(false);
  }

  function openCreate() {
    resetForm();
    setModalOpen(true);
  }

  function openEdit(c: ClassItem) {
    setNewClassId(c.classId);
    setNewDesc(c.description || "");
    setTeacherName(c.classTeacher?.fullName || "");
    setTeacherPhone(c.classTeacher?.phone || initialPhone());
    setTeacherTg(c.classTeacher?.telegramId?.toString() || "");
    setAdminName(c.classAdmin?.fullName || "");
    setAdminPhone(c.classAdmin?.phone || initialPhone());
    setAdminTg(c.classAdmin?.telegramId?.toString() || "");
    setEditMode(true);
    setModalOpen(true);
  }

  async function handleSave() {
    if (!user?.id || !user.role) return;
    setFormError("");

    if (!newClassId.trim()) { setFormError("Sinf nomini kiriting"); return; }
    if (!teacherName.trim()) { setFormError("Sinf rahbarining ismini kiriting"); return; }
    if (teacherPhone.replace(/\D/g, "").length < 12) {
      setFormError("Sinf rahbarining telefoni to'liq emas"); return;
    }
    if (!adminName.trim()) { setFormError("Sinf adminining ismini kiriting"); return; }
    if (adminPhone.replace(/\D/g, "").length < 12) {
      setFormError("Sinf adminining telefoni to'liq emas"); return;
    }
    if (teacherPhone === adminPhone) {
      setFormError("Rahbar va admin telefoni bir xil bo'lmasin"); return;
    }

    setBusy(true);
    try {
      const payload = {
        classId: newClassId.trim(),
        createdBy: user.id,
        createdByRole: user.role,
        description: newDesc.trim(),
        classTeacher: {
          fullName: teacherName.trim(),
          phone: teacherPhone,
          telegramId: teacherTg ? parseInt(teacherTg) : null,
        },
        classAdmin: {
          fullName: adminName.trim(),
          phone: adminPhone,
          telegramId: adminTg ? parseInt(adminTg) : null,
        },
      };

      const res = editMode
        ? await api.post<any>("/api/classes/update", payload)
        : await createClass(payload);

      if (!res.ok) {
        setFormError(res.message || "Xatolik");
        return;
      }
      setModalOpen(false);
      resetForm();
      await load();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Xatolik");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(c: ClassItem) {
    if (!user?.role) return;
    if (!confirm(`"${c.classId}" sinfini o'chirmoqchimisiz?`)) return;
    setBusy(true);
    try {
      const res = await deleteClass(c.classId, user.role);
      if (!res.ok) { alert(res.message || "Xatolik"); return; }
      await load();
    } finally { setBusy(false); }
  }

  async function handleToggle(c: ClassItem) {
    if (!user?.role) return;
    setBusy(true);
    try { await toggleClass(c.classId, user.role); await load(); }
    finally { setBusy(false); }
  }

  if (authLoading || loading) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
    </div>
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-950">Sinflar</h1>
          <p className="text-stone-500 mt-1">Jami: {classes.length} ta</p>
        </div>
        <Button onClick={openCreate} disabled={busy}>
          <Plus className="w-4 h-4" /> Yangi sinf
        </Button>
      </motion.div>

      {error && (
        <Card>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </Card>
      )}

      {classes.length === 0 && !error ? (
        <Card>
          <div className="text-center py-16">
            <School className="w-16 h-16 text-amber-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-amber-950 mb-2">Hozircha sinflar yo&apos;q</h3>
            <p className="text-stone-500 mb-6">Birinchi sinfni oching</p>
            <Button onClick={openCreate}><Plus className="w-4 h-4" /> Sinf ochish</Button>
          </div>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((c, i) => (
            <motion.div key={c.classId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className={!c.active ? "opacity-60" : ""}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-amber-500/30">
                    {c.classId}
                  </div>
                  <div className="flex gap-1">
                    <Badge variant={c.active ? "success" : "neutral"}>
                      {c.active ? "Faol" : "Nofaol"}
                    </Badge>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-amber-950 mb-1">{c.classId} sinfi</h3>
                {c.description && <p className="text-sm text-stone-500 mb-3">{c.description}</p>}

                <div className="flex items-center gap-2 text-sm text-stone-600 mb-3">
                  <Users className="w-4 h-4" /> <span>{c.studentsCount || 0} o&apos;quvchi</span>
                </div>

                {c.classTeacher && (
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-xs font-semibold text-blue-900">Sinf rahbari</span>
                    </div>
                    <p className="text-sm font-medium text-blue-950">{c.classTeacher.fullName}</p>
                    <p className="text-xs text-blue-700">{c.classTeacher.phone}</p>
                  </div>
                )}

                {c.classAdmin && (
                  <div className="p-3 rounded-xl bg-green-50 border border-green-100 mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <UserCog className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-xs font-semibold text-green-900">Sinf admini</span>
                    </div>
                    <p className="text-sm font-medium text-green-950">{c.classAdmin.fullName}</p>
                    <p className="text-xs text-green-700">{c.classAdmin.phone}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" className="flex-1"
                    onClick={() => openEdit(c)} disabled={busy}>
                    <Edit className="w-3.5 h-3.5" /> Tahrirlash
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => handleToggle(c)} disabled={busy}>
                    <Power className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(c)} disabled={busy}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); resetForm(); }}
        title={editMode ? "Sinfni tahrirlash" : "Yangi sinf ochish"}>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <SectionTitle emoji="🏫" text="Sinf ma'lumotlari" />
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Sinf nomi <span className="text-amber-600">*</span>
            </label>
            <input value={newClassId} onChange={(e) => setNewClassId(e.target.value)}
              placeholder="9-A" className="input-field" autoFocus disabled={editMode} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Izoh</label>
            <input value={newDesc} onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Masalan: Ingliz tili chuqurlashtirilgan" className="input-field" />
          </div>

          <SectionTitle emoji="👨‍🏫" text="Sinf rahbari" />
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Ism-familiya *</label>
            <input value={teacherName} onChange={(e) => setTeacherName(e.target.value)}
              placeholder="Tursinova M.A." className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Telefon *</label>
            <input type="tel" value={teacherPhone}
              onChange={(e) => {
                const c = e.target.value.replace(/\D/g, "");
                if (c.length === 0) { setTeacherPhone(initialPhone()); return; }
                setTeacherPhone(formatPhone(e.target.value));
              }}
              placeholder="+998 90 123 45 67" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Telegram ID</label>
            <input value={teacherTg} onChange={(e) => setTeacherTg(e.target.value.replace(/\D/g, ""))}
              placeholder="123456789" className="input-field" />
          </div>

          <SectionTitle emoji="👨‍💼" text="Sinf admini" />
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Ism-familiya *</label>
            <input value={adminName} onChange={(e) => setAdminName(e.target.value)}
              placeholder="Karimova A." className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Telefon *</label>
            <input type="tel" value={adminPhone}
              onChange={(e) => {
                const c = e.target.value.replace(/\D/g, "");
                if (c.length === 0) { setAdminPhone(initialPhone()); return; }
                setAdminPhone(formatPhone(e.target.value));
              }}
              placeholder="+998 90 123 45 67" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Telegram ID</label>
            <input value={adminTg} onChange={(e) => setAdminTg(e.target.value.replace(/\D/g, ""))}
              placeholder="987654321" className="input-field" />
          </div>

          {formError && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{formError}</p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button variant="secondary" onClick={() => { setModalOpen(false); resetForm(); }}
              disabled={busy} className="flex-1">
              <X className="w-4 h-4" /> Bekor
            </Button>
            <Button onClick={handleSave} disabled={busy} className="flex-1">
              {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Saqlanmoqda...</> : 
                <><Check className="w-4 h-4" /> {editMode ? "Saqlash" : "Yaratish"}</>}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

interface SectionTitleProps {
  emoji: string;
  text: string;
}

function SectionTitle(props: SectionTitleProps) {
  return (
    <div className="flex items-center gap-2 pt-2 pb-1 border-t border-amber-100">
      <span className="text-lg">{props.emoji}</span>
      <span className="text-sm font-bold text-amber-900 uppercase tracking-wider">
        {props.text}
      </span>
    </div>
  );
}