export interface StudentFull {
  id: string;
  fullName: string;
  classId: string;
  phone?: string;
  motherPhone?: string;
  fatherPhone?: string;
  status: string;
  gradesCount?: number;
  subjectsCount?: number;
  scheduleCount?: number;
  registeredAt?: string;
}