
import { createContext, useContext, ReactNode } from 'react';
import { UserRole } from '@/types';
import { PermissionsProvider, usePermissionsManager } from './permissions/use-permissions-manager';

export type Permission = 
  | 'view_all_branches'
  | 'manage_branches'
  | 'access_dashboards'
  | 'view_all_attendance'
  | 'manage_members'
  | 'member_view_plans'
  | 'view_classes'
  | 'trainer_view_classes'
  | 'view_staff'
  | 'view_all_trainers'
  | 'access_crm'
  | 'access_marketing'
  | 'access_inventory'
  | 'access_store'
  | 'manage_fitness_data'
  | 'access_communication'
  | 'access_reports'
  | 'access_finance'
  | 'manage_invoices'
  | 'manage_transactions'
  | 'manage_income'
  | 'manage_expenses'
  | 'access_settings'
  | 'manage_settings'
  | 'manage_integrations'
  | 'manage_templates'
  | 'manage_devices'
  | 'view_branch_data'
  | 'manage_website'
  | 'assign_workout_plan'
  | 'assign_diet_plan'
  | 'log_attendance'
  | 'assign_plan'
  | 'manage_roles'
  | 'manage_staff'
  | 'trainer_view_members'
  | 'trainer_edit_fitness'
  | 'trainer_view_attendance'
  | 'feature_trainer_dashboard'
  | 'feature_email_campaigns'
  | 'full_system_access';

export interface PermissionsContextType {
  can: (permission: Permission) => boolean;
  isSystemAdmin: () => boolean;
  isBranchAdmin: () => boolean;
  userRole: UserRole | null;
}

// Re-export the provider
export { PermissionsProvider };

// Main hook to use permissions anywhere in the app
export const usePermissions = (): PermissionsContextType => {
  return usePermissionsManager();
};
