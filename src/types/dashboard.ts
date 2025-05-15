
import { User } from './user';
import { Member } from './member';

export interface DashboardSummary {
  activeMembers: number;
  totalMembers: number;
  todayCheckIns: number;
  upcomingRenewals: number;
  revenue: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  type: string;
  timestamp: string;
  time?: string;
  member?: Member;
  member_id?: string;
  user_id?: string;
  user?: {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
  };
}

export interface Payment {
  id: string;
  member_id: string;
  member_name: string;
  member_avatar?: string;
  memberName?: string; // for backward compatibility
  memberAvatar?: string; // for backward compatibility
  membership_plan?: string;
  membershipPlan?: string; // for backward compatibility
  amount: number;
  status: string;
  due_date?: string;
  dueDate?: string; // for backward compatibility
  paid_date?: string;
  plan_name?: string; // for backward compatibility
}

export interface RenewalItem {
  id: string;
  member_id: string;
  member_name: string;
  memberName?: string; // for backward compatibility
  member_avatar?: string;
  memberAvatar?: string; // for backward compatibility
  membership_plan?: string;
  membershipPlan?: string; // for backward compatibility
  plan_name?: string; // for backward compatibility
  renewal_amount?: number;
  renewalAmount?: number; // for backward compatibility
  amount?: number; // for backward compatibility
  status: 'upcoming' | 'overdue' | 'renewed' | 'active' | 'expired';
  expiry_date: string;
  expiryDate?: string; // for backward compatibility
  days_left?: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorName?: string;
  authorId?: string;
  priority: 'low' | 'medium' | 'high'; 
  createdAt: string;
  targetRoles?: string[];
  channels?: string[];
}
