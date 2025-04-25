
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
}
