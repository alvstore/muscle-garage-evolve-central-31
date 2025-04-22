
export interface DietPlan {
  id: string;
  name: string;
  description?: string;
  member_id?: string;
  trainer_id: string;
  diet_type?: string;
  goal?: string;
  notes?: string;
  daily_calories?: number;
  is_custom: boolean;
  is_global: boolean;
  created_at: string;
  updated_at: string;
}

export interface DietAssignment {
  id: string;
  plan_id: string;
  member_id: string;
  trainer_id: string;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MealPlan {
  id: string;
  diet_plan_id: string;
  name: string;
  time?: string;
  created_at: string;
  updated_at: string;
}

export interface MealItem {
  id: string;
  meal_plan_id: string;
  name: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  created_at: string;
  updated_at: string;
}
