
import { UserRole } from '@/types';
import { Permission } from '@/hooks/use-permissions';

// Define a permissions matrix according to requirements
const permissionsMatrix: Record<Permission, { roles: UserRole[], memberSelfOnly?: boolean, trainerViewOnly?: boolean, checkInOnly?: boolean, basicStats?: boolean }> = {
  // System Access
  'full_system_access': { roles: ['admin'] },
  
  // Member Management
  'register_member': { roles: ['admin', 'staff'] },
  'view_member_profiles': { roles: ['admin', 'staff', 'trainer', 'member'], memberSelfOnly: true },
  'edit_member_fitness_data': { roles: ['admin', 'staff', 'trainer'] },
  
  // Fitness Plans
  'assign_diet_plan': { roles: ['admin', 'trainer'] },
  'assign_workout_plan': { roles: ['admin', 'trainer'] },
  
  // Classes
  'create_class': { roles: ['admin', 'staff'] },
  'book_class': { roles: ['admin', 'staff', 'member'], memberSelfOnly: true },
  'cancel_class': { roles: ['admin', 'staff', 'member'], memberSelfOnly: true },
  
  // Memberships
  'assign_plan': { roles: ['admin', 'staff'] },
  'purchase_plan': { roles: ['admin', 'staff', 'member'], memberSelfOnly: true },
  
  // Finance
  'create_invoice': { roles: ['admin', 'staff'] },
  
  // Attendance
  'log_attendance': { roles: ['admin', 'staff', 'trainer'] },
  'check_in': { roles: ['admin', 'staff', 'trainer', 'member'], checkInOnly: true },
  
  // Communications
  'send_email_notification': { roles: ['admin', 'staff'] },
  
  // Dashboards
  'access_dashboards': { roles: ['admin', 'staff', 'trainer', 'member'], trainerViewOnly: true, basicStats: true },
  
  // Branch Management
  'manage_branches': { roles: ['admin'] },
  'view_branch_data': { roles: ['admin', 'staff', 'trainer'] },
  'switch_branches': { roles: ['admin', 'staff', 'trainer'] },
  
  // Resource access based on ownership
  'access_own_resources': { roles: ['admin', 'staff', 'trainer', 'member'] },
};

/**
 * Check if a user has permission to perform an action
 * @param role The user's role
 * @param permission The permission to check
 * @param isOwner Optional flag for checking if user owns the resource
 * @param branchId Optional branch ID for branch-specific permissions
 * @returns Boolean indicating if user has permission
 */
export const hasPermission = (
  role: UserRole | undefined,
  permission: Permission,
  isOwner = false,
  branchId?: string
): boolean => {
  if (!role) return false;
  
  // Admin has all permissions
  if (role === 'admin') return true;
  
  const permissionConfig = permissionsMatrix[permission];
  
  if (!permissionConfig) return false;
  
  // Check if role is allowed
  if (permissionConfig.roles.includes(role)) {
    // Member permissions with self-only restriction
    if (role === 'member' && permissionConfig.memberSelfOnly) {
      return isOwner;
    }
    
    // Trainer permissions with view-only restriction
    if (role === 'trainer' && permissionConfig.trainerViewOnly) {
      // Allow limited dashboard access for trainers
      return true;
    }
    
    // Member permissions with check-in only restriction
    if (role === 'member' && permissionConfig.checkInOnly) {
      // Only allow members to check themselves in
      return isOwner;
    }
    
    // Member permissions with basic stats restriction
    if (role === 'member' && permissionConfig.basicStats) {
      // Allow limited dashboard access for members
      return true;
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
    '/branches': ['admin', 'staff', 'trainer'],
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
