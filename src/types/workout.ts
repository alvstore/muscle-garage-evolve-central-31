
export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: string | number;
  rest?: string | number;
  notes?: string;
  media_url?: string;
}

export interface WorkoutDay {
  id: string;
  name: string;
  description?: string;
  exercises: Exercise[];
  day_label?: string; // Day of week or sequential number
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  trainer_id: string;
  member_id: string;
  workout_days: WorkoutDay[];
  target_goals?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  is_global?: boolean;
  is_custom?: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  workout_days: WorkoutDay[];
  target_goals?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  trainer_id?: string;
  created_at: string;
  updated_at: string;
  is_global: boolean;
}
