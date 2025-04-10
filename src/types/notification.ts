
import { UserRole } from "@/types/index";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: "low" | "medium" | "high";
  createdAt: string;
  expiresAt?: string;
  createdBy: string;
  targetRoles: UserRole[]; // Roles this announcement targets
  channels?: NotificationChannel[]; // Added to match the usage in components
  sentCount?: number; // Added to match the usage in components
}

export type NotificationChannel = "in-app" | "email" | "sms" | "whatsapp" | "push";

export interface Reminder {
  id: string;
  title: string;
  message: string;
  date: string;
  time?: string;
  userId: string;
  userRole: UserRole;
  status: "pending" | "sent" | "failed";
  type: "sms" | "email" | "push" | "whatsapp";
  createdAt: string;
  createdBy: string;
}

export interface ReminderRule {
  id: string;
  name: string;
  description: string;
  triggerType: "membershipExpiry" | "inactivity" | "birthday" | "attendance" | "renewal" | "payment";
  daysBeforeTrigger: number;
  isActive: boolean;
  message: string;
  notificationChannels: ("sms" | "email" | "push" | "whatsapp")[];
  appliesTo: UserRole[];
  createdAt: string;
  createdBy: string;
  // Added properties to match component usage
  type?: string;
  triggerDays?: number;
  channels?: string[];
  targetRoles?: UserRole[];
  active?: boolean;
  enabled?: boolean;
  updatedAt?: string;
}

export type ReminderTriggerType = "membership-renewal" | "missed-attendance" | "birthday" | "payment-due";

export interface MotivationalMessage {
  id: string;
  message: string;
  author?: string;
  category: "inspiration" | "fitness" | "nutrition" | "consistency" | "progress" | "motivation" | "wellness";
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  // Added properties to match component usage
  content?: string;
  tags?: string[];
  active?: boolean;
  title?: string;
  frequency?: string;
  targetRoles?: UserRole[];
  enabled?: boolean;
  updatedAt?: string;
  channels?: string[];
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  userId?: string;
  userRole?: UserRole;
  targetGroups?: ("all" | "members" | "trainers" | "staff" | "admin")[];
  sentAt?: string;
  status: "draft" | "scheduled" | "sent" | "failed";
  scheduledAt?: string;
  data?: Record<string, any>;
  createdAt: string;
  createdBy: string;
}

export type FeedbackType = "general" | "class" | "trainer" | "fitness-plan";

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
  title: string;
}

export type TriggerEvent = 
  | "member_registration" 
  | "payment_success" 
  | "payment_failure" 
  | "class_booking" 
  | "class_cancellation" 
  | "plan_expiry" 
  | "birthday" 
  | "motivation";
