
export interface DietPlan {
  id: string;
  name?: string;
  description?: string;
  trainer_id: string;
  member_id?: string;
  is_global: boolean;
  is_custom: boolean;
  diet_type?: string;
  goal?: string;
  daily_calories?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  meal_plans?: MealPlan[];
}

export interface MealPlan {
  id: string;
  diet_plan_id: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  description?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  ingredients?: string[];
  instructions?: string;
  created_at: string;
  updated_at: string;
}
