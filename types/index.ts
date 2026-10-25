// ============================================================
// Rollar
// ============================================================
export type Role =
  | "student"
  | "parent"
  | "teacher"
  | "class_admin"
  | "director"
  | "bosh_admin";

// ============================================================
// User
// ============================================================
export interface User {
  id: string;
  fullName: string;
  role: Role;
  classId?: string;
  phone?: string;
  totalScore?: number;
  schoolId?: string;
  botStatus?: "connected" | "pending" | "blocked";
}

// ============================================================
// Baholar
// ============================================================
export interface Grade {
  id: string;
  subject: string;
  score: number | null;
  rawValue: string;
  maxValue?: number | null;
  isPercent?: boolean;
  date: string;
  dayOfWeek?: string;
  markType?: string;
  isFinal?: boolean;
  mood?: string;
  source?: string;
}

// ============================================================
// O'quvchi
// ============================================================
export interface Student {
  id: string;
  fullName: string;
  classId: string;
  phone?: string;
  motherPhone?: string;
  fatherPhone?: string;
  gradesCount?: number;
  subjectsCount?: number;
  averageScore?: number;
  connected?: boolean;
  botStatus?: string;
  status?: string;
  registeredAt?: string;
}

export interface StudentDetail {
  studentId: string;
  fullName: string;
  registered: boolean;
  connected: boolean;
  paid: boolean;
  status: string;
}

// ============================================================
// To'lov
// ============================================================
export interface Payment {
  studentId: string;
  classId: string;
  year: number;
  amount: number;
  status: "paid" | "unpaid";
  paidAt?: string;
  collectedBy?: string;
}

export interface PaymentSubmission {
  id: string;
  classId: string;
  year: number;
  week: number;
  studentCount: number;
  totalAmount: number;
  submittedBy: string;
  submittedAt: string;
  status: "pending" | "received";
}

export interface ClassReport {
  classId: string;
  year: number;
  total: number;
  registered: number;
  connected: number;
  expired: number;
  paid: number;
  notRegistered: number;
  notConnected: number;
  unpaid: number;
  expectedAmount: number;
  collectedAmount: number;
  detail: StudentDetail[];
}

// ============================================================
// Sovg'a
// ============================================================
export interface Prize {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  year: number;
  month: number;
  place: 1 | 2 | 3;
  moneyAmount: number;
  premiumMonths: number;
  choice: "money" | "premium" | null;
  status: "awaiting_choice" | "pending" | "given";
}

// ============================================================
// Reyting
// ============================================================
export interface RankingEntry {
  studentId: string;
  fullName: string;
  classId: string;
  rank: number;
  avg: number;
  growth: number;
  final: number;
}

// ============================================================
// Topshiriq
// ============================================================
export type TaskStatus = "locked" | "available" | "done";
export type TaskType = "auto" | "test" | "grade" | "custom";

export interface Task {
  id: string;
  taskId: string;
  order: number;
  title: string;
  desc: string;
  reward: number;
  type: TaskType;
  check: Record<string, unknown>;
  status?: TaskStatus;
  completedAt?: string;
}

// ============================================================
// Test
// ============================================================
export interface TestQuestion {
  q: string;
  options: string[];
}

export interface Test {
  testId: string;
  subject: string;
  difficulty: "easy" | "medium" | "hard";
  reward: number;
  questionCount: number;
  questions: TestQuestion[];
}

export interface TestAttempt {
  id: string;
  userId: string;
  testId: string;
  subject: string;
  score: number;
  total: number;
  percent: number;
  passed: boolean;
  reward: number;
  finishedAt: string;
}

// ============================================================
// Yangilik
// ============================================================
export type NewsCategory =
  | "umumiy"
  | "talim"
  | "tadbir"
  | "musobaqa"
  | "e'lon"
  | "muvaffaqiyat";

export type NewsPriority = "past" | "orta" | "yuqori" | "shoshilinch";

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: NewsCategory;
  priority: NewsPriority;
  imageUrl?: string;
  pinned: boolean;
  authorId: string;
  authorRole: string;
  authorName: string;
  views: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Jadval
// ============================================================
export interface ScheduleLesson {
  lessonNumber: number;
  subject: string;
  teacher: string;
  startTime: string;
  endTime: string;
  room: string;
}

export interface ClassSchedule {
  classId: string;
  days: Record<string, ScheduleLesson[]>;
  enteredBy: string;
  updatedAt?: string;
}