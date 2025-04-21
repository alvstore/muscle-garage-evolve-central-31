import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './use-auth';

export type Permission = 
  | 'dashboard_view'
  | 'members_view'
  | 'members_create'
  | 'members_edit'
  | 'members_delete'
  | 'trainers_view'
  | 'trainers_create'
  | 'trainers_edit'
  | 'trainers_delete'
  | 'staff_view'
  | 'staff_create'
  | 'staff_edit'
  | 'staff_delete'
  | 'classes_view'
  | 'classes_create'
  | 'classes_edit'
  | 'classes_delete'
  | 'memberships_view'
  | 'memberships_create'
  | 'memberships_edit'
  | 'memberships_delete'
  | 'fitness_plans_view'
  | 'fitness_plans_create'
  | 'fitness_plans_edit'
  | 'fitness_plans_delete'
  | 'attendance_view'
  | 'attendance_create'
  | 'attendance_edit'
  | 'attendance_delete'
  | 'branches_view'
  | 'branches_create'
  | 'branches_edit'
  | 'branches_delete'
  | 'announcements_view'
  | 'announcements_create'
  | 'announcements_edit'
  | 'announcements_delete'
  | 'tasks_view'
  | 'tasks_create'
  | 'tasks_edit'
  | 'tasks_delete'
  | 'feedback_view'
  | 'feedback_create'
  | 'feedback_edit'
  | 'feedback_delete'
  | 'leads_view'
  | 'leads_create'
  | 'leads_edit'
  | 'leads_delete'
  | 'funnel_view'
  | 'funnel_create'
  | 'funnel_edit'
  | 'funnel_delete'
  | 'follow_up_view'
  | 'follow_up_create'
  | 'follow_up_edit'
  | 'follow_up_delete'
  | 'promo_view'
  | 'promo_create'
  | 'promo_edit'
  | 'promo_delete'
  | 'referral_view'
  | 'referral_create'
  | 'referral_edit'
  | 'referral_delete'
  | 'store_view'
  | 'store_create'
  | 'store_edit'
  | 'store_delete'
  | 'invoices_view'
  | 'invoices_create'
  | 'invoices_edit'
  | 'invoices_delete'
  | 'transactions_view'
  | 'transactions_create'
  | 'transactions_edit'
  | 'transactions_delete'
  | 'income_view'
  | 'income_create'
  | 'income_edit'
  | 'income_delete'
  | 'expenses_view'
  | 'expenses_create'
  | 'expenses_edit'
  | 'expenses_delete'
  | 'finance_dashboard_view'
  | 'website_view'
  | 'website_create'
  | 'website_edit'
  | 'website_delete'
  | 'settings_view'
  | 'settings_edit'
  | 'integrations_view'
  | 'integrations_edit'
  | 'payment_gateways_view'
  | 'payment_gateways_edit'
  | 'analytics_view'
  | 'manage_members'
  | 'view_all_member_progress'
  | 'view_branch_data'
  | 'manage_branches'
  | 'manage_settings'
  | 'manage_roles'
  | 'manage_integrations'
  | 'manage_classes'
  | 'full_system_access'
  | 'log_attendance'
  | 'assign_plan'
  | 'assign_workout_plan'
  | 'assign_diet_plan'
  | 'register_member'
  | 'view_member_profiles'
  | 'edit_member_fitness_data'
  | 'switch_branches'
  | 'manage_staff'
  | 'view_staff'
  | 'manage_trainers'
  | 'view_trainers'
  | 'assign_trainers'
  | 'view_classes'
  | 'book_classes'
  | 'manage_finances'
  | 'view_finances'
  | 'process_payments'
  | 'access_dashboards'
  | 'access_reports'
  | 'access_inventory'
  | 'access_communication'
  | 'access_marketing';

interface PermissionsContextType {
  can: (permission: Permission) => boolean;
  userRole: string | undefined;
}

const PermissionsContext = createContext<PermissionsContextType>({
  can: () => false,
  userRole: undefined,
});

export const PermissionsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  
  const userRole = user?.role;
  
  const can = (permission: Permission): boolean => {
    if (!user) return false;
    
    // Super Admin has all permissions
    if (user.role === 'admin') return true;
    
    // Staff has most permissions but not all
    if (user.role === 'staff') {
      // Restrict staff from these specific permissions
      const restrictedForStaff = [
        'branches_create',
        'branches_edit',
        'branches_delete',
        'staff_create',
        'staff_edit',
        'staff_delete',
        'payment_gateways_edit',
        'settings_edit'
      ];
      
      return !restrictedForStaff.includes(permission);
    }
    
    // Trainer has specific permissions related to members and fitness
    if (user.role === 'trainer') {
      const trainerPermissions = [
        'dashboard_view',
        'members_view',
        'classes_view',
        'fitness_plans_view',
        'fitness_plans_create',
        'fitness_plans_edit',
        'attendance_view',
        'attendance_create',
        'tasks_view',
        'tasks_create',
        'tasks_edit',
        'tasks_delete',
        'feedback_view',
        'feedback_create'
      ];
      
      return trainerPermissions.includes(permission);
    }
    
    // Member has very limited permissions
    if (user.role === 'member') {
      const memberPermissions = [
        'dashboard_view',
        'classes_view',
        'feedback_create',
        'feedback_view',
      ];
      
      return memberPermissions.includes(permission);
    }
    
    return false;
  };
  
  return (
    <PermissionsContext.Provider value={{ can, userRole }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => useContext(PermissionsContext);
