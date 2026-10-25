import { api } from "./client";

export interface BotStudent {
  studentId: string;
  fullName: string;
  classId: string;
  phone: string;
  motherPhone?: string;
  fatherPhone?: string;
  telegramId?: number | null;
  status: "connected" | "pending" | "blocked" | "not_registered";
  connectedAt?: string;
  blockedAt?: string;
}

export interface BotStatusResponse {
  ok: boolean;
  total: number;
  stats: {
    connected: number;
    pending: number;
    blocked: number;
    not_registered: number;
  };
  connected: BotStudent[];
  pending: BotStudent[];
  blocked: BotStudent[];
  not_registered: BotStudent[];
}

export async function getBotStatus(classId = "") {
  return api.get<BotStatusResponse>(
    `/api/bot/status${classId ? `?classId=${classId}` : ""}`
  );
}