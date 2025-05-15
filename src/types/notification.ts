
export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  read?: boolean; // For backward compatibility
  created_at: string;
  user_id: string;
  link?: string;
  metadata?: Record<string, any>;
  timestamp?: string; // For backward compatibility
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
  createdAt?: string; // For backward compatibility
  updated_at?: string;
  author_id: string;
  author_name?: string;
  authorName?: string; // For backward compatibility
  is_active: boolean;
  expires_at?: string;
  expiresAt?: string; // For backward compatibility
  expiry_date?: string;
  channels: string[];
  branch_id?: string;
  priority: string;
  target_roles?: string[];
  targetRoles?: string[]; // For backward compatibility
}

export type FeedbackType = 'general' | 'trainer' | 'facility' | 'class' | 'equipment' | 'service';

export interface Feedback {
  id: string;
  member_id: string;
  member_name?: string;
  type: FeedbackType;
  type_id?: string;
  type_name?: string;
  rating: number;
  comment?: string;
  comments?: string; // For backward compatibility
  title?: string;
  created_at: string;
  updated_at?: string;
  status?: 'new' | 'in-progress' | 'resolved' | 'closed';
  assigned_to?: string;
  branch_id?: string;
  anonymous?: boolean;
  related_id?: string;
}

export type MotivationalCategory = 'fitness' | 'nutrition' | 'mindfulness' | 'recovery' | 'general' | 'motivation' | 'wellness';

export interface MotivationalMessage {
  id: string;
  category: MotivationalCategory;
  message?: string;
  title: string;
  content: string;
  author?: string;
  is_active?: boolean;
  active?: boolean;
  created_at: string;
  updated_at?: string;
  tags?: string[];
}

export interface ReminderRule {
  id: string;
  name?: string; 
  title: string;
  description?: string;
  trigger_type: string;
  triggerType?: string;
  trigger_value: number;
  triggerValue?: number;
  message?: string;
  notification_channel?: string;
  notificationChannel?: string;
  conditions: Record<string, any>;
  is_active: boolean;
  isActive?: boolean;
  active?: boolean;
  target_roles: string[];
  targetRoles?: string[];
  send_via: string[];
  sendVia?: string[];
  channels?: string[];
  targetType?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Invoice {
  id: string;
  member_id: string;
  member_name?: string;
  memberName?: string; // For backward compatibility
  amount: number;
  description?: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled' | 'draft';
  due_date: string;
  payment_date?: string;
  payment_method?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
  issued_date?: string;
  issuedDate?: string; // For backward compatibility
  paid_date?: string;
  paidDate?: string; // For backward compatibility
}

// Add adapter functions to convert between frontend and backend models
export function adaptAnnouncementFromDB(dbAnnouncement: any): Announcement {
  return {
    id: dbAnnouncement.id,
    title: dbAnnouncement.title,
    content: dbAnnouncement.content,
    created_at: dbAnnouncement.created_at,
    createdAt: dbAnnouncement.created_at,
    updated_at: dbAnnouncement.updated_at,
    author_id: dbAnnouncement.author_id,
    author_name: dbAnnouncement.author_name,
    authorName: dbAnnouncement.author_name,
    is_active: dbAnnouncement.is_active || true,
    expires_at: dbAnnouncement.expires_at || dbAnnouncement.expiry_date,
    expiresAt: dbAnnouncement.expires_at || dbAnnouncement.expiry_date,
    expiry_date: dbAnnouncement.expiry_date || dbAnnouncement.expires_at,
    channels: dbAnnouncement.channels || [],
    branch_id: dbAnnouncement.branch_id,
    priority: dbAnnouncement.priority || 'medium',
    target_roles: dbAnnouncement.target_roles || [],
    targetRoles: dbAnnouncement.target_roles || []
  };
}

export function adaptMotivationalMessageFromDB(dbMessage: any): MotivationalMessage {
  return {
    id: dbMessage.id,
    title: dbMessage.title,
    content: dbMessage.content,
    message: dbMessage.message || dbMessage.content,
    author: dbMessage.author,
    category: dbMessage.category || 'general',
    tags: dbMessage.tags || [],
    is_active: dbMessage.is_active || dbMessage.active || true,
    active: dbMessage.active || dbMessage.is_active || true,
    created_at: dbMessage.created_at,
    updated_at: dbMessage.updated_at
  };
}

export function adaptReminderRuleFromDB(dbRule: any): ReminderRule {
  return {
    id: dbRule.id,
    title: dbRule.title || dbRule.name,
    name: dbRule.name || dbRule.title,
    description: dbRule.description || '',
    trigger_type: dbRule.trigger_type,
    triggerType: dbRule.trigger_type,
    trigger_value: dbRule.trigger_value || 0,
    triggerValue: dbRule.trigger_value || 0,
    message: dbRule.message || '',
    notification_channel: dbRule.notification_channel,
    notificationChannel: dbRule.notification_channel,
    conditions: dbRule.conditions || {},
    is_active: dbRule.is_active || dbRule.active || true,
    isActive: dbRule.is_active || dbRule.active || true,
    active: dbRule.is_active || dbRule.active || true,
    target_roles: dbRule.target_roles || [],
    targetRoles: dbRule.target_roles || [],
    send_via: dbRule.send_via || dbRule.channels || [],
    sendVia: dbRule.send_via || dbRule.channels || [],
    channels: dbRule.channels || dbRule.send_via || [],
    created_at: dbRule.created_at,
    updated_at: dbRule.updated_at
  };
}

export function adaptFeedbackFromDB(dbFeedback: any): Feedback {
  return {
    id: dbFeedback.id,
    title: dbFeedback.title,
    type: dbFeedback.type || 'general',
    rating: dbFeedback.rating,
    comment: dbFeedback.comment,
    comments: dbFeedback.comments || dbFeedback.comment,
    member_id: dbFeedback.member_id,
    member_name: dbFeedback.member_name,
    branch_id: dbFeedback.branch_id,
    created_at: dbFeedback.created_at,
    anonymous: dbFeedback.anonymous || false,
    related_id: dbFeedback.related_id
  };
}

// Create a utility function to convert between notification.Invoice and finance.Invoice
export function notificationToFinanceInvoice(invoice: Invoice): any {
  return {
    id: invoice.id,
    member_id: invoice.member_id,
    memberName: invoice.member_name,
    amount: invoice.amount,
    description: invoice.description || '',
    status: invoice.status,
    due_date: invoice.due_date,
    payment_method: invoice.payment_method,
    notes: invoice.notes,
    items: [],
    branch_id: '',
    created_at: invoice.created_at,
    updated_at: invoice.updated_at
  };
}
