
// Re-export all types for easy importing
import { Branch } from './branch';
import { User, UserRole } from './user';
import { Member, Membership } from './member';
import { DashboardSummary, ActivityItem, Payment, RenewalItem, Announcement } from './dashboard';
import { WorkoutPlan, WorkoutDay, Exercise } from './workout';
import { DietPlan, MealPlan, ProgressMetrics } from './fitness';
import { Invoice, InvoiceItem, InvoiceStatus, Transaction, PaymentMethod, PaymentStatus } from './finance';
import { Notification, Feedback, FeedbackType, MotivationalMessage, MotivationalCategory, ReminderRule, NotificationChannel } from './notification';
import { BackupLogEntry } from './backup';

// Re-export types
export type { 
  Branch, User, UserRole, Member, Membership, 
  DashboardSummary, ActivityItem, Payment, RenewalItem, Announcement,
  WorkoutPlan, WorkoutDay, Exercise,
  DietPlan, MealPlan, ProgressMetrics,
  Invoice, InvoiceItem, InvoiceStatus, Transaction, PaymentMethod, PaymentStatus,
  Notification, Feedback, FeedbackType, MotivationalMessage, MotivationalCategory, ReminderRule, NotificationChannel,
  BackupLogEntry
};

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
