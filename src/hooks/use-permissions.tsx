
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';

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
  | 'manage_website';

interface PermissionsContextType {
  can: (permission: Permission) => boolean;
  isSystemAdmin: () => boolean;
  isBranchAdmin: () => boolean;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const PermissionsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
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
        'manage_website'
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
        'view_branch_data'
      ],
      trainer: [
        'access_dashboards',
        'view_classes',
        'trainer_view_classes',
        'manage_fitness_data',
        'access_communication'
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
    return user?.role === 'staff' && user?.isBranchManager === true;
  };
  
  return (
    <PermissionsContext.Provider value={{ can, isSystemAdmin, isBranchAdmin }}>
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
