export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp?: string; // Add timestamp for backward compatibility
  read: boolean;
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
  createdAt: string;
  expiresAt?: string; // For backward compatibility
  expires_at?: string;
  channel?: string;
  branchId?: string;
  targetRoles?: string[];
  channels?: string[];
}

// Adapter function to convert database object to frontend model
export const adaptAnnouncementFromDB = (dbAnnouncement: any): Announcement => {
  return {
    id: dbAnnouncement.id,
    title: dbAnnouncement.title,
    content: dbAnnouncement.content,
    priority: dbAnnouncement.priority || 'medium',
    authorName: dbAnnouncement.author_name,
    authorId: dbAnnouncement.author_id,
    createdAt: dbAnnouncement.created_at,
    expiresAt: dbAnnouncement.expires_at,
    channel: dbAnnouncement.channel,
    branchId: dbAnnouncement.branch_id,
    targetRoles: dbAnnouncement.target_roles,
    channels: dbAnnouncement.channels
  };
};

// You should also add the other adapter functions that are being imported
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
    triggerValue: dbRule.trigger_value,
    message: dbRule.message,
    notificationChannel: dbRule.notification_channel,
    conditions: dbRule.conditions || {},
    isActive: dbRule.is_active,
    active: dbRule.is_active, // For backward compatibility
    targetRoles: dbRule.target_roles || [],
    sendVia: dbRule.send_via || [],
    channels: dbRule.channels || [],
    targetType: dbRule.target_type || 'all'
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

// You'll also need to define the Feedback and MotivationalMessage interfaces
export interface Feedback {
  id: string;
  title: string;
  rating: number;
  comments?: string;
  member_id?: string;
  member_name?: string;
  branch_id?: string;
  type: string;
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

// Add missing types for Invoice
export interface Invoice {
  id: string;
  member_id?: string;
  amount: number;
  status: InvoiceStatus;
  due_date: string;
  issued_date: string;
  paid_date?: string;
  payment_method?: string;
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  branch_id?: string;
  items: any[];
  description?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  membership_plan_id?: string;
}

// Add missing types for enums
export type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'cancelled' | 'draft';
export type FeedbackType = 'general' | 'trainer' | 'facility' | 'class' | 'equipment';
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
