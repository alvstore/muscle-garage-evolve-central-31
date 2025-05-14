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

export interface User {
  id: string;
  full_name?: string;
  email?: string;
  role?: string;
  branch_id?: string;
  accessible_branch_ids?: string[];
  is_branch_manager?: boolean;
  avatar_url?: string;
  avatar?: string;
  department?: string;
  phone?: string;
}

export interface Member {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  gender?: string;
  date_of_birth?: string;
  branch_id?: string;
  trainer_id?: string;
  user_id?: string;
  status?: string;
  membership_status?: string;
  membership_id?: string;
  membership_start_date?: string;
  membership_end_date?: string;
  goal?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  blood_group?: string;
  occupation?: string;
  id_type?: string;
  id_number?: string;
  profile_picture?: string;
  created_at?: string;
  updated_at?: string;
}
