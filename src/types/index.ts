// Add or append to existing types file
export interface GenericStringError {
  id?: string;
  message: string;
}

// User related types
export type UserRole = 'admin' | 'staff' | 'trainer' | 'member';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  branchId?: string;
  branchIds?: string[];
  isBranchManager?: boolean;
  primaryBranchId?: string;
  dateOfBirth?: string;
  
  // Address fields
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

// Member specific interface
export interface Member {
  id: string;
  name: string;
  email?: string;
  role: 'member';
  phone?: string;
  status: string;
  membershipStatus: string;
  membershipId?: string;
  membershipStartDate?: string;
  membershipEndDate?: string;
  avatar?: string;
  goal?: string;
  trainer?: string;
  trainerId?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string; // Added zipCode property
}

// Trainer specific interface
export interface Trainer {
  id: string;
  name: string;
  email: string;
  role: 'trainer';
  specialty?: string;
  bio?: string;
  avatar?: string;
  phone?: string;
  status: string;
  branchId?: string;
  rating?: number; // Added rating property
}

// Staff specific interface
export interface Staff {
  id: string;
  name: string;
  email: string;
  role: 'staff';
  position?: string;
  phone?: string;
  avatar?: string;
  status: string;
  branchId?: string;
  department?: string; // Added department property
}

// Admin specific interface
export interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'admin';
  avatar?: string;
  phone?: string;
}

// Class interface
export interface Class {
  id: string;
  name: string;
  description?: string;
  trainer: string;
  trainerId: string;
  startTime: string;
  endTime: string;
  capacity: number;
  enrolled: number;
  location: string;
  branchId?: string;
  type?: string; // Added type property
}

// Membership interface
export interface Membership {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  durationType: 'days' | 'weeks' | 'months' | 'years';
  features?: string[];
  isActive: boolean;
  branchId?: string;
}

// Announcement interface
export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  date: string;
  branchId?: string;
  targetRoles?: UserRole[];
  priority?: 'low' | 'medium' | 'high';
  expiresAt?: string;
  createdBy?: string; // Added createdBy property
  createdAt?: string;
}

// Dashboard summary interface
export interface DashboardSummary {
  totalMembers: number;
  activeMembers: number;
  newMembers: number;
  revenue: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  todayCheckIns: number;
  upcomingRenewals: number;
  expiringMemberships: number;
  pendingPayments?: {  // Changed to object type to match usage in mockData
    count: number;
    total: number;
  };
  classes?: {
    total: number;
    upcoming: number;
    today: number;
  };
  attendanceTrend?: {  // Added attendanceTrend property
    date: string;
    count: number;
  }[];
  membersByStatus?: {  // Added membersByStatus property
    active: number;
    inactive: number;
    expired: number;
  };
  revenueData?: any[];  // Added revenueData property
}

// Workout plan related interfaces
export interface WorkoutPlan {
  id: string;
  name: string;
  trainerId: string;
  memberId?: string;
  isGlobal?: boolean;
  isCustom?: boolean;
  description?: string;
  difficulty?: string;
  notes?: string;
  days?: WorkoutDay[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutDay {
  id: string;
  name: string;
  dayLabel?: string;
  description?: string;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  rest?: number;
  notes?: string;
  mediaUrl?: string;
}

// Diet plan related interfaces
export interface DietPlan {
  id: string;
  name: string;
  memberId: string;
  trainerId: string;
  mealPlans: MealPlan[];
  notes?: string;
  isCustom: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MealPlan {
  id: string;
  name: string;
  time: string;
  items: string[];
  macros: {
    protein: number;
    carbs: number;
    fats: number;
    calories: number;
  };
}

// Fix the type conversion issue in use-supabase-query.ts
export function convertErrorToGenericError<T>(errors: any[]): T[] {
  return errors as unknown as T[];
}
