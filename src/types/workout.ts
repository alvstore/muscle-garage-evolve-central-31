
export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  trainer_id: string;
  member_id?: string;
  workout_days: WorkoutDay[];
  target_goals?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  is_global: boolean;
  is_custom: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkoutDay {
  id: string;
  name: string;
  description?: string;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: string | number;
  rest?: number | string;
  notes?: string;
  media_url?: string;
  muscle_group_tag?: string;
}

export interface MemberWorkout {
  id: string;
  member_id: string;
  workout_plan_id: string;
  is_custom: boolean;
  assigned_by: string;
  assigned_at: string;
}

// For compatibility with database format if needed
export interface WorkoutPlanDB {
  id: string;
  name: string;
  description: string;
  created_by: string;
  workout_days: WorkoutDay[];
  target_goals?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  is_global: boolean;
  is_custom: boolean;
  created_at: string;
  updated_at: string;
  member_id?: string;
  // Additional fields potentially needed for database format
  type?: string;
  title?: string;
  exercises?: Exercise[];
}
