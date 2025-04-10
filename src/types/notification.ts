
// Add or update these interfaces in the existing file

export type FeedbackType = "class" | "trainer" | "fitness-plan" | "general" | "diet-plan";
export type NotificationChannel = "email" | "sms" | "push" | "in-app" | "whatsapp";
export type ReminderTriggerType = "membership-renewal" | "payment-due" | "birthday" | "class-reminder" | "missed-attendance" | "inactivity" | "membership-expiry" | "attendance" | "renewal" | "membershipExpiry";

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

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
  targetRoles: string[];
  targetBranch?: string;
  expiresAt?: string;
  channels?: NotificationChannel[];
  sentCount?: number;
  author?: string; // Made optional to fix type errors
  priority?: "low" | "medium" | "high"; // Added for completeness
}

export interface ReminderRule {
  id: string;
  name: string;
  description?: string;
  type: ReminderTriggerType;
  triggerDays: number;
  triggerType?: ReminderTriggerType;
  daysInAdvance?: number;
  message: string;
  channels: NotificationChannel[];
  enabled: boolean;
  active?: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  targetRoles?: string[];
  template?: string;
  sendEmail?: boolean;
  sendSMS?: boolean;
  sendPush?: boolean;
  specificDate?: string;
  specificTime?: string;
  repeatYearly?: boolean;
  targetGroups?: string[];
}

// Adding MotivationalMessage interface that was missing
export interface MotivationalMessage {
  id: string;
  title: string;
  content: string;
  targetRoles: string[];
  frequency: "daily" | "weekly" | "monthly";
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  channels: NotificationChannel[];
  author?: string;
  tags?: string[];
  category?: string;
  active?: boolean;
  status?: string;
}
