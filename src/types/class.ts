
export type BookingStatus = "confirmed" | "cancelled" | "attended" | "missed" | "pending" | "booked" | "no-show";

export interface ClassBooking {
  id: string;
  classId: string;
  memberId: string;
  memberName: string;
  memberAvatar?: string;
  bookingDate: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  attendanceTime?: string;
  notes?: string;
}

export interface GymClass {
  id: string;
  name: string;
  description: string;
  trainerId: string;
  trainerName: string;
  trainerAvatar?: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  capacity: number;
  enrolled: number;
  location: string;
  type: string;
  level: ClassDifficulty;
  difficulty?: ClassDifficulty; // Alias for level to maintain compatibility
  image?: string;
  isRecurring: boolean;
  recurring?: boolean; // Alias for isRecurring to maintain compatibility
  recurringDays?: number[]; // 0 = Sunday, 1 = Monday, etc.
  recurringPattern?: number[]; // Alias for recurringDays to maintain compatibility
  createdAt: string;
  updatedAt: string;
}

export type ClassDifficulty = "beginner" | "intermediate" | "advanced" | "all";

export interface ClassAttendance {
  id: string;
  classId: string;
  className: string;
  bookingId: string;
  memberId: string;
  memberName: string;
  checkInTime: string;
  checkOutTime?: string;
  status: "present" | "absent" | "late";
  notes?: string;
}

export interface ClassFilterOptions {
  trainer: string[];
  type: string[];
  level: ClassDifficulty[];
  timeOfDay: string[];
  dayOfWeek: number[];
}

export interface ProgressMetrics {
  date: string;
  weight?: number; // in kg
  bodyFatPercentage?: number;
  bmi?: number;
  muscleGain?: number; // in kg
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
  };
}

export interface FitnessGoal {
  id: string;
  memberId: string;
  targetWeight?: number;
  targetBodyFat?: number;
  targetMuscleGain?: number;
  description: string;
  startDate: string;
  targetDate: string;
  initialMetrics: ProgressMetrics;
  currentMetrics: ProgressMetrics;
  progress: number; // percentage from 0 to 100
  status: "active" | "completed" | "abandoned";
}
