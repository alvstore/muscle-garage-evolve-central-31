
// Notification types for the system
export type FeedbackType = 'general' | 'trainer' | 'class' | 'fitness-plan';

export interface Feedback {
  id: string;
  memberId?: string;
  memberName?: string;
  type: FeedbackType;
  relatedId?: string;
  rating: number;
  comments: string;
  createdAt: string;
  anonymous: boolean;
  title: string;
}

export type NotificationChannel = 'in-app' | 'email' | 'sms' | 'whatsapp';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  expiresAt?: string;
  priority: 'low' | 'medium' | 'high';
  forRoles?: string[];
  forBranchIds?: string[];
  // Additional properties for the dashboard
  targetRoles?: string[];
  channels?: NotificationChannel[];
  sentCount?: number;
}

export interface MotivationalMessage {
  id: string;
  content: string;
  author?: string;
  category: 'motivation' | 'fitness' | 'nutrition' | 'wellness';
  tags?: string[];
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ReminderRule {
  id: string;
  name: string;
  description?: string;
  triggerType: ReminderTriggerType;
  triggerValue: number;
  message: string;
  sendVia: NotificationChannel[];
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

export type ReminderTriggerType = 'membership_expiry' | 'missed_attendance' | 'birthday' | 'inactive_member' | 'special_event';

