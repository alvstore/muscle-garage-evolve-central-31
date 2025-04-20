
import { UserRole } from '@/types';
import { Permission } from '@/hooks/use-permissions';

// Define role hierarchy for permission inheritance
const roleHierarchy: Record<UserRole, UserRole[]> = {
  admin: ['admin', 'staff', 'trainer', 'member'],
  staff: ['staff', 'trainer', 'member'],
  trainer: ['trainer', 'member'],
  member: ['member']
};

// Define a permissions matrix according to requirements
const permissionsMatrix: Record<Permission, { roles: UserRole[], memberSelfOnly?: boolean }> = {
  // System Access
  'full_system_access': { roles: ['admin'] },
  
  // Member Management
  'register_member': { roles: ['admin', 'staff'] },
  'view_member_profiles': { roles: ['admin', 'staff', 'trainer', 'member'], memberSelfOnly: true },
  'edit_member_fitness_data': { roles: ['admin', 'staff', 'trainer'] },
  
  // Branch Management
  'manage_branches': { roles: ['admin'] },
  'view_branch_data': { roles: ['admin', 'staff', 'trainer'] },
  'switch_branches': { roles: ['admin', 'staff'] },
  
  // Staff Management
  'manage_staff': { roles: ['admin'] },
  'view_staff': { roles: ['admin', 'staff'] },
  
  // Trainer Management
  'manage_trainers': { roles: ['admin'] },
  'view_trainers': { roles: ['admin', 'staff', 'trainer'] },
  'assign_trainers': { roles: ['admin', 'staff'] },
  
  // Class Management
  'manage_classes': { roles: ['admin', 'staff'] },
  'view_classes': { roles: ['admin', 'staff', 'trainer', 'member'] },
  'book_classes': { roles: ['admin', 'staff', 'member'] },
  
  // Finance Management
  'manage_finances': { roles: ['admin'] },
  'view_finances': { roles: ['admin', 'staff'] },
  'process_payments': { roles: ['admin', 'staff'] },
  
  // Settings Management
  'manage_settings': { roles: ['admin'] },
  'manage_roles': { roles: ['admin'] },
  
  // Feature Access
  'access_dashboards': { roles: ['admin', 'staff', 'trainer', 'member'] },
  'access_reports': { roles: ['admin', 'staff'] },
  'access_inventory': { roles: ['admin', 'staff'] },
  'access_communication': { roles: ['admin', 'staff'] },
  'access_marketing': { roles: ['admin'] },
};

export const hasPermission = (
  role: UserRole | undefined,
  permission: Permission,
  isOwner = false
): boolean => {
  if (!role) return false;
  
  const permissionConfig = permissionsMatrix[permission];
  if (!permissionConfig) return false;
  
  // Check if role has permission through hierarchy
  const hasRolePermission = permissionConfig.roles.some(allowedRole => 
    roleHierarchy[role].includes(allowedRole)
  );
  
  // If no permission through role hierarchy
  if (!hasRolePermission) return false;
  
  // If permission requires ownership check
  if (permissionConfig.memberSelfOnly && role === 'member') {
    return isOwner;
  }
  
  return true;
};

export const hasRouteAccess = (role: UserRole | undefined, route: string): boolean => {
  if (!role) return false;
  
  // Admin has access to all routes
  if (role === 'admin') return true;
  
  const routePermissions: Record<string, UserRole[]> = {
    '/dashboard': ['admin', 'staff', 'trainer', 'member'],
    '/members': ['admin', 'staff', 'trainer'],
    '/trainers': ['admin', 'staff'],
    '/classes': ['admin', 'staff', 'trainer', 'member'],
    '/finances': ['admin', 'staff'],
    '/settings': ['admin'],
    '/profile': ['admin', 'staff', 'trainer', 'member'],
    '/branches': ['admin', 'staff'],
  };
  
  for (const [routePath, roles] of Object.entries(routePermissions)) {
    if (route.startsWith(routePath) && roles.includes(role)) {
      return true;
    }
  }
  
  return false;
};

// Helper functions for role-based access
export const isSystemAdmin = (role: UserRole): boolean => role === 'admin';
export const isBranchManager = (role: UserRole): boolean => ['admin', 'staff'].includes(role);
export const isTrainer = (role: UserRole): boolean => role === 'trainer';
export const isMember = (role: UserRole): boolean => role === 'member';

export default {
  hasPermission,
  hasRouteAccess,
  isSystemAdmin,
  isBranchManager,
  isTrainer,
  isMember
};
