
export type FeedbackType = "class" | "trainer" | "fitness-plan" | "general";

export interface Feedback {
  id: string;
  memberId: string;
  memberName?: string;
  title: string; // Add this to fix the errors
  type: FeedbackType;
  relatedId?: string;
  rating: number;
  comments: string;
  createdAt: string;
  anonymous: boolean;
}

export type ReminderTriggerType = "attendance" | "renewal" | "membership-expiry" | "birthday";

export interface ReminderRule {
  id: string;
  name: string;
  description: string;
  triggerType: ReminderTriggerType;
  daysInAdvance: number;
  message: string;
  channels: string[];
  targetRoles: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
  // Additional properties needed by ReminderRuleForm
  sendEmail?: boolean;
  sendSMS?: boolean;
  sendPush?: boolean;
  specificDate?: string;
  specificTime?: string;
  repeatYearly?: boolean;
  targetGroups?: string[];
}

export interface MotivationalMessage {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  active: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  status: "active" | "inactive";
}
