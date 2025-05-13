
export interface MacroNutrients {
  protein: number;
  carbs: number;
  fats: number;
}

export interface MealPlan {
  id: string;
  name: string;
  time: string;
  items: string[];
  macros?: MacroNutrients;
}

export interface DietPlan {
  id: string;
  name: string;
  description?: string;
  diet_type?: string;
  daily_calories?: number;
  trainer_id: string;
  memberId: string;
  mealPlans: MealPlan[];
  notes?: string;
  goal?: string;
  is_global?: boolean;
  is_custom?: boolean;
  updatedAt: string;
  createdAt: string;
}
