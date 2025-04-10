
// Add this to the existing file

export interface ClassBooking {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar?: string;
  status: "booked" | "confirmed" | "attended" | "missed" | "cancelled" | "pending" | "no-show";
  classId: string;
  bookingDate: string;
  attendanceTime?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressMetrics {
  weight: number;
  bodyFatPercentage: number;
  bmi: number;
  muscleGain: number;
}

export interface Class {
  id: string;
  name: string;
  description: string;
  trainer: string;
  trainerName?: string;
  trainerId?: string;
  trainerAvatar?: string;
  capacity: number;
  enrolled: number;
  duration: number;
  location: string;
  type: string;
  level: "beginner" | "intermediate" | "advanced" | "all";
  difficulty?: "beginner" | "intermediate" | "advanced" | "all";
  startTime: string;
  endTime: string;
  recurring: boolean;
  recurringPattern?: string;
  daysOfWeek?: number[];
  status?: "scheduled" | "completed" | "cancelled";
  createdAt?: string; // Add this property
  updatedAt?: string; // Add this property
}

// Add missing type definitions
export type GymClass = Class;
export type ClassDifficulty = "beginner" | "intermediate" | "advanced" | "all";
export type BookingStatus = "booked" | "confirmed" | "attended" | "missed" | "cancelled" | "pending" | "no-show";
