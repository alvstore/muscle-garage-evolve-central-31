
export type NotificationType = "system" | "payment" | "attendance" | "renewal" | "announcement" | "feedback" | "reminder";
export type FeedbackType = "class" | "trainer" | "fitness-plan" | "general";
export type NotificationChannel = "email" | "sms" | "whatsapp" | "in-app";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  link?: string;
  actionRequired?: boolean;
  priority?: "low" | "medium" | "high";
  expiresAt?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: "low" | "medium" | "high";
  author: string;
  authorId: string;
  authorRole: string;
  targetRoles?: string[];
  attachments?: string[];
  read?: boolean;
  expiresAt?: string;
  channels?: NotificationChannel[];
  createdAt?: string;
  createdBy?: string;
}

export interface Feedback {
  id: string;
  memberId: string;
  memberName?: string;
  type: FeedbackType;
  relatedId?: string;
  rating: number;
  comments: string;
  createdAt: string;
  anonymous: boolean;
  responseId?: string;
  responseContent?: string;
  responseDate?: string;
  status?: "new" | "responded" | "closed";
}

export interface MotivationalMessage {
  id: string;
  title: string;
  content: string;
  image?: string;
  category: "motivation" | "nutrition" | "wellness" | "fitness";
  tags: string[];
  targetAudience?: string[];
  schedule?: {
    type: "immediate" | "scheduled" | "recurring";
    date?: string;
    recurrencePattern?: string;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "active" | "completed" | "paused";
  author?: string;
  active?: boolean;
}

export interface ReminderRule {
  id: string;
  name: string;
  description: string;
  triggerType: "membership-expiry" | "missed-attendance" | "birthday" | "payment-due" | "class-booking" | "custom";
  daysInAdvance: number;
  message: string;
  channels: ("email" | "sms" | "whatsapp" | "in-app")[];
  enabled: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastTriggered?: string;
  targetRoles?: string[];
  customCriteria?: Record<string, any>;
  type?: string;
  triggerDays?: number;
  template?: string;
  active?: boolean;
}
