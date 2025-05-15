
export interface Notification {
  id: string;
  title: string;
  message?: string;
  read: boolean;
  created_at: string;
  type?: string;
  user_id: string;
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
