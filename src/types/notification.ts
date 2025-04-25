
// Define the base types and interfaces for notification related features

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: string;
  authorName: string;
  createdAt: string;
  expiresAt?: string;
  channel: string;
  branchId: string;
  targetRoles: string[];
  channels: string[];
  authorId: string;
}

export interface Feedback {
  id: string;
  member_id: string;
  memberId?: string; // For compatibility
  member_name: string;
  memberName?: string; // For compatibility
  type: string;
  related_id: string;
  relatedId?: string; // For compatibility
  rating: number;
  comments: string;
  content?: string; // For compatibility
  anonymous: boolean;
  title: string;
  created_at: string;
  createdAt?: string; // For compatibility
  branch_id: string;
  branchId?: string; // For compatibility
}

export interface ReminderRule {
  id: string;
  title: string;
  name?: string; // For compatibility
  description?: string;
  triggerType: string;
  triggerValue?: number;
  notificationChannel?: string;
  conditions?: Record<string, any>;
  isActive?: boolean;
  active?: boolean; // For compatibility
  enabled?: boolean; // For compatibility
  createdAt?: string;
  updatedAt?: string;
  message?: string;
  sendVia: string[];
  targetRoles: string[];
  channels?: string[]; // For compatibility
  targetType?: string; // For compatibility
}

export interface MotivationalMessage {
  id: string;
  title: string;
  content: string;
  category: 'motivation' | 'fitness' | 'nutrition' | 'wellness';
  tags?: string[];
  author?: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
  frequency?: string; // Added for compatibility
  targetGoal?: string; // Added for compatibility
  isActive?: boolean; // For compatibility
  createdAt?: string; // For compatibility
}

// Backup related interfaces
export interface BackupLogEntry {
  id: string;
  user_id?: string;
  user_name?: string;
  action: string;
  modules: string[];
  timestamp: string;
  success: boolean;
  total_records?: number;
  success_count?: number;
  failed_count?: number;
  created_at: string;
  updated_at: string;
}

// Adapter functions to convert database records to frontend types
export function adaptAnnouncementFromDB(data: any): Announcement {
  return {
    id: data.id,
    title: data.title,
    content: data.content,
    priority: data.priority || 'normal',
    authorName: data.author_name || 'System',
    createdAt: data.created_at,
    expiresAt: data.expires_at,
    channel: data.channel || '',
    branchId: data.branch_id || '',
    targetRoles: data.target_roles || [],
    channels: data.channels || [],
    authorId: data.author_id || '',
  };
}

export function adaptFeedbackFromDB(data: any): Feedback {
  return {
    id: data.id,
    member_id: data.member_id,
    memberId: data.member_id,
    member_name: data.member_name,
    memberName: data.member_name,
    type: data.type,
    related_id: data.related_id,
    relatedId: data.related_id,
    rating: data.rating,
    comments: data.comments,
    content: data.comments, // Adding content for compatibility
    anonymous: data.anonymous || false,
    title: data.title,
    created_at: data.created_at,
    createdAt: data.created_at,
    branch_id: data.branch_id || '',
    branchId: data.branch_id || '',
  };
}

export function adaptReminderRuleFromDB(data: any): ReminderRule {
  return {
    id: data.id,
    title: data.title,
    name: data.title, // For compatibility
    description: data.description || '',
    triggerType: data.trigger_type,
    triggerValue: data.trigger_value,
    notificationChannel: data.notification_channel,
    conditions: data.conditions || {},
    isActive: data.is_active,
    active: data.is_active,
    enabled: data.is_active,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    message: data.message || '',
    sendVia: data.send_via || [],
    targetRoles: data.target_roles || [],
    channels: data.send_via || [], // For compatibility
    targetType: data.target_type || 'all_members', // For compatibility
  };
}

export function adaptMotivationalMessageFromDB(data: any): MotivationalMessage {
  return {
    id: data.id,
    title: data.title,
    content: data.content,
    category: data.category as 'motivation' | 'fitness' | 'nutrition' | 'wellness',
    tags: data.tags || [],
    author: data.author || 'Unknown',
    active: data.active || false,
    isActive: data.active || false, // For compatibility
    created_at: data.created_at,
    updated_at: data.updated_at,
    createdAt: data.created_at, // For compatibility
    frequency: data.category, // For compatibility
    targetGoal: data.tags?.join(', ') || 'General', // For compatibility
  };
}

// Types for notification related components
export type FeedbackType = 'general' | 'trainer' | 'class' | 'facility' | 'equipment';

export interface NotificationType {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
  isRead: boolean;
  link?: string;
  priority?: 'high' | 'normal' | 'low';
}

export type MotivationalCategory = 'motivation' | 'fitness' | 'nutrition' | 'wellness';

export type NotificationChannel = 'email' | 'sms' | 'in-app' | 'whatsapp';

export interface Invoice {
  id: string;
  memberName: string;
  member_id?: string;
  description: string;
  amount: number;
  status: string;
  dueDate: string;
  due_date?: string; // For compatibility
  paymentMethod: string;
  payment_method?: string; // For compatibility
  notes?: string;
  createdAt: string;
  created_at?: string; // For compatibility
  paidDate?: string;
  paid_date?: string; // For compatibility
  branchId?: string;
  branch_id?: string; // For compatibility
  razorpayOrderId?: string;
  razorpay_order_id?: string; // For compatibility
  razorpayPaymentId?: string;
  razorpay_payment_id?: string; // For compatibility
}

export type InvoiceStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';
