
export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  rest: number;
  muscleGroupTag?: string;
  videoUrl?: string;
  imageUrl?: string;
  notes?: string;
  description?: string;
}

export interface WorkoutDay {
  id: string;
  name: string;
  dayLabel?: string;
  exercises: Exercise[];
  notes?: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  trainerId?: string;
  memberId?: string;
  workoutDays: WorkoutDay[];
  days?: WorkoutDay[];
  createdAt?: string;
  updatedAt?: string;
  isCustom?: boolean;
  isCommon?: boolean;
  notes?: string;
  createdBy?: string;
}

export interface DietPlan {
  id: string;
  name: string;
  description: string;
  trainerId?: string;
  memberId?: string;
  mealPlans: MealPlan[];
  createdAt?: string;
  updatedAt?: string;
  isCustom?: boolean;
  notes?: string;
}

export interface MealPlan {
  id: string;
  name: string;
  time: string;
  description?: string;
  recipes: Recipe[];
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions?: string;
  nutritionalValue: {
    protein: number;
    carbs: number;
    fats: number;
    calories?: number;
  };
  imageUrl?: string;
}
