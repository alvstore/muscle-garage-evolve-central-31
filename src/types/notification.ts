
export type NotificationChannel = 'in-app' | 'email' | 'sms' | 'whatsapp';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
  targetRoles: string[];
  channels: NotificationChannel[];
  sentCount: number;
  forRoles: string[];
  createdBy: string;
  expiresAt?: string;
}

export type FeedbackType = 'suggestion' | 'complaint' | 'general' | 'class' | 'trainer' | 'fitness-plan' | 'diet-plan';

export interface Feedback {
  id: string;
  title: string;
  content: string;
  type: FeedbackType;
  memberId: string;
  memberName: string;
  createdAt: string;
  status: 'pending' | 'resolved' | 'in-progress';
  rating?: number;
  comments?: string;
  anonymous?: boolean;
}

export interface MotivationalMessage {
  id: string;
  content: string;
  scheduledDate: string;
  targetAudience: string[];
  isActive: boolean;
  createdBy: string;
  title?: string;
  author?: string;
  category?: string;
  tags?: string[];
}

export interface ReminderRule {
  id: string;
  name: string;
  triggerType: ReminderTriggerType;
  triggerValue: number;
  message: string;
  channels: NotificationChannel[];
  isActive: boolean;
  description?: string;
  sendVia?: NotificationChannel[];
  targetRoles?: string[];
}

export type ReminderTriggerType = 'membership_expiry' | 'missed_classes' | 'birthday' | 'payment_due' | 'missed_attendance';
