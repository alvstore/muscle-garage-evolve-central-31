export interface Member {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  status: string;
  membershipStatus: string;
  membershipId?: string;
  membershipStartDate?: string;
  membershipEndDate?: string;
  avatar?: string;
  // Add properties being used across components
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  goal?: string;
  trainerId?: string;
}

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
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface Trainer {
  id: string;
  email: string;
  name: string;
  role: 'trainer';
  avatar?: string;
  phone?: string;
  specialty?: string;
  bio?: string;
  rating?: number;
}

export interface Staff {
  id: string;
  email: string;
  name: string;
  role: 'staff';
  avatar?: string;
  phone?: string;
  position?: string;
  department?: string;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
  role: 'admin';
  avatar?: string;
  phone?: string;
}

export interface Class {
  id: string;
  name: string;
  description?: string;
  trainerId: string;
  capacity: number;
  enrolled: number;
  startTime: string;
  endTime: string;
  type: string;
  location: string;
}

export interface Membership {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  benefits: string[];
  active: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
  targetRoles: UserRole[];
  expiresAt: string;
}

export interface DashboardSummary {
  totalMembers: number;
  todayCheckIns: number;
  revenue: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  pendingPayments: {
    count: number;
    total: number;
  };
  upcomingRenewals: number;
  attendanceTrend: { date: string; count: number }[];
  membersByStatus: {
    active: number;
    inactive: number;
    expired: number;
  };
  recentNotifications: {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    createdAt: string;
  }[];
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  trainerId: string;
  memberId: string;
  workoutDays: WorkoutDay[];
  isCustom?: boolean;
  isGlobal?: boolean;
  updatedAt: string;
  createdAt: string;
}

export interface WorkoutDay {
  id: string;
  name: string;
  description?: string;
  exercises: Exercise[];
  dayLabel?: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  rest?: number;
  notes?: string;
}

export interface DietPlan {
  id: string;
  name: string;
  description?: string;
  trainerId: string;
  memberId: string;
  mealPlans: MealPlan[];
  isCustom?: boolean;
  isGlobal?: boolean;
  dailyCalories?: number;
  dietType?: string;
  goal?: string;
  updatedAt: string;
  createdAt: string;
  notes?: string;
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
    calories?: number;
  };
}

export interface BodyMeasurement {
  id?: string;
  memberId?: string;
  date: string;
  weight?: number;
  height?: number;
  bmi?: number;
  bodyFat?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  thighs?: number;
  notes?: string;
}
