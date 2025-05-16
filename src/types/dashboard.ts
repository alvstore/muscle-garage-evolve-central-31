
export interface DashboardSummary {
  activeMemberCount: number;
  newMembersThisMonth: number;
  totalRevenue: number;
  upcomingRenewals: number;
}

export interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user?: string;
  userId?: string;
  icon?: string;
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  member_name: string;
  membership_plan: string;
  payment_method: string;
  contactInfo?: string;
  status?: string;
}

export interface RenewalItem {
  id: string;
  memberName: string;
  membershipName: string;
  expiryDate: string;
  status: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
}
