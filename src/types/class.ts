
// Add this to the existing file

export interface ClassBooking {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar?: string;
  status: "booked" | "confirmed" | "attended" | "missed" | "cancelled" | "pending";
  classId: string;  // Add this field
  bookingDate: string;  // Add this field
  attendanceTime?: string;  // Add this field
  notes?: string;  // Add this field
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
  trainerAvatar?: string;
  capacity: number;
  enrolled: number;
  duration: number;
  location: string;
  type: string;
  level: "beginner" | "intermediate" | "advanced" | "all";
  startTime: string;
  endTime: string;
  recurring: boolean;
  daysOfWeek?: number[];
}

// Add missing type definitions
export type GymClass = Class;
export type ClassDifficulty = "beginner" | "intermediate" | "advanced" | "all";
export type BookingStatus = "booked" | "confirmed" | "attended" | "missed" | "cancelled" | "pending" | "no-show";
