
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
  branch_id?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationChannel {
  type: 'email' | 'sms' | 'whatsapp' | 'push' | 'in_app';
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

// Define MotivationalCategory type
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
  // Additional properties for enhanced functionality
  author?: string;
  category?: MotivationalCategory;
  active?: boolean;
  tags?: string[];
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
  send_via: NotificationChannel[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Feedback {
  id: string;
  title: string;
  type: string;
  rating: number;
  comments?: string;
  member_id?: string;
  member_name?: string;
  related_id?: string;
  anonymous: boolean;
  branch_id?: string;
  created_at: string;
}

export interface EmailSettings {
  id: string;
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
  notifications: {
    sendOnRegistration: boolean;
    sendOnInvoice: boolean;
    sendClassUpdates: boolean;
  };
  is_active: boolean;
  branch_id?: string;
  created_at: string;
  updated_at: string;
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
