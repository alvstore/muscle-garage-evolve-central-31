
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
  targetGoals?: string[];
  target_goals?: string[];
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
