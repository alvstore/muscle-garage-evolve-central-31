
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
}

export interface Payment {
  id: string;
  member_id: string;
  member_name: string;
  member_avatar?: string;
  membership_plan?: string;
  amount: number;
  status: string;
  due_date?: string;
  paid_date?: string;
}

export interface RenewalItem {
  id: string;
  member_id: string;
  member_name: string;
  member_avatar?: string;
  membership_plan?: string;
  renewal_amount?: number;
  status: 'upcoming' | 'overdue' | 'renewed';
  expiry_date: string;
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
