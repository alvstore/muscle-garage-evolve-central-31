
// Assuming this file exists and we're just updating it
import { InvoiceStatus } from './finance';
import { Invoice as FinanceInvoice } from './finance';

export interface Notification {
  id: string;
  title: string;
  message?: string;
  read: boolean;
  created_at: string;
  type?: string;
  user_id: string;
  // For backward compatibility in components
  timestamp?: string;
}

export type NotificationChannel = 'email' | 'sms' | 'push' | 'in_app';
export type FeedbackType = 'general' | 'trainer' | 'facility' | 'class';

export interface Feedback {
  id: string;
  type: FeedbackType;
  title: string;
  rating: number;
  comments?: string;
  member_id?: string;
  member_name?: string;
  related_id?: string;
  branch_id?: string;
  anonymous: boolean;
  created_at: string;
}

export type MotivationalCategory = 'fitness' | 'nutrition' | 'wellness' | 'mindfulness' | 'general';

export interface MotivationalMessage {
  id: string;
  title: string;
  content: string;
  category: MotivationalCategory;
  tags?: string[];
  author?: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ReminderRule {
  id: string;
  title: string;
  description?: string;
  trigger_type: string;
  trigger_value?: number;
  conditions: Record<string, any>;
  message?: string;
  target_roles: string[];
  send_via: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // For backward compatibility
  triggerType?: string;
  triggerValue?: number;
  targetRoles?: string[];
  sendVia?: string[];
  isActive?: boolean;
  active?: boolean;
  channels?: string[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author_id?: string;
  author_name?: string;
  priority: string;
  target_roles: string[];
  channels: string[];
  expires_at?: string;
  branch_id?: string;
  created_at: string;
  updated_at: string;
  // Add camelCase versions for backward compatibility
  authorName?: string;
  targetRoles?: string[];
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type Invoice = FinanceInvoice;

// Helper functions
export function adaptReminderRuleFromDB(data: any): ReminderRule {
  return {
    ...data,
    triggerType: data.trigger_type,
    triggerValue: data.trigger_value,
    targetRoles: data.target_roles,
    sendVia: data.send_via,
    isActive: data.is_active,
    active: data.is_active
  };
}

export function adaptAnnouncementFromDB(data: any): Announcement {
  return {
    ...data,
    authorName: data.author_name,
    targetRoles: data.target_roles,
    expiresAt: data.expires_at,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export function adaptMotivationalMessageFromDB(data: any): MotivationalMessage {
  return data;
}
