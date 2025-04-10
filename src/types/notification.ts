
// Add or update these interfaces in the existing file

export type FeedbackType = "class" | "trainer" | "fitness-plan" | "general" | "diet-plan";
export type NotificationChannel = "email" | "sms" | "push" | "in-app" | "whatsapp";
export type ReminderTriggerType = "membership-renewal" | "payment-due" | "birthday" | "class-reminder" | "missed-attendance" | "inactivity";

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
  createdBy: string;  // Add this field
  createdAt: string;
  targetRoles: string[];  // Add this field
  targetBranch?: string;
  expiresAt?: string;  // Add this field
  channels?: NotificationChannel[]; // Add this field
}

export interface ReminderRule {
  id: string;
  name: string;
  description?: string;
  type: ReminderTriggerType;  // Add this field
  triggerDays: number;  // Add this field
  message: string;
  channels: NotificationChannel[];
  enabled: boolean;  // Add this field
  createdAt: string;
  updatedAt: string;
}
