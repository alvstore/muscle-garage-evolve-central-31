
export interface DietPlan {
  id: string;
  name: string;
  member_id: string;
  trainer_id: string;
  notes?: string;
  is_custom?: boolean;
  is_global?: boolean;
  mealPlans: MealPlan[];
  created_at: string;
  updated_at: string;
}

export interface MealPlan {
  id: string;
  name: string;
  time?: string;
  items: string[];
  macros: {
    protein: number;
    carbs: number;
    fats: number;
    calories: number;
  };
  diet_plan_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProgressMetrics {
  id?: string;
  date: string;
  weight?: number;
  body_fat_percentage?: number;
  muscle_mass?: number;
  workout_completion?: number;
  diet_adherence?: number;
  notes?: string;
  member_id: string;
}
