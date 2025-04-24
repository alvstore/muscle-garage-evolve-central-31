
export type NotificationChannel = 'email' | 'sms' | 'whatsapp' | 'app' | 'push';

export type ReminderTriggerType = 
  'membership_expiry' | 
  'birthday' | 
  'class_reminder' | 
  'payment_due' | 
  'attendance_missed' |
  'membership_renewal' |
  'goal_achieved' |
  'follow_up';

export interface ReminderRule {
  id: string;
  title: string;
  description: string;
  triggerType: ReminderTriggerType;
  triggerValue?: number;
  notificationChannel: NotificationChannel; 
  conditions: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  message?: string;
  sendVia: string[];
  targetRoles: string[];
}

export interface BackupLogEntry {
  id: string;
  action: string; // 'export' | 'import'
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
