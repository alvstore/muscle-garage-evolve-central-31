
export interface Payment {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar: string;
  membershipPlan: string;
  amount: number;
  dueDate: string;
  status: "pending" | "overdue";
  contactInfo: string;
}

export interface RenewalItem {
  id: string;
  memberName: string;
  memberAvatar: string;
  membershipPlan: string;
  expiryDate: string;
  status: "active" | "inactive" | "expired";
  renewalAmount: number;
}

export interface RevenueItem {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface AttendanceData {
  date: string;
  count: number;
}

export interface MemberStatusData {
  active: number;
  inactive: number;
  expired: number;
}

export interface DashboardData {
  revenue: RevenueItem[];
  attendance: AttendanceData[];
  memberStatus: MemberStatusData;
  topPerformers: {
    id: string;
    name: string;
    avatar: string;
    role: string;
    performance: number;
    growth: number;
  }[];
}
