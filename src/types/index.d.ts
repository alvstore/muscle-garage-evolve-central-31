
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

// Updated Member interface to explicitly include primaryBranchId
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
  primaryBranchId: string; // Now required field
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

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff" | "trainer" | "member";
  branchIds?: string[]; 
  primaryBranchId?: string;
  updateUserBranch?: (branchId: string) => Promise<void>;
}

export type Announcement = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: string;
  priority?: "low" | "medium" | "high";
  targetRoles: string[];
  channels?: string[];
};

// Add Payment interface
export interface Payment {
  id: string;
  memberId: string;
  membershipId: string;
  amount: number;
  date: string;
  status: "Paid" | "Pending" | "Failed";
}

// Update Class interface to include schedule
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
  schedule?: string; // Added schedule field
}
