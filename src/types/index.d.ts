
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

// Add the Member interface to explicitly include primaryBranchId
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
  primaryBranchId?: string; // This property is present
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
}
