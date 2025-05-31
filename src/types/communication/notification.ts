// Communication and notification types

// Automation Rules
export interface AutomationRule {
  id: string;
  name: string;
  description?: string;
  event_type: string;
  conditions: Record<string, any>;
  actions: Array<{
    type: string;
    config: Record<string, any>;
  }>;
  is_active: boolean;
  branch_id?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  priority?: number;
  tags?: string[];
}

// Attendance Settings
export interface AttendanceSettings {
  id: string;
  auto_clock_out: boolean;
  auto_clock_out_hours: number;
  late_mark_minutes: number;
  early_leave_minutes: number;
  grace_period_minutes: number;
  enable_geo_fencing: boolean;
  geo_fencing_radius: number;
  enable_qr_code: boolean;
  enable_biometric: boolean;
  enable_manual_override: boolean;
  require_photo: boolean;
  branch_id?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  settings?: Record<string, any>;
}

// Communication and notification types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  target_roles: string[];
  channels: string[];
  author_id?: string;
  author?: string;
  author_name?: string;
  authorName?: string; // For backward compatibility
  branch_id?: string;
  branchId?: string; // For backward compatibility
  expires_at?: string;
  expiresAt?: string; // For backward compatibility
  created_at: string;
  createdAt?: string; // For backward compatibility
  updated_at?: string;
  updatedAt?: string; // For backward compatibility
  channel?: string;
  targetRoles?: string[]; // For backward compatibility
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | string;
  read: boolean;
  is_read: boolean;
  created_at: string;
  user_id?: string;
  branch_id?: string;
  link?: string;
  timestamp?: string; // For backward compatibility
}

export interface NotificationChannel {
  type: 'email' | 'sms' | 'whatsapp' | 'push' | 'in_app' | string;
  enabled: boolean;
  config?: Record<string, any>;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  subject?: string;
  content: string;
  category: string;
  variables?: Record<string, any>;
  is_active: boolean;
  branch_id?: string;
  created_at: string;
  updated_at: string;
}

// Motivational Messages
export type MotivationalCategory = 'fitness' | 'nutrition' | 'motivation' | 'general' | 'wellness';

export interface MotivationalMessage {
  id: string;
  title: string;
  content: string;
  target_audience: string[];
  send_via: NotificationChannel[];
  scheduled_at?: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  branch_id?: string;
  created_at: string;
  updated_at: string;
  author?: string;
  category: MotivationalCategory;
  tags?: string[];
  active?: boolean;
}

// Reminder Rules
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
  // Backward compatibility
  name?: string;
  triggerType?: string;
  triggerValue?: number;
  notificationChannel?: string;
  notification_channel?: string;
  targetRoles?: string[];
  channels?: string[];
  targetType?: string;
  target_type?: string;
}

// Feedback System
export type FeedbackType = 'general' | 'trainer' | 'class' | 'fitness-plan' | string;

export interface Feedback {
  id: string;
  title: string;
  type: FeedbackType;
  rating: number;
  comments?: string;
  comment?: string; // For backward compatibility
  member_id?: string;
  member_name?: string;
  memberName?: string; // For backward compatibility
  related_id?: string;
  anonymous: boolean;
  branch_id?: string;
  created_at: string;
  updated_at?: string;
  category?: string;
}

export interface FeedbackSummary {
  id: string;
  rating: number;
  category: string;
  comment?: string;
  member_id: string;
  branch_id: string;
  created_at: string;
}

// Notification Settings
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
  sendOnInvoice?: boolean; // For backward compatibility
  sendClassUpdates?: boolean; // For backward compatibility
  sendOnRegistration?: boolean; // For backward compatibility
  created_at?: string;
  updated_at?: string;
}

export interface SmsSettings {
  id: string;
  provider: string;
  api_key: string;
  sender_id: string;
  templates: {
    membershipAlert: boolean;
    renewalReminder: boolean;
    otpVerification: boolean;
    attendanceConfirmation: boolean;
  };
  membershipAlert: boolean;
  renewalReminder: boolean;
  otpVerification: boolean;
  attendanceConfirmation: boolean;
  is_active: boolean;
  branch_id?: string;
  created_at: string;
  updated_at: string;
}

