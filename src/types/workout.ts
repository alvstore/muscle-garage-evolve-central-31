
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
  rest?: number;
  restTime?: string; // Added restTime property
  notes?: string;
  mediaUrl?: string;
  muscleGroupTag?: string;
}

export interface WorkoutDay {
  id: string;
  name: string;
  dayLabel?: string;
  exercises: Exercise[];
  notes?: string;
  description?: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  trainerId: string;
  workoutDays: WorkoutDay[];
  targetGoals?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isGlobal: boolean;
  createdAt: string;
  updatedAt: string;
  memberId: string;
  createdBy?: string;
  days?: WorkoutDay[];
  isCommon?: boolean;
  isCustom?: boolean;
  notes?: string;
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

// Add WorkoutAssignment interface
export interface WorkoutAssignment {
  id: string;
  planId: string;
  memberId: string;
  trainerId: string;
  assignedAt: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}
