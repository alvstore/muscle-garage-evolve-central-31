
export type NotificationChannel = 'email' | 'sms' | 'push' | 'in_app' | 'whatsapp';

export type NotificationType = 
  | 'membership' 
  | 'payment' 
  | 'checkin' 
  | 'class' 
  | 'message' 
  | 'user' 
  | 'warning' 
  | 'danger' 
  | 'renew'
  | 'success'
  | 'error'
  | 'info';

export type FeedbackType = 'general' | 'trainer' | 'facility' | 'class' | 'service';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  read?: boolean;
  is_read?: boolean;
  created_at: string;
  updated_at?: string;
  data?: Record<string, any>;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author?: string;
  author_id?: string;
  author_name?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  target_roles: string[];
  channels: NotificationChannel[];
  channel?: string;
  expires_at?: string;
  branch_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Feedback {
  id: string;
  member_id?: string;
  member_name?: string;
  title: string;
  comments?: string;
  rating: number;
  type: FeedbackType;
  related_id?: string;
  anonymous?: boolean;
  branch_id?: string;
  created_at: string;
}

export interface ReminderRule {
  id: string;
  name: string;
  description?: string;
  trigger_type: string;
  trigger_condition: Record<string, any>;
  actions: Record<string, any>;
  is_active: boolean;
  branch_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface MotivationalMessage {
  id: string;
  title: string;
  content: string;
  category: string;
  is_active: boolean;
  branch_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  assigned_to?: string;
  created_by?: string;
  due_date?: string;
  branch_id?: string;
  created_at: string;
  updated_at: string;
}

// Invoice interface for notifications
export interface Invoice {
  id: string;
  member_id: string;
  member_name: string;
  amount: number;
  description?: string;
  status: string;
  due_date: string;
  issued_date?: string;
  created_at: string;
  updated_at?: string;
  payment_date?: string;
  paid_date?: string;
  payment_method?: string;
  notes?: string;
  branch_id?: string;
  items?: any[];
  membership_plan_id?: string;
  membershipPlanId?: string;
}
