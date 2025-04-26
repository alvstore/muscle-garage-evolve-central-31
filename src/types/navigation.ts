
import { ReactNode } from 'react';
import { UserRole } from './index';

export type Permission = 
  | 'view_dashboard' 
  | 'manage_members' 
  | 'manage_trainers'
  | 'manage_classes'
  | 'manage_memberships'
  | 'manage_finances'
  | 'manage_branch'
  | 'manage_settings'
  | 'view_branch_data'
  | 'manage_website'
  | 'manage_inventory'
  | 'feature_trainer_dashboard'
  | 'trainer_view_classes'
  | 'trainer_view_attendance'
  | 'trainer_view_members'
  | 'trainer_edit_fitness'
  | 'manage_staff'
  | 'feature_email_campaigns'
  | 'access_communication'
  | 'view_staff'
  | 'feature_member_dashboard'
  | 'member_view_profile'
  | 'member_book_classes'
  | 'member_view_attendance'
  | 'member_view_invoices'
  | 'member_view_plans'
  | 'access_store'
  | 'view_all_branches'
  | 'view_analytics'
  | 'view_reports'
  | 'view_finance_dashboard'
  | 'manage_invoices'
  | 'manage_transactions'
  | 'manage_income'
  | 'manage_expenses';

export interface NavItem {
  href: string;
  label: string;
  permission: Permission;
  icon?: ReactNode;
  badge?: string;
  children?: NavItem[];
}

export interface NavSection {
  name: string;
  items: NavItem[];
  icon?: ReactNode;
}
