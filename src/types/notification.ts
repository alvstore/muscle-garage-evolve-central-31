export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  authorName: string;
  createdAt: string;
  expiresAt?: string;
  channel?: 'email' | 'sms' | 'whatsapp' | 'push' | 'in-app';
  branchId?: string;
  targetRoles: string[];
  channels?: ('email' | 'sms' | 'whatsapp' | 'in-app')[];
  authorId?: string;
  sentCount?: number;
}

export interface ReminderRule {
  id: string;
  title: string;
  description?: string;
  triggerType: 'membership-expiry' | 'class-reminder' | 'birthday' | 'custom';
  notificationChannel: 'email' | 'sms' | 'whatsapp' | 'push' | 'in-app';
  conditions: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  name: string;
  triggerValue?: number;
  message?: string;
  sendVia?: ('email' | 'sms' | 'whatsapp' | 'in-app')[];
  targetRoles?: string[];
  active: boolean;
  enabled?: boolean;
  type?: string;
  triggerDays?: number;
  channels?: ('email' | 'sms' | 'whatsapp' | 'in-app')[];
}

export interface MotivationalMessage {
  id: string;
  title?: string;
  content: string;
  author?: string;
  category: 'motivation' | 'fitness' | 'nutrition' | 'wellness';
  tags?: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Feedback {
  id: string;
  member_id: string;
  member_name?: string;
  type: 'general' | 'trainer' | 'class' | 'fitness-plan';
  related_id?: string;
  rating: number;
  comments?: string;
  anonymous: boolean;
  title: string;
  created_at: string;
  branch_id?: string;
  memberId?: string;
  memberName?: string;
  createdAt?: string;
}

export type FeedbackType = 'general' | 'trainer' | 'class' | 'fitness-plan';

export type ReminderTriggerType = 'membership-expiry' | 'class-reminder' | 'birthday' | 'custom';
export type NotificationChannel = 'email' | 'sms' | 'whatsapp' | 'push' | 'in-app';

export interface BackupLogEntry {
  id: string;
  action: 'export' | 'import';
  user_id: string;
  user_name: string;
  timestamp: string;
  modules: string[];
  success: boolean;
  total_records?: number;
  success_count?: number;
  failed_count?: number;
  created_at: string;
  updated_at: string;
}
