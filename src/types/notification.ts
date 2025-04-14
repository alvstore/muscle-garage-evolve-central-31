
// Notification types for the system
export type FeedbackType = 'general' | 'trainer' | 'class' | 'fitness-plan';

export interface Feedback {
  id: string;
  memberId?: string;
  memberName?: string;
  type: FeedbackType;
  relatedId?: string;
  rating: number;
  comments: string;
  createdAt: string;
  anonymous: boolean;
  title: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  expiresAt?: string;
  priority: 'low' | 'medium' | 'high';
  forRoles?: string[];
  forBranchIds?: string[];
}
