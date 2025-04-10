
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
  expiresAt: string;
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
