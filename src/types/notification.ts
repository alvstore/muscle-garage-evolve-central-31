
import { UserRole } from "@/types";

export type TriggerEvent =
  | "member_registration"
  | "payment_success" 
  | "payment_failure"
  | "class_booking"
  | "class_cancellation"
  | "plan_expiry"
  | "birthday"
  | "motivation";

export type Permission =
  | "manage_sms_templates"
  | "manage_email_templates"
  | "manage_push_notifications"
  | "view_sms_templates"
  | "view_email_templates"
  | "view_push_notifications";

export interface SmsTemplate {
  id: string;
  name: string;
  content: string;
  description?: string;
  dltTemplateId?: string;
  provider: SmsProvider;
  triggerEvents: TriggerEvent[];
  variables?: string[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export type SmsProvider = "msg91" | "twilio";

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  description?: string;
  triggerEvents: TriggerEvent[];
  variables?: string[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface PushNotificationTemplate {
  id: string;
  name: string;
  title: string;
  content: string;
  description?: string;
  triggerEvents: TriggerEvent[];
  variables?: string[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: "low" | "medium" | "high";
  createdBy: string;
  createdAt: string;
  targetRoles: UserRole[];
  expiresAt?: string;
  channels?: NotificationChannel[];
  sentCount?: number;
}

export interface NotificationSettings {
  sms: boolean;
  email: boolean;
  push: boolean;
  inApp: boolean;
}

export interface UserNotificationPreferences {
  userId: string;
  settings: {
    [key in TriggerEvent]?: NotificationSettings;
  };
  lastUpdated: string;
}

// Additional types needed for various components
export type NotificationChannel = "in-app" | "email" | "sms" | "whatsapp" | "push";

export type FeedbackType = "general" | "class" | "trainer" | "fitness-plan";

export interface Feedback {
  id: string;
  memberId: string;
  memberName?: string;
  type: FeedbackType;
  relatedId?: string;
  rating: number;
  comments?: string;
  createdAt: string;
  anonymous: boolean;
  title: string;
  branchId?: string;
}

export type ReminderTriggerType = 
  | "membershipExpiry" 
  | "payment" 
  | "birthday" 
  | "inactivity";

export interface ReminderRule {
  id: string;
  name: string;
  description?: string;
  triggerType: ReminderTriggerType;
  type: "membership-renewal" | "missed-attendance" | "birthday" | "payment-due";
  daysBeforeTrigger: number;
  triggerDays: number;
  message: string;
  notificationChannels: NotificationChannel[];
  channels: NotificationChannel[];
  isActive: boolean;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  appliesTo?: UserRole[];
  targetRoles: UserRole[];
  active: boolean;
  createdBy: string;
}

export interface MotivationalMessage {
  id: string;
  content: string;
  message: string;
  author?: string;
  category: "motivation" | "fitness" | "nutrition" | "wellness";
  tags?: string[];
  targetRoles: UserRole[];
  frequency?: "daily" | "weekly" | "monthly";
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  channels: NotificationChannel[];
  active: boolean;
  isActive: boolean;
  createdBy: string;
  title: string;
}

export interface SmsLog {
  id: string;
  templateId: string;
  recipientId: string;
  recipientPhone: string;
  content: string;
  status: "sent" | "delivered" | "failed";
  provider: SmsProvider;
  createdAt: string;
  deliveredAt?: string;
  failureReason?: string;
}
