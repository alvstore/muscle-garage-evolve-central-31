
export type LeadStatus = "new" | "contacted" | "qualified" | "lost" | "converted";
export type LeadSource = "website" | "referral" | "walk-in" | "phone" | "social-media" | "event" | "other";
export type FollowUpType = "email" | "sms" | "whatsapp" | "call" | "meeting";
export type FunnelStage = "cold" | "warm" | "hot";

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  source: LeadSource;
  status: LeadStatus;
  funnelStage: FunnelStage;
  assignedTo?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  followUpDate?: string;
  lastContactDate?: string;
  conversionDate?: string;
  conversionValue?: number;
  interests?: string[];
  tags?: string[];
}

export interface FollowUpTemplate {
  id: string;
  title: string;
  type: FollowUpType;
  content: string;
  variables: string[];
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  isDefault?: boolean;
}

export interface FollowUpHistory {
  id: string;
  leadId: string;
  templateId?: string;
  type: FollowUpType;
  content: string;
  sentBy: string;
  sentAt: string;
  status: "sent" | "delivered" | "read" | "failed";
  response?: string;
  responseAt?: string;
}
