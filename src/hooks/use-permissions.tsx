
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { UserRole } from '@/types';
import { User } from '@/types/user';

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

interface PermissionsContextType {
  can: (permission: Permission) => boolean;
  isSystemAdmin: () => boolean;
  isBranchAdmin: () => boolean;
  userRole: UserRole | null;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const PermissionsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  
  useEffect(() => {
    if (user) {
      setUserRole(user.role as UserRole);
    } else {
      setUserRole(null);
    }
  }, [user]);
  
  // Check if the user has a specific permission
  const can = (permission: Permission): boolean => {
    if (!user) return false;
    
    // Admin has all permissions
    if (user.role === 'admin') return true;
    
    // Define permissions for each role
    const rolePermissions: Record<string, Permission[]> = {
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
    
    // Check if the user's role has the requested permission
    return (rolePermissions[user.role] || []).includes(permission);
  };
  
  // Check if user is a system admin (full access)
  const isSystemAdmin = (): boolean => {
    return user?.role === 'admin';
  };
  
  // Check if user is a branch admin
  const isBranchAdmin = (): boolean => {
    // Use optional chaining to safely check for isBranchManager property
    return user?.role === 'staff' && (user as any)?.isBranchManager === true;
  };
  
  return (
    <PermissionsContext.Provider value={{ can, isSystemAdmin, isBranchAdmin, userRole }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = (): PermissionsContextType => {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};
