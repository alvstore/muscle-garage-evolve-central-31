
import { UserRole } from ".";

export type NotificationChannel = "in-app" | "email" | "sms" | "whatsapp";
export type NotificationType = 
  | "reminder" 
  | "announcement" 
  | "birthday" 
  | "membership-expiry" 
  | "attendance" 
  | "feedback" 
  | "motivational";

export interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  channels: NotificationChannel[];
  subject: string;
  content: string;
  variables: string[];
  active: boolean;
}

export interface ReminderRule {
  id: string;
  name: string;
  type: "membership-expiry" | "attendance" | "birthday" | "renewal";
  triggerDays: number; // Days before/after the event
  template: string; // Template ID
  channels: NotificationChannel[];
  targetRoles: UserRole[];
  active: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
  targetRoles: UserRole[];
  targetBranch?: string;
  expiresAt?: string;
  channels: NotificationChannel[];
  sentCount?: number;
}

export interface Feedback {
  id: string;
  memberId: string;
  memberName?: string;
  type: "class" | "trainer" | "fitness-plan" | "general";
  relatedId?: string; // Class ID, Trainer ID, or Plan ID
  rating: number; // 1-5
  comments?: string;
  createdAt: string;
  anonymous: boolean;
}

export interface MotivationalMessage {
  id: string;
  content: string;
  author?: string;
  category: "fitness" | "nutrition" | "motivation" | "wellness";
  tags?: string[];
  active: boolean;
}
