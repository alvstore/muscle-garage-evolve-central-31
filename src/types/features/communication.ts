
// Communication and notification types
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';
export type NotificationChannel = 'email' | 'sms' | 'push' | 'in_app' | 'whatsapp';
export type NotificationCategory = 'system' | 'membership' | 'class' | 'payment' | 'announcement' | 'reminder';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  channels: NotificationChannel[];
  read: boolean;
  read_at?: string;
  data?: Record<string, any>;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author?: string;
  author_id?: string;
  author_name?: string;
  priority: NotificationPriority;
  target_roles: UserRole[];
  channels: NotificationChannel[];
  branch_id?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AnnouncementRead {
  id: string;
  announcement_id: string;
  user_id: string;
  read_at: string;
  created_at: string;
  updated_at: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: string;
  variables?: Record<string, any>;
  is_active: boolean;
  branch_id?: string;
  created_at: string;
  updated_at: string;
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

export interface CommunicationTask {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed' | 'cancelled';
  priority: NotificationPriority;
  assigned_to?: string;
  created_by?: string;
  due_date?: string;
  branch_id?: string;
  created_at: string;
  updated_at: string;
}
