
export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface MealItem {
  id: string;
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface MealPlan {
  id: string;
  name: string;
  time: string;
  items: string[];
  macros: Macros;
}

export interface DietPlan {
  id: string;
  name?: string;
  description?: string;
  memberId: string;
  trainerId: string;
  mealPlans: MealPlan[];
  notes?: string;
  isCustom: boolean;
  isGlobal?: boolean;
  dietType?: 'standard' | 'vegetarian' | 'vegan' | 'keto' | 'paleo' | 'gluten-free';
  goal?: 'weight-loss' | 'maintenance' | 'muscle-gain';
  dailyCalories?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DietAssignment {
  id: string;
  planId: string;
  memberId: string;
  trainerId: string;
  assignedAt: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  servingSize: string;
  category: string;
}
