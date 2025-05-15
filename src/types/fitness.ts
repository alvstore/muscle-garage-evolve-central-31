
export interface DietPlan {
  id: string;
  name: string;
  description?: string;
  dietType?: string;
  totalCalories?: number;
  member_id?: string;
  trainer_id?: string;
  mealPlans?: MealPlan[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MealPlan {
  id: string;
  name: string;
  time?: string;
  calories?: number;
  dietPlanId?: string;
  items?: MealItem[];
}

export interface MealItem {
  id: string;
  name: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  mealPlanId?: string;
}
