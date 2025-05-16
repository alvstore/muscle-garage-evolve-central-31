
// This file defines the types used for notifications

// Re-export types from other files for compatibility
import { Invoice, InvoiceStatus } from './finance';
export { Invoice, InvoiceStatus };

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp?: string; // For backward compatibility
  read: boolean;
  is_read?: boolean; // Added for backward compatibility
  type?: string;
  created_at: string;
  user_id: string;
}

export interface ReminderRule {
  id: string;
  name?: string; // For backward compatibility
  title: string;
  description?: string;
  triggerType?: string; // For backward compatibility
  trigger_type: string;
  triggerValue?: number; // For backward compatibility
  trigger_value?: number;
  message?: string;
  notificationChannel?: string; // For backward compatibility
  notification_channel?: string;
  conditions?: Record<string, any>;
  isActive?: boolean; // For backward compatibility
  active?: boolean; // For backward compatibility
  is_active: boolean;
  targetRoles?: string[]; // For backward compatibility
  target_roles: string[];
  sendVia?: string[]; // For backward compatibility
  channels?: string[]; // For backward compatibility
  send_via: string[];
  targetType?: string; // For backward compatibility
  target_type?: string;
  created_at?: string;
  updated_at?: string;
}

export interface IntegrationStatus {
  id: string;
  integration_key: string;
  name: string;
  description: string;
  status: 'configured' | 'partially-configured' | 'not-configured';
  icon: string;
  config?: Record<string, any>;
  branch_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AttendanceSettings {
  id?: string;
  hikvision_enabled: boolean;
  qr_enabled: boolean;
  device_config: Record<string, any>;
  branch_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CompanySettings {
  id?: string;
  gym_name: string;
  contact_email: string;
  contact_phone: string;
  business_hours_start: string;
  business_hours_end: string;
  currency: string;
  currency_symbol: string;
  tax_rate: number;
  created_at?: string;
  updated_at?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  authorName: string;
  authorId?: string;
  author_id?: string;
  author_name?: string;
  createdAt: string;
  created_at?: string;
  expiresAt?: string; // For backward compatibility
  expires_at?: string;
  channel?: string;
  branchId?: string;
  branch_id?: string;
  targetRoles?: string[];
  target_roles?: string[];
  channels?: string[];
}

// Adapter function to convert database object to frontend model
export const adaptAnnouncementFromDB = (dbAnnouncement: any): Announcement => {
  return {
    id: dbAnnouncement.id,
    title: dbAnnouncement.title,
    content: dbAnnouncement.content,
    priority: dbAnnouncement.priority || 'medium',
    authorName: dbAnnouncement.author_name || dbAnnouncement.authorName,
    authorId: dbAnnouncement.author_id,
    author_id: dbAnnouncement.author_id,
    author_name: dbAnnouncement.author_name,
    createdAt: dbAnnouncement.created_at,
    created_at: dbAnnouncement.created_at,
    expiresAt: dbAnnouncement.expires_at,
    expires_at: dbAnnouncement.expires_at,
    channel: dbAnnouncement.channel,
    branchId: dbAnnouncement.branch_id,
    branch_id: dbAnnouncement.branch_id,
    targetRoles: dbAnnouncement.target_roles,
    target_roles: dbAnnouncement.target_roles,
    channels: dbAnnouncement.channels
  };
};

// Adapter functions that are being imported
export const adaptFeedbackFromDB = (dbFeedback: any): Feedback => {
  return {
    id: dbFeedback.id,
    title: dbFeedback.title,
    rating: dbFeedback.rating,
    comments: dbFeedback.comments,
    member_id: dbFeedback.member_id,
    member_name: dbFeedback.member_name,
    branch_id: dbFeedback.branch_id,
    type: dbFeedback.type,
    anonymous: dbFeedback.anonymous || false,
    created_at: dbFeedback.created_at,
    related_id: dbFeedback.related_id
  };
};

export const adaptReminderRuleFromDB = (dbRule: any): ReminderRule => {
  return {
    id: dbRule.id,
    title: dbRule.title,
    name: dbRule.name || dbRule.title,
    description: dbRule.description,
    triggerType: dbRule.trigger_type,
    trigger_type: dbRule.trigger_type,
    triggerValue: dbRule.trigger_value,
    trigger_value: dbRule.trigger_value,
    message: dbRule.message,
    notificationChannel: dbRule.notification_channel,
    notification_channel: dbRule.notification_channel,
    conditions: dbRule.conditions || {},
    isActive: dbRule.is_active,
    active: dbRule.is_active,
    is_active: dbRule.is_active, 
    targetRoles: dbRule.target_roles || [],
    target_roles: dbRule.target_roles || [],
    sendVia: dbRule.send_via || [],
    send_via: dbRule.send_via || [],
    channels: dbRule.channels || [],
    targetType: dbRule.target_type || 'all',
    target_type: dbRule.target_type || 'all'
  };
};

export const adaptMotivationalMessageFromDB = (dbMessage: any): MotivationalMessage => {
  return {
    id: dbMessage.id,
    title: dbMessage.title,
    content: dbMessage.content,
    author: dbMessage.author,
    category: dbMessage.category,
    tags: dbMessage.tags || [],
    active: dbMessage.active,
    created_at: dbMessage.created_at,
    updated_at: dbMessage.updated_at
  };
};

export interface Feedback {
  id: string;
  title: string;
  rating: number;
  comments?: string;
  member_id?: string;
  member_name?: string;
  branch_id?: string;
  type: FeedbackType;
  anonymous: boolean;
  created_at?: string;
  related_id?: string;
}

export interface MotivationalMessage {
  id: string;
  title: string;
  content: string;
  author?: string;
  category: MotivationalCategory;
  tags?: string[];
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Add missing types for BackupLogEntry
export interface BackupLogEntry {
  id: string;
  action: string;
  timestamp: string;
  success: boolean;
  user_id?: string;
  user_name?: string;
  modules: string[];
  total_records?: number;
  success_count?: number;
  failed_count?: number;
  created_at: string;
  updated_at: string;
}

// Enums
export type FeedbackType = 'general' | 'trainer' | 'facility' | 'class' | 'equipment' | 'fitness-plan';
export type MotivationalCategory = 'fitness' | 'nutrition' | 'mindfulness' | 'recovery' | 'general' | 'motivation' | 'wellness';
export type NotificationChannel = 'email' | 'sms' | 'whatsapp' | 'app' | 'push';

// Add missing EmailSettings interface
export interface EmailSettings {
  id?: string;
  provider: string;
  from_email: string;
  smtp_host?: string;
  smtp_port?: number;
  smtp_username?: string;
  smtp_password?: string;
  smtp_secure?: boolean;
  sendgrid_api_key?: string;
  mailgun_api_key?: string;
  mailgun_domain?: string;
  is_active: boolean;
  branch_id?: string | null;
  notifications: {
    sendOnInvoice?: boolean;
    sendClassUpdates?: boolean;
    sendOnRegistration?: boolean;
    [key: string]: boolean | undefined;
  };
  created_at?: string;
  updated_at?: string;
}
