
import { useAuth } from './use-auth';
import { hasPermission, hasRouteAccess } from '@/services/permissionService';
import { UserRole } from '@/types';

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
  | "access_own_resources";

export const usePermissions = () => {
  const { user } = useAuth();
  const userRole = user?.role as UserRole | undefined;
  
  /**
   * Check if current user has a specific permission
   * @param permission Permission to check
   * @param isOwner Whether the user owns the resource (for member-specific permissions)
   * @returns Boolean indicating if user has permission
   */
  const can = (permission: Permission, isOwner = false): boolean => {
    return hasPermission(userRole, permission, isOwner);
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
  
  return {
    can,
    canAccess,
    hasRole,
    userRole,
  };
};
