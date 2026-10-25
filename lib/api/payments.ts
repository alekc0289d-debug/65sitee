import { api } from "./client";
import type { ClassReport } from "@/types";

export async function getClassReport(classId: string, year: number) {
  return api.get<ClassReport>(`/api/payments/class/${classId}?year=${year}`);
}

export async function markPaid(
  studentId: string,
  year: number,
  collectedBy: string,
  notes = ""
) {
  return api.post<{ ok: boolean; message: string }>("/api/payments/mark-paid", {
    studentId,
    year,
    collectedBy,
    notes,
  });
}

export async function submitMoney(
  classId: string,
  year: number,
  week: number,
  submittedBy: string
) {
  return api.post<{
    ok: boolean;
    submissionId?: string;
    studentCount?: number;
    totalAmount?: number;
    message?: string;
  }>("/api/payments/submit-money", { classId, year, week, submittedBy });
}

export async function submitWeeklyReport(
  classId: string,
  year: number,
  week: number,
  submittedBy: string,
  notes = ""
) {
  return api.post<{ ok: boolean; reportId?: string }>("/api/reports/weekly/submit", {
    classId,
    year,
    week,
    submittedBy,
    notes,
  });
}