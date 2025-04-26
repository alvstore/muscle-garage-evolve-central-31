
import { useAuth } from './use-auth';
import { usePermissionsManager } from './permissions/use-permissions-manager';
import { UserRole } from '@/types';

export type Permission = 
  | 'access_dashboards'
  | 'view_all_branches' 
  | 'manage_branches'
  | 'view_branch_data'
  | 'view_all_attendance'
  | 'manage_members'
  | 'member_view_plans'
  | 'view_classes'
  | 'view_staff'
  | 'view_all_trainers'
  | 'trainer_view_classes'
  | 'trainer_view_members'
  | 'trainer_edit_fitness'
  | 'trainer_view_attendance'
  | 'access_crm' 
  | 'access_marketing'
  | 'access_inventory'
  | 'access_store'
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
  | 'manage_website'
  | 'manage_fitness_data'
  | 'assign_workout_plan'
  | 'assign_diet_plan'
  | 'log_attendance'
  | 'assign_plan'
  | 'manage_roles'
  | 'manage_staff'
  | 'feature_trainer_dashboard'
  | 'feature_email_campaigns'
  | 'full_system_access';

export const usePermissions = () => {
  const { user } = useAuth();
  const { can, isSystemAdmin, isBranchAdmin, userRole } = usePermissionsManager();

  const hasPermission = (permission: Permission): boolean => {
    return can(permission);
  };

  const isAdmin = (): boolean => {
    return user?.role === 'admin';
  };

  const isStaff = (): boolean => {
    return user?.role === 'staff';
  };

  const isTrainer = (): boolean => {
    return user?.role === 'trainer';
  };

  const isMember = (): boolean => {
    return user?.role === 'member';
  };

  const canManageBranches = (): boolean => {
    return hasPermission('manage_branches');
  };

  const canViewAllBranches = (): boolean => {
    return hasPermission('view_all_branches');
  };

  const canManageMembers = (): boolean => {
    return hasPermission('manage_members');
  };

  const canAccessSettings = (): boolean => {
    return hasPermission('access_settings');
  };

  const canAccessFinanceSection = (): boolean => {
    return hasPermission('access_finance');
  };

  return {
    user,
    can: hasPermission,
    isAdmin,
    isStaff,
    isTrainer,
    isMember,
    isSuperAdmin: isSystemAdmin,
    isBranchManager: isBranchAdmin,
    canManageBranches,
    canViewAllBranches,
    canManageMembers,
    canAccessSettings,
    canAccessFinanceSection,
    userRole,  // Expose userRole directly
  };
};

// Re-export the provider from the permissions manager
export { PermissionsProvider } from './permissions/use-permissions-manager';

export default usePermissions;
