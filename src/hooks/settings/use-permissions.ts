
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/auth/use-auth';

export type Permission = 
  | 'view:members' 
  | 'create:members' 
  | 'edit:members' 
  | 'delete:members'
  | 'view:trainers' 
  | 'create:trainers' 
  | 'edit:trainers' 
  | 'delete:trainers'
  | 'view:staff' 
  | 'create:staff' 
  | 'edit:staff' 
  | 'delete:staff'
  | 'view:classes' 
  | 'create:classes' 
  | 'edit:classes' 
  | 'delete:classes'
  | 'view:memberships' 
  | 'create:memberships' 
  | 'edit:memberships' 
  | 'delete:memberships'
  | 'view:reports'
  | 'view:dashboard'
  | 'view:settings'
  | 'edit:settings'
  | 'view:finances'
  | 'create:finances'
  | 'view:branches'
  | 'create:branches'
  | 'edit:branches'
  | 'export_data'
  // Add Hikvision permission types from the CustomInstructions
  | 'full_system_access'
  | 'manage_members'
  | 'member_view_plans'
  | 'manage_branches'
  | 'view_all_branches'
  | 'manage_staff'
  | 'view_staff'
  | 'manage_roles'
  | 'view_all_trainers'
  | 'view_classes'
  | 'trainer_view_classes'
  | 'manage_classes'
  | 'manage_invoices'
  | 'manage_transactions'
  | 'manage_income'
  | 'manage_expenses'
  | 'manage_settings'
  | 'manage_integrations'
  | 'manage_templates'
  | 'manage_devices'
  | 'view_branch_data'
  | 'access_dashboards'
  | 'access_reports'
  | 'access_inventory'
  | 'access_communication'
  | 'access_marketing'
  | 'access_finance'
  | 'access_settings'
  | 'access_crm'
  | 'access_store'
  | 'manage_fitness_data'
  | 'assign_workout_plan'
  | 'assign_diet_plan'
  | 'view_all_attendance'
  | 'view_attendance'
  | 'log_attendance'
  | 'assign_plan'
  | 'manage_website'
  | 'trainer_view_members'
  | 'trainer_edit_fitness'
  | 'trainer_view_attendance'
  | 'feature_trainer_dashboard'
  | 'feature_email_campaigns'
  | 'view_dashboard'
  | 'view_analytics'
  | 'view_reports'
  | 'view_finance_dashboard'
  | 'manage_branch'
  | 'manage_trainers'
  | 'manage_memberships'
  | 'manage_marketing'
  | 'manage_inventory'
  | 'feature_member_dashboard'
  | 'member_view_profile'
  | 'member_book_classes'
  | 'member_view_attendance'
  | 'member_view_invoices';

export interface UsePermissionsReturn {
  userRole: string;
  canManageUsers: boolean;
  canManagePayments: boolean;
  canViewReports: boolean;
  canManageSettings: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  isTrainer: boolean;
  isMember: boolean;
  can: (permission: Permission) => boolean;
  isSuperAdmin: () => boolean;
  isSystemAdmin: () => boolean;
}

export const usePermissions = (): UsePermissionsReturn => {
  const [userRole, setUserRole] = useState('admin');
  
  // This will be expanded with actual permissions logic later
  const isAdmin = userRole === 'admin';
  const isStaff = userRole === 'staff' || isAdmin;
  const isTrainer = userRole === 'trainer' || isStaff;
  const isMember = userRole === 'member';
  
  const can = useCallback((permission: Permission): boolean => {
    // Implement basic permission check
    if (isAdmin) return true;
    
    // Simple permission matrix based on role
    const staffPermissions: Permission[] = [
      'view:members', 'create:members', 'edit:members',
      'view:trainers', 'view:classes', 'create:classes', 'edit:classes',
      'view:memberships', 'create:memberships', 'edit:memberships',
      'view:dashboard', 'view:finances', 'create:finances',
      'manage_members', 'log_attendance', 'assign_plan'
    ];
    
    const trainerPermissions: Permission[] = [
      'view:members', 'view:classes', 
      'assign_workout_plan', 'assign_diet_plan',
      'trainer_view_members', 'trainer_edit_fitness'
    ];
    
    const memberPermissions: Permission[] = [
      'view:classes', 'member_view_plans'
    ];
    
    if (isStaff && staffPermissions.includes(permission)) return true;
    if (isTrainer && trainerPermissions.includes(permission)) return true;
    if (isMember && memberPermissions.includes(permission)) return true;
    
    return false;
  }, [isAdmin, isStaff, isTrainer, isMember]);
  
  const isSuperAdmin = useCallback(() => {
    return isAdmin;
  }, [isAdmin]);
  
  const isSystemAdmin = useCallback(() => {
    return isAdmin;
  }, [isAdmin]);
  
  return {
    userRole,
    canManageUsers: isAdmin || isStaff,
    canManagePayments: isAdmin || isStaff,
    canViewReports: isAdmin || isStaff,
    canManageSettings: isAdmin,
    isAdmin,
    isStaff,
    isTrainer,
    isMember,
    can,
    isSuperAdmin,
    isSystemAdmin
  };
};

export default usePermissions;
