import { api } from "./client";

export interface UserItem {
  id: string;
  fullName: string;
  role: string;
  classId: string;
  phone: string;
  telegramId?: number | null;
  status: string;
  botStatus: string;
  totalScore: number;
  createdAt?: string;
}

export interface UserDetail extends UserItem {
  hasPassword: boolean;
  gradesCount: number;
}

export interface ClassStudent {
  studentId: string;
  fullName: string;
  classId: string;
  phone: string;
  motherPhone: string;
  fatherPhone: string;
  status: string;
  avg: number;
  gradesCount: number;
  paid: boolean;
  botStatus: string;
}

export async function listUsers(params: {
  role?: string;
  classId?: string;
  search?: string;
  status?: string;
  limit?: number;
} = {}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") q.set(k, String(v));
  });
  const qs = q.toString();
  return api.get<{ ok: boolean; count: number; users: UserItem[] }>(
    `/api/users${qs ? "?" + qs : ""}`
  );
}

export async function getUserDetail(userId: string) {
  return api.get<{ ok: boolean; user: UserDetail }>(`/api/users/${userId}`);
}

export async function updateUserRole(userId: string, newRole: string) {
  return api.post<{ ok: boolean; message?: string }>("/api/users/role", {
    userId,
    newRole,
  });
}

export async function deleteUser(userId: string) {
  return api.post<{ ok: boolean; message?: string }>("/api/users/delete", {
    userId,
    newRole: "",
  });
}

export async function getClassStudents(classId: string, year?: number) {
  const y = year || new Date().getFullYear();
  return api.get<{ ok: boolean; count: number; students: ClassStudent[] }>(
    `/api/class-admin/students/${classId}?year=${y}`
  );
}

export async function getStudentDetail(studentId: string) {
  return api.get<{
    ok: boolean;
    student: {
      id: string;
      fullName: string;
      classId: string;
      phone: string;
      motherPhone: string;
      fatherPhone: string;
      status: string;
      gradesCount: number;
      subjects: { name: string; avg: number; count: number }[];
      recentGrades: { id: string; subject: string; score: number; date: string }[];
    };
  }>(`/api/students/${studentId}`);
}

export async function updateStudent(payload: {
  studentId: string;
  fullName?: string;
  phone?: string;
  motherPhone?: string;
  fatherPhone?: string;
  classId?: string;
}) {
  return api.post<{ ok: boolean; message?: string }>("/api/students/update", payload);
}

export async function deleteStudent(studentId: string) {
  return api.post<{ ok: boolean; message?: string }>("/api/students/delete", {
    studentId,
  });
}