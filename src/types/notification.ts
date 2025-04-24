
export interface MotivationalMessage {
  id: string;
  title: string;
  content: string;
  author: string;
  category: 'motivation' | 'fitness' | 'nutrition' | 'wellness';
  tags: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Feedback {
  id: string;
  member_id: string;
  member_name: string;
  type: 'general' | 'trainer' | 'class' | 'fitness-plan';
  related_id?: string;
  rating: number;
  comments?: string;
  anonymous: boolean;
  title: string;
  created_at: string;
  branch_id?: string;
}
