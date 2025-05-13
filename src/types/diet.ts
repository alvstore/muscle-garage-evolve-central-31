
export interface DietPlan {
  id: string;
  title: string;
  description?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_template: boolean;
  member_id?: string;
  branch_id: string;
  days: DietDay[];
}

export interface DietDay {
  id: string;
  day_number: number;
  meals: DietMeal[];
}

export interface DietMeal {
  id: string;
  name: string;
  time?: string;
  description?: string;
  calories?: number;
  proteins?: number;
  carbs?: number;
  fats?: number;
  items: DietItem[];
}

export interface DietItem {
  id: string;
  name: string;
  quantity?: string;
  calories?: number;
  proteins?: number;
  carbs?: number;
  fats?: number;
  notes?: string;
}

export interface NutritionGoal {
  id: string;
  member_id: string;
  daily_calories: number;
  protein_percentage: number;
  carbs_percentage: number;
  fats_percentage: number;
  created_at: string;
  updated_at: string;
}
