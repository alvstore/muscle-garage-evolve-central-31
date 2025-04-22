
export interface MealPlan {
  id: string;
  name: string;
  time: string;
  description?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  food_items: FoodItem[];
}

export interface FoodItem {
  id: string;
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  notes?: string;
}

// Database model version with snake_case fields
export interface DietPlan {
  id: string;
  name: string;
  diet_type: string;
  description?: string;
  daily_calories: number;
  protein_ratio: number;
  carbs_ratio: number;
  fat_ratio: number;
  notes?: string;
  is_custom: boolean;
  is_global: boolean;
  member_id?: string;
  trainer_id?: string;
  branch_id?: string;
  meal_plans?: MealPlan[];
  created_at: string;
  updated_at: string;
}

// Client-friendly version with camelCase fields
export interface DietPlanClient {
  id: string;
  name: string;
  dietType: string;
  description?: string;
  dailyCalories: number;
  proteinRatio: number;
  carbsRatio: number;
  fatRatio: number;
  notes?: string;
  isCustom: boolean;
  isGlobal: boolean;
  memberId?: string;
  trainerId?: string;
  branchId?: string;
  mealPlans: MealPlan[];
  createdAt: string;
  updatedAt: string;
}

// Adapter functions to convert between DB model and client model
export function adaptToDietPlanClient(plan: DietPlan): DietPlanClient {
  return {
    id: plan.id,
    name: plan.name,
    dietType: plan.diet_type,
    description: plan.description,
    dailyCalories: plan.daily_calories,
    proteinRatio: plan.protein_ratio,
    carbsRatio: plan.carbs_ratio,
    fatRatio: plan.fat_ratio,
    notes: plan.notes,
    isCustom: plan.is_custom,
    isGlobal: plan.is_global,
    memberId: plan.member_id,
    trainerId: plan.trainer_id,
    branchId: plan.branch_id,
    mealPlans: plan.meal_plans || [],
    createdAt: plan.created_at,
    updatedAt: plan.updated_at
  };
}

export function adaptToDietPlanDb(plan: DietPlanClient): DietPlan {
  return {
    id: plan.id,
    name: plan.name,
    diet_type: plan.dietType,
    description: plan.description,
    daily_calories: plan.dailyCalories,
    protein_ratio: plan.proteinRatio,
    carbs_ratio: plan.carbsRatio,
    fat_ratio: plan.fatRatio,
    notes: plan.notes,
    is_custom: plan.isCustom,
    is_global: plan.isGlobal,
    member_id: plan.memberId,
    trainer_id: plan.trainerId,
    branch_id: plan.branchId,
    meal_plans: plan.mealPlans,
    created_at: plan.createdAt,
    updated_at: plan.updatedAt
  };
}
