
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
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  is_active?: boolean;
  manager_id?: string;
  tax_rate?: number;
  max_capacity?: number;
  opening_hours?: string;
  closing_hours?: string;
  created_at?: string;
  updated_at?: string;
}

// Membership Types
export interface Membership {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration_days: number;
  features?: any;
  is_active?: boolean;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
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
  workoutDays?: WorkoutDay[];
  created_at?: string;
  updated_at?: string;
}

export interface WorkoutDay {
  id: string;
  name: string;
  workout_plan_id: string;
  description?: string;
  day_label?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// Exercise Types
export interface Exercise {
  id: string;
  name: string;
  workout_day_id: string;
  sets: number;
  reps: number;
  weight?: number;
  rest?: number;
  rest_time?: string;
  notes?: string;
  media_url?: string;
  muscle_group_tag?: string;
  created_at?: string;
  updated_at?: string;
}
