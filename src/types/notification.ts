
import { UserRole } from "@/types/index";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: "low" | "medium" | "high";
  createdAt: string;
  expiresAt: string;
  createdBy: string;
  targetRoles: UserRole[]; // Roles this announcement targets
}

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
}

export interface MotivationalMessage {
  id: string;
  message: string;
  author?: string;
  category: "inspiration" | "fitness" | "nutrition" | "consistency" | "progress";
  isActive: boolean;
  createdAt: string;
  createdBy: string;
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
