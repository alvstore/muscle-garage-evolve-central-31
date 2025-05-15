
// Add any imports if needed
import { InvoiceItem, InvoiceStatus } from './finance';

export interface Notification {
  id: string;
  title: string;
  message?: string;
  read?: boolean;
  created_at?: string;
  type?: string;
  user_id: string;
}

export type FeedbackType = 'general' | 'class' | 'trainer' | 'facility' | 'other';

export interface Feedback {
  id: string;
  title: string;
  type: FeedbackType;
  rating: number;
  comments?: string;
  member_id?: string;
  branch_id?: string;
  created_at?: string;
  anonymous?: boolean;
  related_id?: string;
  member_name?: string;
}

export type MotivationalCategory = 'fitness' | 'nutrition' | 'mental' | 'wellness' | 'general';

export interface MotivationalMessage {
  id: string;
  title: string;
  content: string;
  category: MotivationalCategory;
  author?: string;
  tags?: string[];
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type NotificationChannel = 'email' | 'sms' | 'in-app' | 'whatsapp';

export interface ReminderRule {
  id: string;
  title: string;
  description?: string;
  trigger_type: string;
  triggerType?: string; // For backward compatibility
  trigger_value?: number;
  triggerValue?: number; // For backward compatibility
  message?: string;
  notification_channel?: string;
  send_via: string[];
  sendVia?: string[]; // For backward compatibility
  channels?: string[]; // For backward compatibility
  is_active: boolean;
  isActive?: boolean; // For backward compatibility
  active?: boolean; // For backward compatibility
  target_roles: string[];
  targetRoles?: string[]; // For backward compatibility
  conditions: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId?: string;
  author_id?: string;
  authorName?: string;
  author_name?: string;
  author?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  expiresAt?: string;
  expires_at?: string;
  priority: string;
  targetRoles?: string[];
  target_roles?: string[];
  channels?: string[];
  channel?: string;
  branchId?: string;
  branch_id?: string;
}

// Export InvoiceStatus from finance.ts here for components that need it
export { InvoiceStatus } from './finance';

// Invoice for notifications - simpler version of finance Invoice
export interface Invoice {
  id: string;
  member_id: string;
  memberName?: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
  issuedDate: string;
  paidDate?: string;
  items?: InvoiceItem[];
  branchId?: string;
  notes?: string;
  subtotal?: number;
  discount?: number;
  tax?: number;
  total?: number;
  description?: string;
}

// Add adapter functions
export const adaptAnnouncementFromDB = (data: any): Announcement => {
  return {
    id: data.id,
    title: data.title,
    content: data.content,
    authorId: data.author_id,
    author_id: data.author_id,
    authorName: data.author_name,
    author_name: data.author_name,
    author: data.author,
    createdAt: data.created_at,
    created_at: data.created_at,
    updatedAt: data.updated_at,
    updated_at: data.updated_at,
    expiresAt: data.expires_at,
    expires_at: data.expires_at,
    priority: data.priority,
    targetRoles: data.target_roles,
    target_roles: data.target_roles,
    channels: data.channels,
    channel: data.channel,
    branchId: data.branch_id,
    branch_id: data.branch_id
  };
};

export const adaptReminderRuleFromDB = (data: any): ReminderRule => {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    trigger_type: data.trigger_type,
    triggerType: data.trigger_type, // For backward compatibility
    trigger_value: data.trigger_value,
    triggerValue: data.trigger_value, // For backward compatibility
    message: data.message,
    notification_channel: data.notification_channel,
    send_via: data.send_via || [],
    sendVia: data.send_via || [], // For backward compatibility
    channels: data.send_via || [], // For backward compatibility
    is_active: data.is_active,
    isActive: data.is_active, // For backward compatibility
    active: data.is_active, // For backward compatibility
    target_roles: data.target_roles || [],
    targetRoles: data.target_roles || [], // For backward compatibility
    conditions: data.conditions || {},
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};

export const adaptMotivationalMessageFromDB = (data: any): MotivationalMessage => {
  return {
    id: data.id,
    title: data.title,
    content: data.content,
    category: data.category,
    author: data.author,
    tags: data.tags,
    active: data.active,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};
