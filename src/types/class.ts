
// Progress tracking metrics
export interface ProgressMetrics {
  weight: number;
  bodyFatPercentage: number; 
  bmi: number;
  muscleGain: number;
}

// Class and booking related types
export type ClassDifficulty = "beginner" | "intermediate" | "advanced" | "all";

export interface GymClass {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  capacity: number;
  enrolled: number;
  trainer: string;
  trainerName?: string;
  trainerAvatar?: string;
  trainerId?: string;
  difficulty: ClassDifficulty;
  type: string;
  location?: string;
  image?: string;
  status?: string;
  level?: string;
  duration?: number;
  recurring?: boolean;
  recurringPattern?: string;
}

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "attended" | "missed" | "booked" | "no-show";

export interface ClassBooking {
  id: string;
  classId: string;
  memberId: string;
  memberName?: string;
  memberAvatar?: string;
  bookingDate: string;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  attendanceTime?: string;
  paidAmount?: number;
  paymentStatus?: string;
  razorpayOrderId?: string;
}
