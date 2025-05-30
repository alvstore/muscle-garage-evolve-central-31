
// Fitness and workout types
export interface WorkoutPlan {
  id: string;
  name?: string;
  description?: string;
  trainer_id: string;
  member_id?: string;
  goal?: string;
  is_global: boolean;
  is_custom: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DietPlan {
  id: string;
  name?: string;
  description?: string;
  trainer_id: string;
  member_id?: string;
  goal?: string;
  diet_type?: string;
  daily_calories?: number;
  is_global: boolean;
  is_custom: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkoutDay {
  id: string;
  workout_plan_id: string;
  name: string;
  day_number: number;
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
  muscle_group_tag?: string;
  media_url?: string;
  created_at: string;
  updated_at: string;
}

export interface BodyMeasurement {
  id: string;
  member_id: string;
  measurement_date: string;
  height?: number;
  weight?: number;
  bmi?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  thighs?: number;
  body_fat_percentage?: number;
  notes?: string;
  recorded_by?: string;
  branch_id?: string;
  created_at: string;
  updated_at: string;
}

export interface FitnessProgress {
  id: string;
  member_id: string;
  date: string;
  weight?: number;
  body_fat_percentage?: number;
  muscle_mass?: number;
  workout_completion?: number;
  diet_adherence?: number;
  notes?: string;
  created_by?: string;
  branch_id?: string;
  created_at: string;
  updated_at: string;
}

export interface AIWorkoutPlan {
  id: string;
  title: string;
  description?: string;
  plan_content: string;
  fitness_level?: string;
  goals?: string[];
  restrictions?: string[];
  days_per_week?: number;
  session_duration?: number;
  is_public: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface AIDietPlan {
  id: string;
  title: string;
  description?: string;
  plan_content: string;
  diet_type?: string;
  cuisine_type?: string;
  calories_per_day?: number;
  goals?: string[];
  restrictions?: string[];
  is_public: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}
