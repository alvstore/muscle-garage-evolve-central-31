
import { UserRole } from '@/types';
import { Permission } from '../use-permissions';

// Define permissions for each role
export const rolePermissions: Record<string, Permission[]> = {
  admin: [
    'view_all_branches', 
    'manage_branches',
    'access_dashboards',
    'view_all_attendance',
    'manage_members',
    'member_view_plans',
    'view_classes',
    'trainer_view_classes',
    'view_staff',
    'view_all_trainers',
    'access_crm', 
    'access_marketing',
    'access_inventory',
    'access_store',
    'manage_fitness_data',
    'access_communication',
    'access_reports',
    'access_finance',
    'manage_invoices',
    'manage_transactions',
    'manage_income',
    'manage_expenses',
    'access_settings',
    'manage_settings',
    'manage_integrations',
    'manage_templates',
    'manage_devices',
    'view_branch_data',
    'manage_website',
    'assign_workout_plan',
    'assign_diet_plan',
    'log_attendance',
    'assign_plan',
    'manage_roles',
    'manage_staff',
    'trainer_view_members',
    'trainer_edit_fitness',
    'trainer_view_attendance',
    'feature_trainer_dashboard',
    'feature_email_campaigns',
    'full_system_access'
  ],
  staff: [
    'access_dashboards',
    'manage_members',
    'member_view_plans',
    'view_classes',
    'view_staff',
    'access_crm',
    'access_marketing',
    'access_inventory',
    'access_store',
    'manage_fitness_data',
    'access_communication',
    'access_reports',
    'access_finance',
    'manage_invoices',
    'manage_transactions',
    'manage_income',
    'manage_expenses',
    'view_branch_data',
    'log_attendance',
    'assign_plan'
  ],
  trainer: [
    'access_dashboards',
    'view_classes',
    'trainer_view_classes',
    'manage_fitness_data',
    'access_communication',
    'trainer_view_members',
    'trainer_edit_fitness',
    'trainer_view_attendance',
    'feature_trainer_dashboard',
    'assign_workout_plan',
    'assign_diet_plan'
  ],
  member: [
    'member_view_plans'
  ]
};

// Helper function to check if a user has a specific permission
export const hasPermission = (
  userRole: UserRole | null | undefined, 
  permission: Permission
): boolean => {
  if (!userRole) return false;
  
  // Admin has all permissions
  if (userRole === 'admin') return true;
  
  // Check if the user's role has the requested permission
  return (rolePermissions[userRole] || []).includes(permission);
};

// Helper function to check if a user is a system admin
export const isUserSystemAdmin = (userRole: UserRole | null | undefined): boolean => {
  return userRole === 'admin';
};

// Helper function to check if a user is a branch admin
export const isUserBranchAdmin = (
  userRole: UserRole | null | undefined,
  isBranchManager?: boolean
): boolean => {
  return userRole === 'staff' && isBranchManager === true;
};
