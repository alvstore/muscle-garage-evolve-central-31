
export interface ReminderRule {
  id: string;
  name: string;
  title: string;
  description?: string;
  triggerType: string;
  triggerValue: number;
  message?: string;
  notificationChannel?: string;
  conditions?: Record<string, any>;
  isActive?: boolean;
  active?: boolean;
  targetRoles: string[];
  sendVia: string[];
  channels: string[];
  targetType: string;
}

export interface IntegrationStatus {
  id: string;
  integration_key: string;
  name: string;
  description: string;
  status: 'configured' | 'partially-configured' | 'not-configured';
  icon: string;
  config?: Record<string, any>;
  branch_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AttendanceSettings {
  id?: string;
  hikvision_enabled: boolean;
  qr_enabled: boolean;
  device_config: Record<string, any>;
  branch_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CompanySettings {
  id?: string;
  gym_name: string;
  contact_email: string;
  contact_phone: string;
  business_hours_start: string;
  business_hours_end: string;
  currency: string;
  currency_symbol: string;
  tax_rate: number;
  created_at?: string;
  updated_at?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  authorName: string;
  authorId?: string;
  createdAt: string;
  expiresAt?: string;
  channel?: string;
  branchId?: string;
  targetRoles?: string[];
  channels?: string[];
}

// Adapter function to convert database object to frontend model
export const adaptAnnouncementFromDB = (dbAnnouncement: any): Announcement => {
  return {
    id: dbAnnouncement.id,
    title: dbAnnouncement.title,
    content: dbAnnouncement.content,
    priority: dbAnnouncement.priority || 'medium',
    authorName: dbAnnouncement.author_name,
    authorId: dbAnnouncement.author_id,
    createdAt: dbAnnouncement.created_at,
    expiresAt: dbAnnouncement.expires_at,
    channel: dbAnnouncement.channel,
    branchId: dbAnnouncement.branch_id,
    targetRoles: dbAnnouncement.target_roles,
    channels: dbAnnouncement.channels
  };
};

// You should also add the other adapter functions that are being imported
export const adaptFeedbackFromDB = (dbFeedback: any): Feedback => {
  // Implementation
  return {} as Feedback; // Replace with actual implementation
};

export const adaptReminderRuleFromDB = (dbRule: any): ReminderRule => {
  // Implementation
  return {} as ReminderRule; // Replace with actual implementation
};

export const adaptMotivationalMessageFromDB = (dbMessage: any): MotivationalMessage => {
  // Implementation
  return {} as MotivationalMessage; // Replace with actual implementation
};

// You'll also need to define the Feedback and MotivationalMessage interfaces
export interface Feedback {
  // Define properties based on your application needs
  id: string;
  // Add other properties
}

export interface MotivationalMessage {
  // Define properties based on your application needs
  id: string;
  // Add other properties
}
