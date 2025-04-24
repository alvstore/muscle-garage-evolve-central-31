
export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  authorName: string;
  createdAt: string;
  expiresAt?: string;
  channel?: 'email' | 'sms' | 'whatsapp' | 'push';
  branchId?: string;
}

export interface ReminderRule {
  id: string;
  title: string;
  description?: string;
  triggerType: 'membership-expiry' | 'class-reminder' | 'birthday' | 'custom';
  notificationChannel: 'email' | 'sms' | 'whatsapp' | 'push';
  conditions: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
}

export type FeedbackType = Feedback['type'];

// Add additional notification types
export type ReminderTriggerType = 'membership-expiry' | 'class-reminder' | 'birthday' | 'custom';
export type NotificationChannel = 'email' | 'sms' | 'whatsapp' | 'push';
