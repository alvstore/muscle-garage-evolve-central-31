
// Progress tracking metrics
export interface ProgressMetrics {
  weight: number;
  bodyFatPercentage: number; 
  bmi: number;
  muscleGain: number;
}

// Workout related types
export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  rest: number; // Required field
  notes?: string;
  mediaUrl?: string;
  muscleGroupTag?: string;
}

export interface WorkoutDay {
  id: string;
  dayLabel: string;
  name: string;
  exercises: Exercise[];
  notes?: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  isCustom: boolean;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  workoutDays: WorkoutDay[];
  memberId: string;
  trainerId: string;
}

export interface MemberWorkout {
  id: string;
  memberId: string;
  workoutPlanId: string;
  isCustom: boolean;
  customDays?: WorkoutDay[];
  assignedBy: string;
  assignedAt: string;
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
  createdAt?: string;
  updatedAt?: string;
  branchId?: string; // Added branch ID for multi-branch support
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

export interface MealMacros {
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
}

export interface MealPlan {
  id: string;
  name: string;
  time: string;
  items: string[];
  macros: MealMacros;
}

export interface DietPlan {
  id: string;
  memberId: string;
  trainerId: string;
  mealPlans: MealPlan[];
  notes?: string;
  isCustom: boolean;
  createdAt: string;
  updatedAt: string;
}

// Attendance types
export type AttendanceEntryType = "check-in" | "check-out";

export interface AttendanceEntry {
  id?: string;
  memberId: string;
  memberName: string;
  time: string; // ISO string format
  type: AttendanceEntryType;
  location: string;
  device: string;
  status: string;
}
