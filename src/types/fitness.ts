
export interface DietPlan {
  id: string;
  name: string;
  description?: string;
  diet_type?: string;
  daily_calories?: number;
  notes?: string;
  member_id?: string;
  memberId?: string; // For backward compatibility
  trainer_id: string;
  trainerId?: string; // For backward compatibility
  is_custom?: boolean;
  isCustom?: boolean; // For backward compatibility
  is_global?: boolean;
  isGlobal?: boolean; // For backward compatibility
  goal?: string;
  created_at?: string;
  createdAt?: string; // For backward compatibility
  updated_at?: string;
  updatedAt?: string; // For backward compatibility
  mealPlans?: MealPlan[]; // Add this for compatibility with DietPlanForm
}

export interface MealPlan {
  id: string;
  name: string;
  diet_plan_id?: string;
  time?: string;
  created_at?: string;
  updated_at?: string;
  items?: string[]; // Add for compatibility with DietPlanForm
  macros?: {
    protein: number;
    carbs: number;
    fats: number;
    calories: number;
  };
}

export interface ProgressMetrics {
  weight: number;
  bodyFatPercentage: number;
  bmi: number;
  muscleGain: number;
}
