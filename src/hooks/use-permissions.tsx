
import { useAuth } from './use-auth';
import { hasPermission, hasRouteAccess } from '@/services/permissionService';
import { UserRole } from '@/types';
import { useBranch } from './use-branch';
import { User } from '@/types/user'; // Import the extended User type

// Define a union type for all possible permissions to provide proper type checking
export type Permission = 
  | "full_system_access"
  | "register_member"
  | "view_member_profiles"
  | "edit_member_fitness_data"
  | "assign_diet_plan"
  | "assign_workout_plan"
  | "create_class"
  | "book_class"
  | "cancel_class"
  | "assign_plan"
  | "purchase_plan"
  | "create_invoice"
  | "log_attendance"
  | "check_in"
  | "send_email_notification"
  | "access_dashboards"
  | "manage_branches"
  | "view_branch_data"
  | "switch_branches"
  | "access_own_resources"
  // New permissions for menu access
  | "view_all_users"
  | "view_all_trainers"
  | "view_all_classes"
  | "view_all_attendance"
  | "create_edit_plans"
  | "view_invoices"
  | "manage_integrations"
  | "access_analytics"
  | "manage_roles"
  | "manage_members"
  | "manage_fitness_data"
  | "manage_classes"
  | "manage_payments"
  | "access_communication"
  | "access_inventory"
  | "access_store"
  | "access_crm"
  | "access_marketing"
  | "trainer_view_members"
  | "trainer_edit_fitness"
  | "trainer_view_attendance"
  | "trainer_view_classes"
  | "member_view_profile"
  | "member_view_invoices"
  | "member_make_payments"
  | "member_view_plans"
  | "member_book_classes"
  | "member_view_attendance";

export const usePermissions = () => {
  const { user } = useAuth();
  const { currentBranch } = useBranch();
  const userRole = user?.role as UserRole | undefined;
  
  /**
   * Check if current user has a specific permission
   * @param permission Permission to check
   * @param isOwner Whether the user owns the resource (for member-specific permissions)
   * @returns Boolean indicating if user has permission
   */
  const can = (permission: Permission, isOwner = false): boolean => {
    return hasPermission(userRole, permission, isOwner, currentBranch?.id);
  };
  
  /**
   * Check if current user has access to a specific route
   * @param route Route to check
   * @returns Boolean indicating if user has access
   */
  const canAccess = (route: string): boolean => {
    return hasRouteAccess(userRole, route);
  };
  
  /**
   * Check if current user has one of the specified roles
   * @param roles Roles to check against
   * @returns Boolean indicating if user has one of the roles
   */
  const hasRole = (roles: UserRole[]): boolean => {
    if (!userRole) return false;
    return roles.includes(userRole);
  };
  
  /**
   * Check if current user is branch admin
   * @returns Boolean indicating if user is branch admin
   */
  const isBranchAdmin = (): boolean => {
    // Cast user to the extended User type from user.ts which includes isBranchManager
    const extendedUser = user as User | null;
    return userRole === 'admin' || (userRole === 'staff' && extendedUser?.isBranchManager === true);
  };
  
  return {
    can,
    canAccess,
    hasRole,
    isBranchAdmin,
    userRole,
  };
};
