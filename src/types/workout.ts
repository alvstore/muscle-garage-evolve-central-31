
// Workout and fitness related types

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  difficulty?: string;
  notes?: string;
  is_custom: boolean;
  is_global: boolean;
  member_id?: string;
  trainer_id: string;
  created_at?: string;
  updated_at?: string;
  workout_days?: WorkoutDay[];
}

export interface WorkoutDay {
  id: string;
  name: string;
  day_label?: string;
  description?: string;
  notes?: string;
  workout_plan_id: string;
  exercises?: Exercise[];
  created_at?: string;
  updated_at?: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  rest?: number;
  rest_time?: string;
  notes?: string;
  muscle_group_tag?: string;
  media_url?: string;
  workout_day_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface DietPlan {
  id: string;
  name: string;
  description?: string;
  notes?: string;
  goal?: string;
  diet_type?: string;
  daily_calories?: number;
  is_custom: boolean;
  is_global: boolean;
  trainer_id: string;
  member_id?: string;
  created_at?: string;
  updated_at?: string;
  meal_plans?: MealPlan[];
}

export interface MealPlan {
  id: string;
  name: string;
  time?: string;
  diet_plan_id: string;
  meal_items?: MealItem[];
  created_at?: string;
  updated_at?: string;
}

export interface MealItem {
  id: string;
  name: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  meal_plan_id: string;
  created_at?: string;
  updated_at?: string;
}
