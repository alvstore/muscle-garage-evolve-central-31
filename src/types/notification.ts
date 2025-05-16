
// This file defines the types used for notifications, feedback, motivational messages, and other communication elements

// Basic notification type
export interface Notification {
  id: string;
  title: string;
  message: string;
  read?: boolean;
  is_read?: boolean; // For backward compatibility
  type?: string;
  user_id: string;
  created_at: string;
  link?: string;
  related_id?: string;
  category?: string;
}

// Feedback types
export type FeedbackType = 'general' | 'trainer' | 'facility' | 'class' | 'equipment' | 'fitness-plan' | 'service';

export interface Feedback {
  id: string;
  member_id?: string;
  member_name?: string;
  type: FeedbackType;
  title: string;
  rating: number;
  comments?: string;
  comment?: string; // For backward compatibility
  anonymous?: boolean;
  created_at?: string;
  branch_id?: string;
  related_id?: string;
}

// Motivational message types
export type MotivationalCategory = 'fitness' | 'nutrition' | 'mindfulness' | 'recovery' | 'general' | 'motivation' | 'wellness';

export interface MotivationalMessage {
  id: string;
  title: string;
  content: string;
  category: MotivationalCategory;
  active?: boolean;
  tags?: string[];
  author?: string;
  created_at?: string;
  updated_at?: string;
}

// Reminder rule types
export interface ReminderRule {
  id: string;
  title: string;
  name?: string; // For backward compatibility
  description?: string;
  trigger_type: string; 
  triggerType?: string; // For backward compatibility
  trigger_value: number;
  triggerValue?: number; // For backward compatibility
  message?: string;
  conditions: Record<string, any>;
  target_roles: string[];
  targetRoles?: string[]; // For backward compatibility
  send_via: string[];
  sendVia?: string[]; // For backward compatibility
  channels?: string[]; // For backward compatibility
  notification_channel?: string;
  is_active: boolean;
  active?: boolean; // For backward compatibility
  isActive?: boolean; // For backward compatibility
  target_type?: string;
  created_at?: string;
  updated_at?: string;
}

// Announcement types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  author_id?: string;
  authorId?: string; // For backward compatibility
  author_name?: string;
  authorName?: string; // For backward compatibility
  author?: string; // For backward compatibility
  priority: 'low' | 'medium' | 'high';
  target_roles?: string[];
  targetRoles?: string[]; // For backward compatibility
  channels?: string[];
  channel?: string; // For backward compatibility
  expires_at?: string;
  expiresAt?: string; // For backward compatibility
  created_at: string;
  createdAt?: string; // For backward compatibility
  updated_at?: string;
  branch_id?: string;
  branchId?: string; // For backward compatibility
}

// NotificationChannel enum
export type NotificationChannel = 'email' | 'sms' | 'push' | 'whatsapp' | 'app';

// Email settings
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
  notifications: {
    sendOnInvoice?: boolean;
    sendClassUpdates?: boolean;
    sendOnRegistration?: boolean;
    [key: string]: boolean | undefined;
  };
  branch_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Backup log entry
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

// Integration status
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

// Attendance settings
export interface AttendanceSettings {
  id?: string;
  hikvision_enabled: boolean;
  qr_enabled: boolean;
  device_config: Record<string, any>;
  branch_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Company settings
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

// Adapter functions
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
    related_id: dbFeedback.related_id,
    // Added for backward compatibility
    comment: dbFeedback.comments
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
