
import { useAuth } from '@/hooks/use-auth';
import { useCallback } from 'react';

export type Permission =
  // Dashboard
  | 'access_dashboards'
  | 'manage_settings'
  | 'view_analytics'
  | 'view_dashboard'
  
  // Member management
  | 'view_members'
  | 'create_members'
  | 'edit_members'
  | 'delete_members'
  | 'manage_members'
  | 'member_view_plans'
  | 'member_view_profile'
  | 'member_book_classes'
  | 'member_view_attendance'
  | 'member_view_invoices'
  
  // Staff management
  | 'view_staff'
  | 'create_staff'
  | 'edit_staff'
  | 'delete_staff'
  | 'manage_staff'
  
  // Trainer management
  | 'view_all_trainers'
  | 'view_trainers'
  | 'create_trainers'
  | 'edit_trainers'
  | 'delete_trainers'
  | 'manage_trainers'
  
  // Class management
  | 'view_classes'
  | 'create_classes'
  | 'edit_classes'
  | 'delete_classes'
  | 'manage_classes'
  | 'view_memberships'
  | 'manage_memberships'
  
  // Branch management
  | 'view_branch_data'
  | 'manage_branch_settings'
  | 'create_branches'
  | 'edit_branches'
  | 'delete_branches'
  | 'view_all_branches'
  | 'manage_branches'
  
  // Finance
  | 'view_finance_dashboard'
  | 'manage_invoices'
  | 'manage_transactions'
  | 'manage_income'
  | 'manage_expenses'
  | 'access_finance'

  // Settings
  | 'access_settings'
  | 'manage_integrations'
  | 'manage_templates'
  | 'manage_devices'
  | 'manage_website'
  | 'manage_roles'
  
  // CRM & Marketing
  | 'access_crm'
  | 'manage_marketing'
  | 'access_marketing'
  
  // Inventory & Shop
  | 'manage_inventory'
  | 'access_inventory'
  | 'access_store'
  
  // Fitness
  | 'manage_fitness_data'
  | 'trainer_edit_fitness'
  | 'trainer_view_members'
  | 'trainer_view_classes'
  | 'trainer_view_attendance'
  | 'assign_workout_plan'
  | 'assign_diet_plan'
  
  // Communication
  | 'access_communication'
  | 'access_reports'
  
  // Attendance
  | 'view_attendance'
  | 'view_all_attendance'
  | 'log_attendance'
  
  // Plan Assignment
  | 'assign_plan'
  
  // Features
  | 'feature_trainer_dashboard'
  | 'feature_member_dashboard'
  | 'feature_email_campaigns'
  | 'full_system_access';

export const usePermissions = () => {
  const { user, userRole } = useAuth();
  
  const hasPermission = useCallback((permission: Permission): boolean => {
    const effectiveRole = userRole || user?.role;
    
    if (!user || !effectiveRole) return false;
    
    // Admin has all permissions
    if (effectiveRole === 'admin') return true;
    
    // Permission matrix based on user role
    const permissionMatrix: Record<string, Permission[]> = {
      staff: [
        'view_members', 'create_members', 'edit_members',
        'view_trainers', 'view_all_trainers',
        'view_classes', 'create_classes', 'edit_classes',
        'manage_memberships', 'view_memberships',
        'view_dashboard', 'access_dashboards',
        'view_finance_dashboard', 'access_finance',
        'manage_invoices', 'manage_transactions', 'manage_income', 'manage_expenses',
        'access_crm', 'manage_marketing', 'access_marketing',
        'access_inventory', 'access_store', 'manage_inventory',
        'manage_fitness_data',
        'access_communication',
        'view_branch_data',
        'access_reports',
        'log_attendance',
        'assign_plan'
      ],
      trainer: [
        'view_members', 'trainer_view_members',
        'view_classes', 'trainer_view_classes',
        'access_dashboards',
        'view_dashboard',
        'access_communication',
        'feature_trainer_dashboard',
        'trainer_edit_fitness',
        'trainer_view_attendance',
        'assign_workout_plan',
        'assign_diet_plan'
      ],
      member: [
        'view_classes',
        'feature_member_dashboard',
        'access_dashboards',
        'view_dashboard',
        'member_view_plans',
        'member_view_profile',
        'member_book_classes',
        'member_view_attendance',
        'member_view_invoices'
      ],
    };
    
    return permissionMatrix[effectiveRole]?.includes(permission) || false;
  }, [user, userRole]);
  
  // Alias for hasPermission for compatibility
  const can = useCallback((permission: Permission): boolean => {
    return hasPermission(permission);
  }, [hasPermission]);
  
  const isSuperAdmin = useCallback(() => {
    return userRole === 'admin' && user?.email === 'admin@example.com';
  }, [userRole, user?.email]);
  
  const isSystemAdmin = useCallback(() => {
    return userRole === 'admin';
  }, [userRole]);

  return {
    hasPermission,
    can,
    userRole: userRole || user?.role,
    getPermissions: () => [] as Permission[],
    isSuperAdmin,
    isSystemAdmin
  };
};
