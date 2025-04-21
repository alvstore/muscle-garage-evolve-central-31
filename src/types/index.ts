
export type UserRole = "admin" | "staff" | "trainer" | "member";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
}

export interface Member extends User {
  role: "member";
  dateOfBirth?: string;
  goal?: string;
  trainerId?: string;
  membershipId?: string;
  membershipStatus: "active" | "inactive" | "expired";
  membershipStartDate?: string;
  membershipEndDate?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface Trainer extends User {
  role: "trainer";
  specialty?: string;
  bio?: string;
  scheduleId?: string;
  rating?: number;
}

export interface Staff extends User {
  role: "staff";
  position?: string;
  department?: string;
}

export interface Admin extends User {
  role: "admin";
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
  location?: string;
}

export interface Membership {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  benefits: string[];
  active: boolean;
}

export interface Attendance {
  id: string;
  memberId: string;
  checkInTime: string;
  checkOutTime?: string;
  accessMethod: "rfid" | "fingerprint" | "manual";
}

export interface DietPlan {
  id: string;
  memberId: string;
  trainerId: string;
  createdAt: string;
  updatedAt: string;
  mealPlans: MealPlan[];
  notes?: string;
  isCustom?: boolean;
}

export interface MealPlan {
  id: string;
  name: string;
  time: string;
  items: string[];
  macros?: {
    protein: number;
    carbs: number;
    fats: number;
    calories?: number;
  };
}

export interface WorkoutPlan {
  id: string;
  memberId: string;
  trainerId: string;
  createdAt: string;
  updatedAt: string;
  workoutDays: WorkoutDay[];
  notes?: string;
  isCustom?: boolean;
}

export interface WorkoutDay {
  id: string;
  name: string;
  exercises: Exercise[];
  notes?: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  rest: number;
  notes?: string;
  muscleGroupTag?: string;
}

export interface ProgressRecord {
  id: string;
  memberId: string;
  date: string;
  weight?: number;
  bodyFatPercentage?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
  };
  photos?: string[];
  notes?: string;
}

export interface Inventory {
  id: string;
  name: string;
  category: "supplement" | "equipment" | "merchandise";
  quantity: number;
  price: number;
  supplier?: string;
  expiryDate?: string;
  reorderLevel: number;
}

export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  date: string;
  category: string;
  description?: string;
  recurring: boolean;
  recurringPeriod?: "daily" | "weekly" | "monthly" | "yearly";
}

export interface Invoice {
  id: string;
  memberId: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  dueDate: string;
  issuedDate: string;
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
  }[];
  paymentId?: string;
}

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  source: string;
  status: "new" | "contacted" | "trial" | "converted" | "lost";
  assignedTo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  followUpDate?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
  targetRoles: UserRole[];
  targetBranch?: string;
  expiresAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "system" | "payment" | "attendance" | "renewal" | "announcement";
  read: boolean;
  createdAt: string;
  link?: string;
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
  attendanceTrend: {
    date: string;
    count: number;
  }[];
  membersByStatus: {
    active: number;
    inactive: number;
    expired: number;
  };
  recentNotifications: Notification[];
}

export interface AttendanceEntry {
  memberId: string;
  memberName: string;
  time: string;
  type: "check-in" | "check-out";
  location: string;
  device: string;
  status: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  isActive: boolean;
}

export interface IncomeCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  isActive: boolean;
}

export interface CurrencySettings {
  code: string;
  symbol: string;
  position: 'before' | 'after';
  decimalPlaces: number;
}

export interface PaymentGateway {
  id: string;
  name: string;
  isActive: boolean;
  apiKey?: string;
  secretKey?: string;
  merchantId?: string;
  webhookUrl?: string;
  testMode: boolean;
}
