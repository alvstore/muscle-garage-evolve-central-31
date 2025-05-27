
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
  user_id?: string;
  branch_id?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  target_audience: 'all' | 'members' | 'staff' | 'trainers';
  is_active: boolean;
  created_at: string;
  expires_at?: string;
  branch_id: string;
  created_by: string;
}

export interface FeedbackSummary {
  id: string;
  rating: number;
  category: string;
  comment?: string;
  member_id: string;
  branch_id: string;
  created_at: string;
}
