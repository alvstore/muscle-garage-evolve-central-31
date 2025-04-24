
export type NotificationChannel = 'email' | 'sms' | 'whatsapp' | 'app' | 'push';

export type ReminderTriggerType = 
  'membership_expiry' | 
  'birthday' | 
  'class_reminder' | 
  'payment_due' | 
  'attendance_missed' |
  'membership_renewal' | 
  'goal_achieved' |
  'follow_up';

export interface ReminderRule {
  id: string;
  title: string;
  description: string;
  triggerType: ReminderTriggerType;
  triggerValue?: number;
  notificationChannel: NotificationChannel; 
  conditions: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  message?: string;
  sendVia: string[];
  targetRoles: string[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  authorId?: string;
  authorName?: string;
  createdAt: string;
  updatedAt?: string;
  expiresAt?: string;
  targetRoles: string[];
  channels: string[];
  branchId?: string;
  status?: 'active' | 'draft' | 'expired';
}

export interface MotivationalMessage {
  id: string;
  title: string;
  content: string;
  author?: string;
  category: 'motivation' | 'fitness' | 'nutrition' | 'wellness';
  tags?: string[];
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export type FeedbackType = 'general' | 'trainer' | 'class' | 'facility' | 'service';

export interface Feedback {
  id: string;
  title: string;
  type: FeedbackType;
  rating: number;
  comments?: string;
  memberId?: string;
  memberName?: string;
  branchId?: string;
  createdAt: string;
  relatedId?: string;
  anonymous: boolean;
}

export interface BackupLogEntry {
  id: string;
  action: string;
  user_id?: string;
  user_name?: string;
  timestamp: string;
  modules: string[];
  success: boolean;
  total_records?: number;
  success_count?: number;
  failed_count?: number;
  created_at: string;
  updated_at: string;
}
