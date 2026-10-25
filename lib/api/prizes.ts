import { api } from "./client";
import type { RankingEntry, Prize } from "@/types";

export async function getClassRanking(classId: string, year: number, month: number) {
  return api.get<RankingEntry[]>(
    `/api/prizes/class/${classId}/ranking?year=${year}&month=${month}`
  );
}

export async function getSchoolRanking(year: number, month: number) {
  return api.get<RankingEntry[]>(
    `/api/prizes/school/ranking?year=${year}&month=${month}`
  );
}

export async function choosePrize(
  prizeId: string,
  choice: "money" | "premium",
  telegramUsername = ""
) {
  return api.post<{ ok: boolean; message?: string }>("/api/prizes/choose", {
    prizeId,
    choice,
    telegramUsername,
  });
}

export async function getAwaitingPrizes(studentId: string) {
  return api.get<Prize[]>(`/api/prizes/awaiting/${studentId}`);
}