
export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  user_id: string;
  link?: string;
  metadata?: Record<string, any>;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  whatsapp: boolean;
}

export interface NotificationChannel {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at?: string;
  author_id: string;
  author_name?: string;
  is_active: boolean;
  expiry_date?: string;
  channels: string[];
  branch_id?: string;
}

export interface FeedbackType {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
}

export interface Feedback {
  id: string;
  member_id: string;
  member_name?: string;
  type_id: string;
  type_name?: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at?: string;
  status: 'new' | 'in-progress' | 'resolved' | 'closed';
  assigned_to?: string;
  branch_id?: string;
}

export interface MotivationalCategory {
  id: string;
  name: string;
  description?: string;
}

export interface MotivationalMessage {
  id: string;
  category_id: string;
  message: string;
  author?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface ReminderRule {
  id: string;
  name: string;
  event_type: string;
  days_before: number;
  message_template: string;
  channels: string[];
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Invoice {
  id: string;
  member_id: string;
  member_name?: string;
  amount: number;
  description: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled' | 'draft';
  due_date: string;
  payment_date?: string;
  payment_method?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}
