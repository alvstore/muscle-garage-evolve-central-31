
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
  targetRoles?: string[];
  channels?: NotificationChannel[];
  sentCount?: number;
  createdBy?: string; // Add this property for compatibility
  forRoles?: string[]; // Add this property for compatibility
  forBranchIds?: string[];
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
  title?: string; // Add this for compatibility
}

export type ReminderTriggerType = 'membership_expiry' | 'missed_attendance' | 'birthday' | 'inactive_member' | 'special_event';

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
  // Add compatibility properties
  type?: string;
  triggerDays?: number;
  channels?: NotificationChannel[];
  targetRoles?: string[];
  enabled?: boolean;
}
