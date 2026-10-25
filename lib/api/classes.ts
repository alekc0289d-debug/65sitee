import { api } from "./client";

// ============================================================
// Tiplar
// ============================================================
export interface StaffInfo {
  fullName: string;
  phone: string;
  telegramId?: number | null;
  addedAt?: string;
}

export interface ClassItem {
  id: string;
  classId: string;
  description?: string;
  active: boolean;
  studentsCount?: number;
  classTeacher?: StaffInfo;
  classAdmin?: StaffInfo;
  createdBy?: string;
  createdByRole?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateClassPayload {
  classId: string;
  createdBy: string;
  createdByRole: string;
  description?: string;
  classTeacher: StaffInfo;
  classAdmin: StaffInfo;
}

// ============================================================
// API
// ============================================================
export async function listClasses(activeOnly = true) {
  return api.get<ClassItem[]>(`/api/classes?activeOnly=${activeOnly}`);
}

export async function getClass(classId: string) {
  return api.get<ClassItem>(`/api/classes/${classId}`);
}

export async function createClass(payload: CreateClassPayload) {
  return api.post<{
    ok: boolean;
    classId?: string;
    message?: string;
  }>("/api/classes/create", payload);
}

export async function deleteClass(classId: string, byRole: string) {
  return api.post<{ ok: boolean; message?: string }>("/api/classes/delete", {
    classId,
    byRole,
  });
}

export async function toggleClass(classId: string, byRole: string) {
  return api.post<{ ok: boolean; active?: boolean; message?: string }>(
    "/api/classes/toggle",
    { classId, byRole }
  );
}