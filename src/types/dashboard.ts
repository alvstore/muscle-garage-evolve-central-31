
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
  user?: {
    name?: string;
  };
  userId?: string;
  icon?: string;
  time?: string;
  member?: {
    name?: string;
  };
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
  due_date?: string;
  member_avatar?: string;
}

export interface RenewalItem {
  id: string;
  memberName: string;
  membershipName: string;
  expiryDate: string;
  status: string;
  membership_plan?: string;
  membershipPlan?: string;
  plan_name?: string;
  renewal_amount?: number;
  renewalAmount?: number;
  amount?: number;
  member_name?: string;
  member_avatar?: string;
  memberAvatar?: string;
  expiry_date?: string;
}
