
export interface DietPlan {
  id: string;
  name: string;
  description: string;
  trainer_id: string;
  member_id?: string; 
  diet_type?: string;
  daily_calories?: number;
  goal?: string;
  notes?: string;
  is_global: boolean;
  is_custom: boolean;
  created_at: string;
  updated_at: string;
  // Reference to meal plans
  mealPlans?: MealPlan[];
}

export interface MealPlan {
  id: string;
  name: string;
  time?: string;
  diet_plan_id: string;
  created_at: string;
  updated_at: string;
  // Reference to meal items
  items?: MealItem[];
}

export interface MealItem {
  id: string;
  name: string;
  meal_plan_id: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  created_at: string;
  updated_at: string;
}
