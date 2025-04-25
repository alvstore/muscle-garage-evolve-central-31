
// Dashboard component types
export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  user: {
    name: string;
    avatar?: string;
  };
  time: string;
  type: "membership" | "check-in" | "payment" | "class" | "other";
}

export interface Payment {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar?: string;
  membershipPlan: string;
  amount: number;
  dueDate: string;
  status: "pending" | "overdue";
  contactInfo: string;
}

export interface RenewalItem {
  id: string;
  memberName: string;
  memberAvatar?: string;
  membershipPlan: string;
  expiryDate: string;
  status: "active" | "inactive" | "expired";
  renewalAmount: number;
}

export interface ClassItem {
  id: string;
  name: string;
  trainer: string;
  trainerAvatar?: string;
  time: string;
  duration: string;
  capacity: number;
  enrolled: number;
  type: string;
  level: "beginner" | "intermediate" | "advanced" | "all";
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: "low" | "medium" | "high";
  author: string;
}

export interface AttendanceData {
  date: string;
  count: number;
}

export interface MemberStatusData {
  name: string;
  value: number;
  color: string;
}

export interface DashboardSummary {
  totalMembers: number;
  activeMembers: number;
  todayCheckIns: number;
  upcomingRenewals: number;
  pendingPayments: {
    count: number;
    total: number;
  };
  revenue: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  // Optional fields
  totalTrainers?: number;
  totalStaff?: number;
  activeClasses?: number;
  newMembers?: number;
  expiringMemberships?: number;
  classSessions?: number;
  inventoryAlerts?: number;
  attendanceTrend?: AttendanceData[];
  membersByStatus?: {
    active: number;
    inactive: number;
    expired: number;
  };
  revenueData?: {
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }[];
}

export interface BranchAnalytics {
  branchId: string;
  branchName: string;
  memberCount: number;
  revenue: number;
  attendance: number;
}
