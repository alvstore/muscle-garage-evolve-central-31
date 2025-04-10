
// Progress tracking metrics
export interface ProgressMetrics {
  weight: number;
  bodyFatPercentage: number; 
  bmi: number;
  muscleGain: number;
}

// Class and booking related types
export type ClassDifficulty = "beginner" | "intermediate" | "advanced";

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
  difficulty: ClassDifficulty;
  type: string;
  location?: string;
  image?: string;
}

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "attended" | "missed" | "booked";

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
}
