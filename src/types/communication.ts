
export interface CommunicationTask {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assigned_to?: string;
  created_by?: string;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  publish_date: string;
  expire_date?: string;
  is_active?: boolean;
  created_by?: string;
  branch_id?: string;
  target_audience?: string[];
  created_at?: string;
  updated_at?: string;
}

export type MotivationalCategory = 'fitness' | 'health' | 'nutrition' | 'mindfulness' | 'general';

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
  branch_id?: string;
}

export interface ReminderRule {
  id: string;
  name: string;
  description?: string;
  event_type: string;
  days_before?: number;
  message_template: string;
  is_active?: boolean;
  branch_id?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export type FeedbackType = 'suggestion' | 'complaint' | 'praise' | 'question' | 'other';

export interface Feedback {
  id: string;
  member_id?: string;
  feedback_type: FeedbackType;
  subject: string;
  content: string;
  rating?: number;
  status?: string;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
  response?: string;
  responded_by?: string;
  responded_at?: string;
}
