
export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  authorName: string;
  createdAt: string;
  expiresAt?: string;
  channel?: 'email' | 'sms' | 'whatsapp' | 'push';
  branchId?: string;
  // Add these missing properties that components are using
  targetRoles: string[];
  channels?: ('email' | 'sms' | 'whatsapp' | 'in-app')[];
  // For backward compatibility
  authorId?: string;
}

export interface ReminderRule {
  id: string;
  title: string;
  description?: string;
  triggerType: 'membership-expiry' | 'class-reminder' | 'birthday' | 'custom';
  notificationChannel: 'email' | 'sms' | 'whatsapp' | 'push';
  conditions: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Add these missing properties that components are using
  name: string;
  triggerValue?: number;
  message?: string;
  sendVia?: ('email' | 'sms' | 'whatsapp' | 'in-app')[];
  targetRoles?: string[];
  active: boolean;
  enabled?: boolean;
}

export interface MotivationalMessage {
  id: string;
  title?: string;
  content: string;
  author?: string;
  category: 'motivation' | 'fitness' | 'nutrition' | 'wellness';
  tags?: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Feedback {
  id: string;
  member_id: string;
  member_name?: string;
  type: 'general' | 'trainer' | 'class' | 'fitness-plan';
  related_id?: string;
  rating: number;
  comments?: string;
  anonymous: boolean;
  title: string;
  created_at: string;
  branch_id?: string;
}

// Add additional notification types
export type ReminderTriggerType = 'membership-expiry' | 'class-reminder' | 'birthday' | 'custom';
export type NotificationChannel = 'email' | 'sms' | 'whatsapp' | 'push' | 'in-app';

// Add BackupLogEntry interface for BackupLogs.tsx
export interface BackupLogEntry {
  id: string;
  action: 'export' | 'import';
  userId: string;
  userName: string;
  timestamp: string;
  modules: string[];
  success: boolean;
  totalRecords?: number;
  successCount?: number;
  failedCount?: number;
}
