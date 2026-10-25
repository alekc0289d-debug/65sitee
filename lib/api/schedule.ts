import { api } from "./client";

export interface ScheduleDay {
  lessonNumber: number;
  subject: string;
  teacher: string;
  startTime: string;
  endTime: string;
  room: string;
}

export async function getClassSchedule(classId: string) {
  return api.get<{
    ok: boolean;
    classId: string;
    days: Record<string, ScheduleDay[]>;
  }>(`/api/schedule/${classId}`);
}

export async function saveClassSchedule(
  classId: string,
  days: Record<string, ScheduleDay[]>,
  enteredBy: string
) {
  return api.post<{ ok: boolean; days?: number; message?: string }>(
    "/api/schedule/save",
    { classId, days, enteredBy }
  );
}