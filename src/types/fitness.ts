
export interface DietPlan {
  id: string;
  name: string;
  description?: string;
  diet_type?: string;
  daily_calories?: number;
  notes?: string;
  member_id?: string;
  trainer_id: string;
  is_custom?: boolean;
  is_global?: boolean;
  goal?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MealPlan {
  id: string;
  name: string;
  diet_plan_id: string;
  time?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProgressMetrics {
  weight: number;
  bodyFatPercentage: number;
  bmi: number;
  muscleGain: number;
}