export interface WhatsappSettings {
  id: string;
  provider: string;
  api_key: string;
  phone_number: string;
  webhook_url?: string;
  is_active: boolean;
  branch_id?: string;
  created_at: string;
  updated_at: string;
}

export interface IntegrationStatus {
  id: string;
  integration_key: string;
  name: string;
  description: string;
  is_connected: boolean;
  last_sync?: string;
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
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

// Adapter Functions
/**
 * Adapts announcement data from database format to application format
 */
export const adaptAnnouncementFromDB = (dbAnnouncement: any): Announcement => ({
  ...dbAnnouncement,
  author_name: dbAnnouncement.author_name || dbAnnouncement.authorName,
  author_id: dbAnnouncement.author_id || dbAnnouncement.authorId,
  created_at: dbAnnouncement.created_at || dbAnnouncement.createdAt,
  updated_at: dbAnnouncement.updated_at || dbAnnouncement.updatedAt,
  expires_at: dbAnnouncement.expires_at || dbAnnouncement.expiresAt,
  branch_id: dbAnnouncement.branch_id || dbAnnouncement.branchId,
  target_roles: dbAnnouncement.target_roles || dbAnnouncement.targetRoles || [],
  channels: dbAnnouncement.channels || [],
  author: dbAnnouncement.author_name || dbAnnouncement.authorName
});

/**
 * Adapts feedback data from database format to application format
 */
export const adaptFeedbackFromDB = (data: any): Feedback => ({
  id: data.id,
  title: data.title || 'Untitled Feedback',
  type: data.type || 'general',
  rating: typeof data.rating === 'number' ? data.rating : 0,
  comments: data.comments || data.comment || '',
  comment: data.comment || data.comments || '', // For backward compatibility
  member_id: data.member_id || data.memberId,
  member_name: data.member_name || data.memberName || 'Anonymous',
  related_id: data.related_id || data.relatedId,
  anonymous: Boolean(data.anonymous),
  branch_id: data.branch_id || data.branchId,
  created_at: data.created_at || new Date().toISOString(),
  updated_at: data.updated_at,
  category: data.category
});

/**
 * Adapts reminder rule data from database format to application format
 */
export const adaptReminderRuleFromDB = (dbRule: any): ReminderRule => ({
  id: dbRule.id,
  title: dbRule.title || dbRule.name || 'Untitled Rule',
  description: dbRule.description,
  trigger_type: dbRule.trigger_type || dbRule.triggerType || '',
  trigger_value: dbRule.trigger_value || dbRule.triggerValue,
  conditions: dbRule.conditions || {},
  message: dbRule.message,
  target_roles: dbRule.target_roles || dbRule.targetRoles || [],
  send_via: dbRule.send_via || dbRule.sendVia || [],
  is_active: dbRule.is_active ?? dbRule.isActive ?? true,
  created_at: dbRule.created_at || new Date().toISOString(),
  updated_at: dbRule.updated_at,
  // Backward compatibility
  name: dbRule.title || dbRule.name,
  triggerType: dbRule.trigger_type || dbRule.triggerType,
  triggerValue: dbRule.trigger_value || dbRule.triggerValue,
  notificationChannel: dbRule.notification_channel || dbRule.notificationChannel,
  notification_channel: dbRule.notification_channel || dbRule.notificationChannel,
  targetRoles: dbRule.target_roles || dbRule.targetRoles,
  channels: dbRule.channels,
  targetType: dbRule.target_type || dbRule.targetType,
  target_type: dbRule.target_type || dbRule.targetType
});

/**
 * Adapts motivational message data from database format to application format
 */
export const adaptMotivationalMessageFromDB = (dbMessage: any): MotivationalMessage => ({
  id: dbMessage.id,
  title: dbMessage.title,
  content: dbMessage.content,
  target_audience: dbMessage.target_audience || [],
  send_via: dbMessage.send_via || [],
  scheduled_at: dbMessage.scheduled_at,
  status: dbMessage.status || 'draft',
  branch_id: dbMessage.branch_id,
  created_at: dbMessage.created_at || new Date().toISOString(),
  updated_at: dbMessage.updated_at,
  author: dbMessage.author,
  category: dbMessage.category || 'general',
  tags: dbMessage.tags || [],
  active: dbMessage.active ?? true
});
