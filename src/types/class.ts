// Add this to the existing file

export interface ClassBooking {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar?: string;
  status: "booked" | "confirmed" | "attended" | "missed" | "cancelled" | "pending";
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
