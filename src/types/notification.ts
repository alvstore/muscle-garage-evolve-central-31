
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
  expiresAt?: string; // Adding for backward compatibility
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

export type MotivationalCategory = 'fitness' | 'nutrition' | 'mindfulness' | 'general' | 'motivation' | 'recovery' | 'wellness';

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
  name?: string; // For backward compatibility
  description?: string;
  trigger_type: string;
  triggerType?: string; // For backward compatibility
  trigger_value?: number;
  triggerValue?: number; // For backward compatibility
  conditions?: Record<string, any>;
  message?: string;
  notification_channel?: string;
  notificationChannel?: string; // For backward compatibility
  is_active: boolean;
  isActive?: boolean; // For backward compatibility
  active?: boolean; // For backward compatibility
  target_roles: string[];
  targetRoles?: string[]; // For backward compatibility
  send_via: string[];
  sendVia?: string[]; // For backward compatibility
  channels?: string[]; // For backward compatibility
  targetType?: string; // For backward compatibility
  created_at?: string;
  updated_at?: string;
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

export const adaptAnnouncementFromDB = (dbAnnouncement: any): Announcement => {
  return {
    id: dbAnnouncement.id,
    title: dbAnnouncement.title,
    content: dbAnnouncement.content,
    priority: dbAnnouncement.priority || 'medium',
    authorName: dbAnnouncement.author_name,
    authorId: dbAnnouncement.author_id,
    createdAt: dbAnnouncement.created_at,
    expires_at: dbAnnouncement.expires_at,
    expiresAt: dbAnnouncement.expires_at, // Add for backward compatibility
    channel: dbAnnouncement.channel,
    branchId: dbAnnouncement.branch_id,
    targetRoles: dbAnnouncement.target_roles || [],
    channels: dbAnnouncement.channels || []
  };
};

export const adaptReminderRuleFromDB = (dbRule: any): ReminderRule => {
  return {
    id: dbRule.id,
    title: dbRule.title,
    name: dbRule.title, // For backward compatibility
    description: dbRule.description,
    trigger_type: dbRule.trigger_type,
    triggerType: dbRule.trigger_type, // For backward compatibility
    trigger_value: dbRule.trigger_value,
    triggerValue: dbRule.trigger_value, // For backward compatibility
    message: dbRule.message,
    notification_channel: dbRule.notification_channel,
    notificationChannel: dbRule.notification_channel, // For backward compatibility
    conditions: dbRule.conditions || {},
    is_active: dbRule.is_active,
    isActive: dbRule.is_active, // For backward compatibility
    active: dbRule.is_active, // For backward compatibility
    target_roles: dbRule.target_roles || [],
    targetRoles: dbRule.target_roles || [], // For backward compatibility
    send_via: dbRule.send_via || [],
    sendVia: dbRule.send_via || [], // For backward compatibility
    channels: dbRule.send_via || [], // For backward compatibility
    targetType: dbRule.target_type || 'all',
    created_at: dbRule.created_at,
    updated_at: dbRule.updated_at
  };
};

export const adaptMotivationalMessageFromDB = (dbMessage: any): MotivationalMessage => {
  return {
    id: dbMessage.id,
    title: dbMessage.title,
    content: dbMessage.content,
    author: dbMessage.author,
    category: dbMessage.category,
    tags: dbMessage.tags || [],
    active: dbMessage.active,
    created_at: dbMessage.created_at,
    updated_at: dbMessage.updated_at
  };
};
