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