
// Add this to your types/index.d.ts file
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

// Updated Member interface with primaryBranchId
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
  primaryBranchId: string; // Now explicitly required
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

export interface MemberMeasurement {
  id: string;
  date: string;
  height?: number;
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

export type UserRole = "admin" | "staff" | "trainer" | "member";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branchIds?: string[]; 
  primaryBranchId?: string;
  updateUserBranch?: (branchId: string) => Promise<void>;
}

// Updated Announcement interface with required fields
export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: string;
  priority?: "low" | "medium" | "high";
  targetRoles: string[];
  channels?: string[];
  createdBy?: string;
}

// Payment interface
export interface Payment {
  id: string;
  memberId: string;
  membershipId: string;
  amount: number;
  date: string;
  status: "Paid" | "Pending" | "Failed";
}

// Updated Class interface with schedule property
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
  schedule?: string;
}

export interface Trainer {
  id: string;
  name: string;
  specialization?: string[];
  experience: number;
  certifications?: string[];
  bio?: string;
  profileImage?: string;
  contactNumber?: string;
  email?: string;
  availability?: string[];
  rating?: number;
  reviewCount?: number;
  branchId?: string;
  schedule?: any[];
}

