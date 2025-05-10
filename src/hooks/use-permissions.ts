
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
  
  // CRM & Marketing
  | 'access_crm'
  | 'manage_marketing'
  
  // Inventory & Shop
  | 'manage_inventory'
  | 'access_inventory'
  | 'access_store'
  
  // Fitness
  | 'manage_fitness_data'
  | 'trainer_edit_fitness'
  | 'trainer_view_members'
  | 'assign_workout_plan'
  | 'assign_diet_plan'
  
  // Communication
  | 'access_communication'
  
  // Membership
  | 'manage_memberships'
  
  // Features
  | 'feature_trainer_dashboard'
  | 'feature_member_dashboard'
  | 'feature_email_campaigns';

export const usePermissions = () => {
  const { user, role, userRole } = useAuth();
  
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
        'view_memberships', 'manage_memberships',
        'view_dashboard', 'access_dashboards',
        'view_finance_dashboard', 'access_finance',
        'manage_invoices', 'manage_transactions', 'manage_income', 'manage_expenses',
        'access_crm', 'manage_marketing',
        'access_inventory', 'access_store', 'manage_inventory',
        'manage_fitness_data',
        'access_communication',
        'view_branch_data'
      ],
      trainer: [
        'view_members', 'trainer_view_members',
        'view_classes', 'access_dashboards',
        'view_dashboard',
        'access_communication',
        'feature_trainer_dashboard',
        'trainer_edit_fitness',
        'assign_workout_plan',
        'assign_diet_plan'
      ],
      member: [
        'view_classes',
        'feature_member_dashboard',
        'access_dashboards',
        'view_dashboard'
      ],
    };
    
    return permissionMatrix[effectiveRole]?.includes(permission) || false;
  }, [user, userRole, role]);
  
  // Alias for hasPermission for compatibility
  const can = useCallback((permission: Permission): boolean => {
    return hasPermission(permission);
  }, [hasPermission]);

  return {
    hasPermission,
    can,
    userRole: userRole || user?.role,
    getPermissions: () => [] as Permission[] // Keeping for backward compatibility
  };
};
