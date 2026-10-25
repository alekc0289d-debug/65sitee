import { api } from "./client";

export interface Settings {
  registrationEnabled: boolean;
  registrationDisabledMessage: string;
  syncEnabled: boolean;
}

export async function getSettings() {
  return api.get<Settings>("/api/settings");
}

export async function updateSettings(payload: Partial<Settings>) {
  return api.post<{ ok: boolean; message?: string }>("/api/settings/update", payload);
}