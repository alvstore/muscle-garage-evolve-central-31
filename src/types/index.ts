
// Extended user type with branch information
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  branchId?: string; // Primary branch ID
  branchIds?: string[]; // All branches the user has access to
  isBranchManager?: boolean; // Whether the user is a branch manager
  address?: string; // Added address field
}

export type UserRole = "member" | "admin" | "staff" | "trainer";

// Extended member type with branch information
export interface MemberWithBranch {
  id: string;
  email: string;
  name: string;
  role: "member";
  avatar?: string;
  phone?: string;
  address?: string; // Added address field
  dateOfBirth?: string;
  goal?: string;
  trainerId?: string;
  membershipId?: string;
  membershipStatus: "active" | "inactive" | "expired";
  membershipStartDate?: string;
  membershipEndDate?: string;
  primaryBranchId: string;
  accessibleBranchIds: string[];
  // Body measurements
  height?: number;
  weight?: number;
  chest?: number;
  waist?: number;
  biceps?: number;
  thigh?: number;
  hips?: number;
  bodyFat?: number;
  // Progress tracking
  measurements?: MemberMeasurement[];
}

// New type for tracking measurement history
export interface MemberMeasurement {
  id: string;
  date: string;
  weight?: number;
  chest?: number;
  waist?: number;
  biceps?: number;
  thigh?: number;
  hips?: number;
  bodyFat?: number;
  notes?: string;
  photoUrl?: string;
  updatedBy: string; // ID of user who updated the record
  updatedByRole: UserRole; // Role of user who updated the record
}

// Extended Member type with measurements
export interface Member {
  id: string;
  email: string;
  name: string;
  role: "member" | "admin" | "staff" | "trainer";
  avatar?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  goal?: string;
  trainerId?: string;
  membershipId?: string;
  membershipStatus: "active" | "inactive" | "expired";
  membershipStartDate?: string;
  membershipEndDate?: string;
  // Body measurements
  height?: number;
  weight?: number;
  chest?: number;
  waist?: number;
  biceps?: number;
  thigh?: number;
  hips?: number;
  bodyFat?: number;
  // Progress tracking
  measurements?: MemberMeasurement[];
}

// Additional types needed for other components
export interface Class {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  capacity: number;
  enrolled: number;
  trainer: string;
  trainerName?: string;
  trainerAvatar?: string;
  trainerId?: string;
  difficulty: string;
  type: string;
  location?: string;
  status?: string;
}

export interface Trainer {
  id: string;
  name: string;
  email: string;
  role: "trainer";
  specialization: string[];
  experience: number;
  certifications: string[];
  avatar?: string;
  bio?: string;
  phone?: string;
  availability?: any[];
  specialty?: string[]; // Added to match usage in components
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: "staff";
  position: string;
  department: string;
  hireDate: string;
  avatar?: string;
  phone?: string; // Added to match usage in components
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: "admin";
  permissions: string[];
  avatar?: string;
  phone?: string; // Added to match usage in components
}

export interface Membership {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  isActive: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: "low" | "medium" | "high";
  createdAt: string;
  expiresAt: string;
  createdBy: string;
  targetRoles?: UserRole[]; // Added to match component usage
}

// Re-export from notification.ts types for backward compatibility
export { type TriggerEvent } from '@/types/notification';

export interface DashboardSummary {
  activeMemberships: number;
  totalRevenue: number;
  newMembers: number;
  upcomingClasses: number;
  occupancyRate: number;
  totalMembers: number;
  todayCheckIns: number;
  pendingPayments: number;
  upcomingRenewals: number;
  attendanceTrend: Array<{ date: string; count: number }>;
}

export interface Invoice {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  dueDate: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
}

export interface WorkoutPlan {
  id: string;
  memberId: string;
  trainerId: string;
  workoutDays: WorkoutDay[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutDay {
  id: string;
  name: string;
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
}

export interface DietPlan {
  id: string;
  memberId: string;
  trainerId: string;
  mealPlans: MealPlan[];
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
  };
}
