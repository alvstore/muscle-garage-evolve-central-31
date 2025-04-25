
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  userId: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BackupLogEntry {
  id: string;
  action: string;
  modules: string[];
  success: boolean;
  timestamp: string;
  total_records: number;
  success_count: number;
  failed_count: number;
  user_id: string;
  user_name: string;
  created_at: string;
  updated_at: string;
}

export interface MotivationalMessage {
  id: string;
  title: string;
  content: string;
  category: 'motivation' | 'fitness' | 'nutrition' | 'wellness';
  tags?: string[];
  author?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

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
  sentCount?: number;
}

export interface ReminderRule {
  id: string;
  name: string;
  description?: string;
  triggerType: string;
  triggerValue: number;
  active: boolean;
  message: string;
  targetType: string;
  channels: string[];
  createdAt: string;
  updatedAt: string;
  targetRoles: string[];
  sendVia: string[];
  notificationChannel?: string;
  conditions?: Record<string, any>;
}

export interface Feedback {
  id: string;
  title: string;
  content: string;
  rating: number;
  type: string;
  memberName?: string;
  memberId?: string;
  anonymous: boolean;
  branchId?: string;
  createdAt: string;
  updatedAt: string;
  comments?: string;
  relatedId?: string;
}

export type FeedbackType = 'general' | 'facility' | 'trainer' | 'class' | 'equipment';
export type NotificationChannel = 'in-app' | 'email' | 'sms' | 'whatsapp';
export type ReminderTriggerType = 'days_before_expiry' | 'days_since_last_visit' | 'on_birthday' | 'class_reminder';

// Adapter functions to convert from DB format to frontend format
export function adaptAnnouncementFromDB(announcement: any): Announcement {
  return {
    id: announcement.id,
    title: announcement.title,
    content: announcement.content,
    priority: announcement.priority,
    authorName: announcement.author_name,
    createdAt: announcement.created_at,
    expiresAt: announcement.expires_at,
    channel: announcement.channel || '',
    branchId: announcement.branch_id,
    targetRoles: announcement.target_roles || [],
    channels: announcement.channels || [],
    authorId: announcement.author_id,
    sentCount: announcement.sent_count
  };
}

export function adaptMotivationalMessageFromDB(message: any): MotivationalMessage {
  return {
    id: message.id,
    title: message.title,
    content: message.content,
    category: message.category,
    tags: message.tags,
    author: message.author,
    active: message.active,
    created_at: message.created_at,
    updated_at: message.updated_at
  };
}

export function adaptReminderRuleFromDB(rule: any): ReminderRule {
  return {
    id: rule.id,
    name: rule.title,
    description: rule.description,
    triggerType: rule.trigger_type,
    triggerValue: rule.trigger_value,
    active: rule.is_active,
    message: rule.message,
    targetType: rule.target_type || '',
    channels: rule.send_via || [],
    createdAt: rule.created_at,
    updatedAt: rule.updated_at,
    targetRoles: rule.target_roles || [],
    sendVia: rule.send_via || [],
    notificationChannel: rule.notification_channel,
    conditions: rule.conditions || {}
  };
}

export function adaptFeedbackFromDB(feedback: any): Feedback {
  return {
    id: feedback.id,
    title: feedback.title,
    content: feedback.comments || feedback.content,
    rating: feedback.rating,
    type: feedback.type,
    memberName: feedback.member_name,
    memberId: feedback.member_id,
    anonymous: feedback.anonymous || false,
    branchId: feedback.branch_id,
    createdAt: feedback.created_at,
    updatedAt: feedback.updated_at,
    comments: feedback.comments,
    relatedId: feedback.related_id
  };
}
