
export type NotificationChannel = 'in-app' | 'email' | 'sms' | 'whatsapp';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
  targetRoles: string[];
  channels: NotificationChannel[];
  sentCount: number;
  forRoles: string[];
  createdBy: string;
}
