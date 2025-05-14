
import { Branch } from './branch';
import { User, UserRole, Trainer, Staff, Admin } from './user';
import { Member } from './member';
import { Announcement, DashboardSummary } from './dashboard';
import { WorkoutPlan, WorkoutDay, Exercise } from './workout';

// Re-export types
export type { Branch, User, UserRole, Member, Trainer, Staff, Admin, Announcement, DashboardSummary };
export type { WorkoutPlan, WorkoutDay, Exercise };

// Add any other types needed from error messages
export interface Membership {
  id: string;
  plan_id: string;
  member_id: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired' | 'cancelled';
  payment_status: 'paid' | 'pending' | 'failed';
  created_at: string;
  updated_at: string;
}
