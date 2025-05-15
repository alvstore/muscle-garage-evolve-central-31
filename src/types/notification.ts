
// Assuming this file exists and we're just updating it
import { InvoiceStatus } from './finance';

export interface Notification {
  id: string;
  title: string;
  message?: string;
  read: boolean;
  created_at: string;
  type?: string;
  user_id: string;
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
  triggerType?: string; // For backward compatibility
  trigger_value?: number;
  triggerValue?: number; // For backward compatibility
  conditions: Record<string, any>;
  message?: string;
  target_roles: string[];
  targetRoles?: string[]; // For backward compatibility
  send_via: string[];
  sendVia?: string[]; // For backward compatibility
  channels?: string[]; // Alternative field name
  is_active: boolean;
  isActive?: boolean; // For backward compatibility
  active?: boolean; // Alternative field name
  created_at: string;
  updated_at: string;
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
}

// Helper functions
export function adaptReminderRuleFromDB(data: any): ReminderRule {
  return {
    ...data,
    triggerType: data.trigger_type,
    triggerValue: data.trigger_value,
    targetRoles: data.target_roles,
    sendVia: data.send_via,
    isActive: data.is_active
  };
}

export function adaptAnnouncementFromDB(data: any): Announcement {
  return data;
}

export function adaptMotivationalMessageFromDB(data: any): MotivationalMessage {
  return data;
}
