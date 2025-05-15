
// Dashboard specific types

export interface StatCard {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface ActivityItem {
  id: string;
  type: 'check-in' | 'check-out' | 'payment' | 'membership' | 'class' | 'other';
  title: string;
  description?: string;
  timestamp: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  member?: {
    id: string;
    name: string;
    avatar?: string;
  };
  metadata?: Record<string, any>;
  time?: string;
}

export interface RenewalItem {
  id: string;
  member_id: string;
  member_name: string;
  member_avatar?: string;
  plan_name: string;
  expiry_date: string;
  days_remaining: number;
  amount: number;
  status: 'upcoming' | 'overdue' | 'renewed' | 'active' | 'expired';
  memberName?: string;
  memberAvatar?: string;
  membershipPlan?: string;
  expiryDate?: string;
  renewalAmount?: number;
}

export interface Payment {
  id: string;
  member_id?: string;
  member_name?: string;
  memberId?: string;
  memberName?: string;
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'failed' | 'overdue';
  method?: string;
  description?: string;
  invoice_id?: string;
  memberAvatar?: string;
  membershipPlan?: string;
  dueDate?: string;
  contactInfo?: string;
}
