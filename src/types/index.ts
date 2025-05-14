// User Types
export type UserRole = "admin" | "manager" | "staff" | "trainer" | "member";

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: UserRole;
  branchId?: string | null;
  avatar?: string | null;
  phone?: string | null;
  branchIds?: string[];
  isBranchManager?: boolean;
}

// Branch Types
export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  email: string;
  phone: string;
  is_active: boolean;
  manager_id: string;
  branch_code: string;
  created_at: string;
  updated_at: string;
}

// Membership Types
export interface Membership {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration_days: number;
  duration_months?: number; // Added to fix LeadConversion.tsx errors
  features?: any;
  is_active?: boolean;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Member Types
export interface Member {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'pending';
  membershipStatus: 'active' | 'expired' | 'none';
  membershipId: string | null;
  membershipStartDate: Date | null;
  membershipEndDate: Date | null;
  role: 'member' | 'trainer' | 'staff' | 'admin';
  branchId?: string;
  gender?: string;
  bloodGroup?: string;
  occupation?: string;
  dateOfBirth?: Date | string | null;
  goal?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  id_type?: string;
  id_number?: string;
  emergencyContact?: string;
  notes?: string;
  profile_picture?: string;
  avatar?: string;
  trainerId?: string;
}

// Class Types
export interface Class {
  id: string;
  name: string;
  description?: string;
  trainer_id?: string;
  trainer?: string;
  type?: string;
  start_time: string;
  end_time: string;
  capacity: number;
  enrolled: number;
  location?: string;
  branch_id?: string;
  status?: string;
  difficulty?: string;
  level?: string;
}

// Diet Plan Types
export interface DietPlan {
  id: string;
  name: string;
  description?: string;
  trainer_id: string;
  member_id?: string;
  diet_type?: string;
  goal?: string;
  daily_calories?: number;
  is_custom?: boolean;
  is_global?: boolean;
  notes?: string;
  mealPlans: MealPlan[];
  createdAt?: string;
  updatedAt: string;
  memberId: string;
}

export interface MealPlan {
  id: string;
  name: string;
  time?: string;
  items: string[];
  macros?: {
    protein: number;
    carbs: number;
    fats: number;
  };
}

// Workout Plan Types
export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  trainer_id: string;
  member_id?: string;
  difficulty?: string;
  is_custom?: boolean;
  is_global?: boolean;
  notes?: string;
  workout_days: WorkoutDay[];
  target_goals?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface WorkoutDay {
  id: string;
  name: string;
  workout_plan_id?: string;
  description?: string;
  day_label?: string;
  notes?: string;
  exercises: Exercise[];
  created_at?: string;
  updated_at?: string;
}

// Exercise Types
export interface Exercise {
  id: string;
  name: string;
  workout_day_id?: string;
  sets: number;
  reps: number;
  weight?: number | string;
  rest?: number;
  rest_time?: string;
  notes?: string;
  media_url?: string;
  muscle_group_tag?: string;
  created_at?: string;
  updated_at?: string;
}

// Progress Metrics
export interface ProgressMetrics {
  weight: number;
  bodyFatPercentage: number;
  bmi: number;
  muscleGain: number;
}
