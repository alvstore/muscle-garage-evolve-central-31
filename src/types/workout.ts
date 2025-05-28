
export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  trainer_id: string;
  member_id?: string;
  is_global: boolean;
  is_custom: boolean;
  goal?: string;
  duration_weeks?: number;
  difficulty_level?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  workout_days?: WorkoutDay[];
}

export interface WorkoutDay {
  id: string;
  workout_plan_id: string;
  day_number: number;
  name: string;
  description?: string;
  rest_day: boolean;
  exercises?: Exercise[];
  created_at: string;
  updated_at: string;
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
