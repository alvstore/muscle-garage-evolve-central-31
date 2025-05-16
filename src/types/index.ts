
// Re-export all types for easy importing
import { Branch } from './branch';
import { User, UserRole } from './user';
import { Member, Membership } from './member';
import { DashboardSummary, ActivityItem, Payment, RenewalItem, Announcement as DashboardAnnouncement } from './dashboard';
import { WorkoutPlan, WorkoutDay, Exercise } from './workout';
import { DietPlan, MealPlan, ProgressMetrics } from './fitness';
import { Invoice, InvoiceItem, InvoiceStatus, Transaction, PaymentMethod, PaymentStatus, TransactionType, RecurringPeriod, FinancialTransaction } from './finance';
import { 
  Notification, 
  Feedback, 
  FeedbackType, 
  MotivationalMessage, 
  MotivationalCategory, 
  ReminderRule, 
  NotificationChannel,
  Announcement,
  EmailSettings,
  BackupLogEntry,
  IntegrationStatus,
  AttendanceSettings,
  CompanySettings,
  adaptAnnouncementFromDB,
  adaptReminderRuleFromDB,
  adaptMotivationalMessageFromDB,
  adaptFeedbackFromDB
} from './notification';

// Re-export types
export type { 
  Branch, User, UserRole, Member, Membership, 
  DashboardSummary, ActivityItem, Payment, RenewalItem, DashboardAnnouncement,
  WorkoutPlan, WorkoutDay, Exercise,
  DietPlan, MealPlan, ProgressMetrics,
  Invoice, InvoiceItem, InvoiceStatus, Transaction, PaymentMethod, PaymentStatus,
  TransactionType, RecurringPeriod, FinancialTransaction,
  Notification, Feedback, FeedbackType, MotivationalMessage, MotivationalCategory, 
  ReminderRule, NotificationChannel, BackupLogEntry, Announcement, EmailSettings,
  IntegrationStatus, AttendanceSettings, CompanySettings
};

// Re-export adapter functions
export {
  adaptAnnouncementFromDB,
  adaptReminderRuleFromDB,
  adaptMotivationalMessageFromDB,
  adaptFeedbackFromDB
};

// Define additional types needed
export interface Trainer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  specialty?: string;
  rating?: number;
  bio?: string;
  avatar?: string;
  status?: string;
}

export interface Staff {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  department?: string;
  avatar?: string;
  status?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  gender?: string;
  id_type?: string;
  id_number?: string;
  is_branch_manager?: boolean;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface StaffMember extends Staff {
  full_name?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  id_type?: string;
  id_number?: string;
  gender?: string;
  is_branch_manager?: boolean;
}

// Add any other types needed
export interface Class {
  id: string;
  name: string;
  description?: string;
  type?: string;
  trainer_id?: string;
  trainer?: string;
  capacity: number;
  enrolled?: number;
  start_time: string;
  end_time: string;
  location?: string;
  recurring?: boolean;
  recurring_pattern?: string;
  branch_id?: string;
  status?: 'scheduled' | 'cancelled' | 'completed';
  is_active?: boolean;
  level?: string;
  difficulty?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration_days: number;
  features?: any[];
  benefits?: any[];
  is_active?: boolean;
  status?: string;
  // For backward compatibility
  durationDays?: number;
  isActive?: boolean;
}

export interface FileOptions {
  onUploadProgress?: (progressEvent: any) => void;
}

export interface HikvisionSettings {
  id: string;
  app_key: string;
  app_secret: string;
  api_url: string;
  branch_id: string;
  is_active: boolean;
  devices: any[];
  created_at: string;
  updated_at: string;
}

export interface HikvisionCredentials {
  app_key: string;
  app_secret: string;
  api_url: string;
  is_active: boolean;
}
