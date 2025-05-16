import { toast } from 'sonner';

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  is_read: boolean; // Added for backward compatibility
  created_at: string;
  type?: string;
  user_id: string;
}

export interface Feedback {
  id: string;
  title: string;
  rating: number;
  comments?: string;
  member_id?: string;
  member_name?: string;
  created_at?: string;
  branch_id?: string;
  type: FeedbackType;
  related_id?: string;
  anonymous: boolean;
}

export type FeedbackType = 'trainer' | 'facility' | 'class' | 'equipment' | 'general';

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

export type MotivationalCategory = 'fitness' | 'nutrition' | 'mindfulness' | 'recovery' | 'general';

export interface ReminderRule {
  id: string;
  title: string;
  description?: string;
  trigger_type: string;
  trigger_value?: number;
  conditions: Record<string, any>;
  message?: string;
  target_roles: string[];
  send_via: NotificationChannel[];
  notification_channel?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type NotificationChannel = 'email' | 'sms' | 'push' | 'whatsapp' | 'in-app';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author?: string;
  author_name?: string;
  author_id?: string;
  priority: string;
  channel?: string;
  channels?: string[];
  target_roles: string[];
  created_at: string;
  updated_at: string;
  expires_at?: string;
  branch_id?: string;
}

export interface EmailSettings {
  id: string;
  provider: string;
  from_email: string;
  sendgrid_api_key?: string;
  mailgun_api_key?: string;
  mailgun_domain?: string;
  smtp_host?: string;
  smtp_port?: number;
  smtp_secure?: boolean;
  smtp_username?: string;
  smtp_password?: string;
  is_active: boolean;
  branch_id?: string;
  created_at: string;
  updated_at: string;
  notifications: {
    sendOnInvoice: boolean;
    sendClassUpdates: boolean;
    sendOnRegistration: boolean;
    [key: string]: boolean;
  };
}

export interface BackupLogEntry {
  id: string;
  action: string;
  success: boolean;
  timestamp: string;
  user_id?: string;
  user_name?: string;
  modules: string[];
  total_records?: number;
  success_count?: number;
  failed_count?: number;
  created_at: string;
  updated_at: string;
}

export interface IntegrationStatus {
  id: string;
  name: string;
  integration_key: string;
  description: string;
  status: string;
  icon?: string;
  config?: any;
  branch_id?: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceSettings {
  id: string;
  branch_id?: string;
  qr_enabled?: boolean;
  hikvision_enabled?: boolean;
  device_config?: any;
  created_at: string;
  updated_at: string;
}

export interface CompanySettings {
  id: string;
  gym_name: string;
  contact_email?: string;
  contact_phone?: string;
  business_hours_start?: string;
  business_hours_end?: string;
  currency: string;
  currency_symbol: string;
  tax_rate?: number;
  created_at?: string;
  updated_at?: string;
}

// Adapter functions to convert database models to frontend models
export const adaptAnnouncementFromDB = (data: any): Announcement => {
  return {
    id: data.id,
    title: data.title,
    content: data.content,
    author: data.author || data.author_name,
    author_id: data.author_id,
    author_name: data.author_name,
    priority: data.priority || 'normal',
    channel: data.channel,
    channels: data.channels || [],
    target_roles: data.target_roles || [],
    created_at: data.created_at,
    updated_at: data.updated_at,
    expires_at: data.expires_at,
    branch_id: data.branch_id
  };
};

export const adaptReminderRuleFromDB = (data: any): ReminderRule => {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    trigger_type: data.trigger_type,
    trigger_value: data.trigger_value,
    conditions: data.conditions || {},
    message: data.message,
    target_roles: data.target_roles || [],
    send_via: data.send_via || [],
    notification_channel: data.notification_channel,
    is_active: data.is_active,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};

export const adaptMotivationalMessageFromDB = (data: any): MotivationalMessage => {
  return {
    id: data.id,
    title: data.title,
    content: data.content,
    category: data.category,
    tags: data.tags || [],
    author: data.author,
    active: data.active,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};

export const adaptFeedbackFromDB = (data: any): Feedback => {
  return {
    id: data.id,
    title: data.title,
    rating: data.rating,
    comments: data.comments,
    member_id: data.member_id,
    member_name: data.member_name,
    created_at: data.created_at,
    branch_id: data.branch_id,
    type: data.type,
    related_id: data.related_id,
    anonymous: data.anonymous
  };
};

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  whatsapp: boolean;
}
