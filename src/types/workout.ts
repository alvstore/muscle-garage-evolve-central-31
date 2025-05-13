
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
  restTime?: string;
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

// Plan types based on visibility and assignment
export type PlanType = 'public' | 'assigned' | 'private';

// Base workout plan interface
export interface WorkoutPlan {
  id: string;
  type: PlanType;
  title: string;
  description: string;
  days: WorkoutDay[];
  exercises: Exercise[];
  created_by: string;
  member_id?: string;
  trainer_id?: string;
  assigned_by?: string;
  created_at: string;
  updated_at: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetGoals?: string[];
  notes?: string;
}

// Interface for workout plan creation
export type CreateWorkoutPlan = Omit<WorkoutPlan, 'id' | 'created_at' | 'updated_at'>;

// Interface for workout plan updates
export type UpdateWorkoutPlan = Partial<WorkoutPlan>;

// Interface for workout plan assignment
export interface WorkoutPlanAssignment {
  planId: string;
  memberId: string;
  assignedBy: string;
  type: 'assigned' | 'private';
  trainerId?: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

// Interface for workout plan filters
export interface WorkoutPlanFilters {
  type?: PlanType[];
  memberId?: string;
  trainerId?: string;
  difficulty?: string;
  search?: string;
}