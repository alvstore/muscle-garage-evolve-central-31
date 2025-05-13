
export interface DietPlan {
  id: string;
  title: string;
  description?: string;
  type: string; 
  diet_type?: string;
  daily_calories?: number;
  macronutrients?: Macronutrients;
  meals: DietMeal[];
  is_common: boolean;
  branch_id?: string;
  trainer_id?: string;
  created_at: string;
  updated_at: string;
  trainerId?: string;
  isCustom?: boolean;
}

export interface Macronutrients {
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface DietMeal {
  id?: string;
  name: string;
  time: string;
  foods: DietFood[];
  calories: number;
  macros?: Macronutrients;
  notes?: string;
}

export interface DietFood {
  id?: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  notes?: string;
}

export interface MemberDietPlan {
  id: string;
  member_id: string;
  diet_plan_id: string;
  is_active: boolean;
  start_date: string;
  end_date?: string;
  assigned_by: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
