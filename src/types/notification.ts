export type NotificationChannel = 'email' | 'sms' | 'whatsapp' | 'app' | 'push';

export type ReminderTriggerType = 
  'membership_expiry' | 
  'birthday' | 
  'class_reminder' | 
  'payment_due' | 
  'attendance_missed' |
  'membership_renewal' | 
  'goal_achieved' |
  'follow_up';

export interface ReminderRule {
  id: string;
  title: string;
  description: string;
  triggerType: ReminderTriggerType;
  triggerValue?: number;
  notificationChannel: NotificationChannel; 
  conditions: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  message?: string;
  sendVia: string[];
  targetRoles: string[];
}

export type FeedbackType = 'general' | 'trainer' | 'class' | 'facility' | 'service' | 'equipment';

export interface Feedback {
  id: string;
  title: string;
  type: FeedbackType;
  rating: number;
  comments?: string;
  memberId?: string;
  memberName?: string;
  branchId?: string;
  createdAt?: string;
  relatedId?: string;
  anonymous: boolean;
  member_id?: string;
  member_name?: string;
  branch_id?: string;
  created_at?: string;
  related_id?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  authorId?: string;
  authorName?: string;
  createdAt: string;
  updatedAt?: string;
  expiresAt?: string;
  targetRoles: string[];
  channels: string[];
  branchId?: string;
  status?: 'active' | 'draft' | 'expired';
  sentCount?: number;
  author_id?: string;
  author_name?: string;
  created_at?: string;
  updated_at?: string;
  expires_at?: string;
  target_roles?: string[];
  branch_id?: string;
}

export interface MotivationalMessage {
  id: string;
  title: string;
  content: string;
  author?: string;
  category: 'motivation' | 'fitness' | 'nutrition' | 'wellness';
  tags?: string[];
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BackupLogEntry {
  id: string;
  action: string;
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

export function adaptFeedbackFromDB(dbFeedback: any): Feedback {
  return {
    id: dbFeedback.id,
    title: dbFeedback.title,
    type: dbFeedback.type as FeedbackType,
    rating: dbFeedback.rating,
    comments: dbFeedback.comments,
    memberId: dbFeedback.member_id,
    memberName: dbFeedback.member_name,
    branchId: dbFeedback.branch_id,
    createdAt: dbFeedback.created_at,
    relatedId: dbFeedback.related_id,
    anonymous: dbFeedback.anonymous || false,
    member_id: dbFeedback.member_id,
    member_name: dbFeedback.member_name,
    branch_id: dbFeedback.branch_id,
    created_at: dbFeedback.created_at,
    related_id: dbFeedback.related_id
  };
}

export function adaptAnnouncementFromDB(dbAnnouncement: any): Announcement {
  return {
    id: dbAnnouncement.id,
    title: dbAnnouncement.title,
    content: dbAnnouncement.content,
    priority: dbAnnouncement.priority,
    authorId: dbAnnouncement.author_id,
    authorName: dbAnnouncement.author_name,
    createdAt: dbAnnouncement.created_at,
    updatedAt: dbAnnouncement.updated_at,
    expiresAt: dbAnnouncement.expires_at,
    targetRoles: dbAnnouncement.target_roles || [],
    channels: dbAnnouncement.channels || [],
    branchId: dbAnnouncement.branch_id,
    status: dbAnnouncement.status,
    sentCount: dbAnnouncement.sent_count,
    author_id: dbAnnouncement.author_id,
    author_name: dbAnnouncement.author_name,
    created_at: dbAnnouncement.created_at,
    updated_at: dbAnnouncement.updated_at,
    expires_at: dbAnnouncement.expires_at,
    target_roles: dbAnnouncement.target_roles || [],
    branch_id: dbAnnouncement.branch_id
  };
}
