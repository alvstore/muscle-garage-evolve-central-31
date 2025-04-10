
import { useAuth } from './use-auth';
import { hasPermission, hasRouteAccess } from '@/services/permissionService';
import { UserRole } from '@/types';

export const usePermissions = () => {
  const { user } = useAuth();
  const userRole = user?.role as UserRole | undefined;
  
  /**
   * Check if current user has a specific permission
   * @param permission Permission to check
   * @param isOwner Whether the user owns the resource (for member-specific permissions)
   * @returns Boolean indicating if user has permission
   */
  const can = (permission: Parameters<typeof hasPermission>[1], isOwner = false): boolean => {
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
