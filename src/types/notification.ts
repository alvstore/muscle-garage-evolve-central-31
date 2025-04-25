
export type NotificationChannel = 'email' | 'sms' | 'whatsapp' | 'app' | 'push';
export type FeedbackType = 'general' | 'trainer' | 'class' | 'facility' | 'service' | 'equipment';
export type ReminderTriggerType = 
  'membership_expiry' | 
  'birthday' | 
  'class_reminder' | 
  'payment_due' | 
  'attendance_missed' | 
  'membership_renewal' | 
  'goal_achieved' | 
  'follow_up';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId?: string;
  authorName?: string;
  createdAt: string;
  updatedAt?: string;
  expiresAt?: string;
  priority: 'high' | 'medium' | 'low';
  channels: string[];
  targetRoles?: string[];
  branchId?: string;
}

export interface Feedback {
  id: string;
  type: FeedbackType;
  title: string;
  rating: number;
  comments?: string;
  memberId?: string;
  memberName?: string;
  relatedId?: string;
  anonymous?: boolean;
  createdAt: string;
  branchId?: string;
  
  // Aliases for backend compatibility
  member_id?: string;
  member_name?: string;
  branch_id?: string;
  related_id?: string;
}

export interface ReminderRule {
  id: string;
  title: string;
  description?: string;
  triggerType: ReminderTriggerType;
  triggerValue?: number;
  notificationChannel: NotificationChannel;
  sendVia: string[];
  targetRoles: string[];
  message?: string;
  conditions: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Adapter functions for API compatibility
export function adaptFeedbackFromDB(dbFeedback: any): Feedback {
  return {
    id: dbFeedback.id,
    type: dbFeedback.type as FeedbackType,
    title: dbFeedback.title,
    rating: dbFeedback.rating,
    comments: dbFeedback.comments,
    memberId: dbFeedback.member_id,
    memberName: dbFeedback.member_name,
    relatedId: dbFeedback.related_id,
    anonymous: dbFeedback.anonymous || false,
    createdAt: dbFeedback.created_at,
    branchId: dbFeedback.branch_id,
    
    // Add original snake_case properties for compatibility
    member_id: dbFeedback.member_id,
    member_name: dbFeedback.member_name,
    related_id: dbFeedback.related_id,
    branch_id: dbFeedback.branch_id,
  };
}

export function adaptAnnouncementFromDB(dbAnnouncement: any): Announcement {
  return {
    id: dbAnnouncement.id,
    title: dbAnnouncement.title,
    content: dbAnnouncement.content,
    authorId: dbAnnouncement.author_id,
    authorName: dbAnnouncement.author_name,
    createdAt: dbAnnouncement.created_at,
    updatedAt: dbAnnouncement.updated_at,
    expiresAt: dbAnnouncement.expires_at,
    priority: dbAnnouncement.priority || 'medium',
    channels: dbAnnouncement.channels || [],
    targetRoles: dbAnnouncement.target_roles || [],
    branchId: dbAnnouncement.branch_id,
  };
}

export function adaptReminderRuleFromDB(dbRule: any): ReminderRule {
  return {
    id: dbRule.id,
    title: dbRule.title,
    description: dbRule.description,
    triggerType: dbRule.trigger_type as ReminderTriggerType,
    triggerValue: dbRule.trigger_value,
    notificationChannel: dbRule.notification_channel as NotificationChannel,
    sendVia: dbRule.send_via || [],
    targetRoles: dbRule.target_roles || [],
    message: dbRule.message,
    conditions: dbRule.conditions || {},
    isActive: dbRule.is_active,
    createdAt: dbRule.created_at,
    updatedAt: dbRule.updated_at,
  };
}
