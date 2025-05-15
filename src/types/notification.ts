
export interface Notification {
  id: string;
  title: string;
  message?: string;
  read: boolean;
  created_at: string;
  type?: string;
  user_id: string;
  timestamp?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId?: string;
  authorName?: string;
  author?: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
  targetRoles: string[];
  channels: string[];
  channel?: string;
  branchId?: string;
  expires_at?: string;
}

export type FeedbackType = 'general' | 'trainer' | 'class' | 'facility' | 'equipment' | 'service';

export interface Feedback {
  id: string;
  member_id?: string;
  type: FeedbackType;
  title: string;
  content?: string;
  comments?: string;
  rating: number;
  anonymous: boolean;
  created_at: string;
  member_name?: string;
  branch_id?: string;
  related_id?: string;
}

export interface BackupLogEntry {
  id: string;
  action: 'export' | 'import';
  user_id?: string;
  user_name?: string;
  timestamp: string;
  modules: string[];
  success: boolean;
  total_records?: number;
  success_count?: number;
  failed_count?: number;
  created_at: string;
  updated_at: string;
}

export type MotivationalCategory = 'fitness' | 'nutrition' | 'mindfulness' | 'general';

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

export interface ReminderRule {
  id: string;
  title: string;
  description?: string;
  trigger_type: string;
  trigger_value?: number;
  conditions: Record<string, any>;
  target_roles: string[];
  message?: string;
  send_via: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type NotificationChannel = 'email' | 'sms' | 'push' | 'in-app' | 'whatsapp';

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'pending';

export interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  discount?: number;
}

export interface Invoice {
  id: string;
  member_id: string;
  memberName?: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
  issuedDate: string;
  paidDate?: string;
  items: InvoiceItem[];
  branchId?: string;
  notes?: string;
  subtotal?: number;
  discount?: number;
  tax?: number;
  total?: number;
  created_at?: string;
  updated_at?: string;
}
