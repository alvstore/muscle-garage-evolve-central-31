
// Core notification types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  is_read: boolean;
  created_at: string;
  user_id?: string;
  branch_id?: string;
  link?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  target_audience: 'all' | 'members' | 'staff' | 'trainers';
  is_active: boolean;
  created_at: string;
  expires_at?: string;
  branch_id: string;
  created_by: string;
}

// Feedback types
export interface FeedbackSummary {
  id: string;
  rating: number;
  category: string;
  comment?: string;
  member_id: string;
  branch_id: string;
  created_at: string;
}

export interface Feedback {
  id: string;
  rating: number;
  category: string;
  comment?: string;
  member_id: string;
  branch_id: string;
  created_at: string;
  title: string;
  type: string;
}

export type FeedbackType = 'general' | 'trainer' | 'class' | 'fitness-plan';

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

// Notification channel type
export type NotificationChannel = 'email' | 'sms' | 'push' | 'in_app';

// Motivational message type
export interface MotivationalMessage {
  id: string;
  title: string;
  content: string;
  author?: string;
  category: string;
  tags?: string[];
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Adapter functions
export const adaptFeedbackFromDB = (data: any): Feedback => ({
  id: data.id,
  rating: data.rating,
  category: data.category,
  comment: data.comment,
  member_id: data.member_id,
  branch_id: data.branch_id,
  created_at: data.created_at,
  title: data.title || `${data.category} Feedback`,
  type: data.type || 'general',
});
