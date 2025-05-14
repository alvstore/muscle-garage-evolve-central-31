
export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  trainer_id: string;
  member_id?: string;
  difficulty?: string;
  is_custom?: boolean;
  is_global?: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
  workout_days?: WorkoutDay[];
  target_goals?: string[];
  targetGoals?: string[];
}

export interface WorkoutDay {
  id: string;
  name: string;
  workout_plan_id: string;
  day_label?: string;
  description?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  exercises?: Exercise[];
}

export interface Exercise {
  id: string;
  workout_day_id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  rest?: number;
  rest_time?: string;
  notes?: string;
  media_url?: string;
  muscle_group_tag?: string;
  created_at: string;
  updated_at: string;
}

// Add these interfaces to align with component usage
export interface WorkoutPlanDB {
  id: string;
  name: string;
  description: string;
  trainer_id: string;
  difficulty?: string;
  days: WorkoutDay[];
  isCommon?: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemberWorkout {
  id: string;
  memberId: string;
  workoutPlanId: string;
  isCustom: boolean;
  assignedBy: string;
  assignedAt: string;
}

export interface DietPlan {
  id: string;
  name: string;
  description?: string;
  trainer_id?: string;
  memberId: string;
  diet_type?: string;
  is_custom?: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  updatedAt?: string;
  mealPlans: MealPlan[];
}

export interface MealPlan {
  id: string;
  name: string;
  time?: string;
  items: string[];
  macros?: {
    protein: number;
    carbs: number;
    fats: number;
  };
}
