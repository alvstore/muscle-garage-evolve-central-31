
import { UserRole } from '@/types';
import { Permission } from '@/hooks/use-permissions';

// Define a permissions matrix according to requirements
const permissionsMatrix: Record<Permission, UserRole[]> = {
  // System Access
  'full_system_access': ['admin'],
  
  // Member Management
  'register_member': ['admin', 'staff'],
  'view_member_profiles': ['admin', 'staff', 'trainer', 'member'], // Members can only view their own
  'edit_member_fitness_data': ['admin', 'staff', 'trainer'],
  
  // Fitness Plans
  'assign_diet_plan': ['admin', 'trainer'],
  'assign_workout_plan': ['admin', 'trainer'],
  
  // Classes
  'create_class': ['admin', 'staff'],
  'book_class': ['admin', 'staff', 'member'], // Members can only book for themselves
  'cancel_class': ['admin', 'staff', 'member'], // Members can only cancel their own
  
  // Memberships
  'assign_plan': ['admin', 'staff'],
  'purchase_plan': ['admin', 'staff', 'member'], // Members can only purchase for themselves
  
  // Finance
  'create_invoice': ['admin', 'staff'],
  
  // Attendance
  'log_attendance': ['admin', 'staff', 'trainer'],
  'check_in': ['admin', 'staff', 'trainer', 'member'], // Members can only check themselves in
  
  // Communications
  'send_email_notification': ['admin', 'staff'],
  
  // Resource access based on ownership
  'access_own_resources': ['admin', 'staff', 'trainer', 'member'],
};

/**
 * Check if a user has permission to perform an action
 * @param role The user's role
 * @param permission The permission to check
 * @param isOwner Optional flag for checking if user owns the resource
 * @returns Boolean indicating if user has permission
 */
export const hasPermission = (
  role: UserRole | undefined,
  permission: Permission,
  isOwner = false
): boolean => {
  if (!role) return false;
  
  // Admin has all permissions
  if (role === 'admin') return true;
  
  const allowedRoles = permissionsMatrix[permission];
  
  // If user role is in the allowed roles, they have permission
  if (allowedRoles.includes(role)) {
    // For member-specific permissions, check ownership if required
    if (role === 'member' && ['view_member_profiles', 'book_class', 'cancel_class', 'purchase_plan'].includes(permission)) {
      return isOwner;
    }
    return true;
  }
  
  return false;
};

/**
 * Check if user has access to a specific route based on their role
 * @param role The user's role
 * @param route The route path
 * @returns Boolean indicating if user has access
 */
export const hasRouteAccess = (role: UserRole | undefined, route: string): boolean => {
  if (!role) return false;
  
  // Admin has access to all routes
  if (role === 'admin') return true;
  
  // Define route access based on role
  const routeAccess: Record<string, UserRole[]> = {
    '/dashboard': ['admin', 'staff', 'trainer', 'member'],
    '/members': ['admin', 'staff', 'trainer'],
    '/trainers': ['admin', 'staff'],
    '/classes': ['admin', 'staff', 'trainer', 'member'],
    '/memberships': ['admin', 'staff', 'member'],
    '/attendance': ['admin', 'staff', 'trainer', 'member'],
    '/finance': ['admin', 'staff'],
    '/inventory': ['admin', 'staff'],
    '/store': ['admin', 'staff', 'member'],
    '/crm': ['admin', 'staff'],
    '/marketing': ['admin', 'staff'],
    '/communication': ['admin', 'staff'],
    '/settings': ['admin', 'staff', 'trainer', 'member'],
    '/profile': ['admin', 'staff', 'trainer', 'member'],
  };
  
  // Check specific route
  for (const [routePath, roles] of Object.entries(routeAccess)) {
    if (route.startsWith(routePath) && roles.includes(role)) {
      return true;
    }
  }
  
  return false;
};

export default {
  hasPermission,
  hasRouteAccess
};
