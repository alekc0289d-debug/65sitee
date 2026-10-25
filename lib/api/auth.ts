import { api } from "./client";

export interface RegisterPayload {
  fullName: string;
  login: string;
  password: string;
  phone: string;
  motherPhone: string;
  fatherPhone?: string;
  classId: string;
  consent: boolean;
}

export interface RegisterStatus {
  status: "processing" | "done" | "error";
  step: string;
  message: string;
  progress: number;
  result?: {
    student_id: string;
    student: { fullName: string; classId: string };
  };
}

export interface LoginResponse {
  ok: boolean;
  token?: string;
  user?: {
    id: string;
    fullName: string;
    role: string;
    roles?: string[]; 
    classId: string;
    phone: string;
    totalScore: number;
  };
  message?: string;
}

export async function register(payload: RegisterPayload) {
  return api.post<{ task_id: string }>("/api/register", payload);
}

export async function registerStatus(taskId: string) {
  return api.get<RegisterStatus>(`/api/register/status/${taskId}`);
}

export async function login(phone: string, password: string) {
  return api.post<LoginResponse>("/api/auth/login", { phone, password });
}

export async function logout(token: string) {
  return api.post("/api/auth/logout", { token });
}

// ============================================================
// PAROLNI TIKLASH (Netlify ogohlantirishini tuzatadi)
// ============================================================
export async function forgotPassword(phone: string) {
  return api.post<{
    ok: boolean;
    sent?: boolean;
    method?: string;
    message?: string;
    code?: string;
    botLink?: string;
  }>("/api/auth/forgot-password", { phone });
}

export async function getMe(token: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: { "X-User-Token": token },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ============================================================
// SESSION
// ============================================================
const TOKEN_KEY = "maktabim_token";
const USER_KEY = "maktabim_user";

export function saveSession(token: string, user: any) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): LoginResponse["user"] | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}