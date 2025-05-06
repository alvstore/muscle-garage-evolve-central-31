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
  'manage_members': { roles: ['admin', 'staff'] },
  'view_branch_data': { roles: ['admin', 'staff', 'trainer'] },
  'member_view_plans': { roles: ['admin', 'staff', 'trainer', 'member'] },
  
  // Branch Management
  'manage_branches': { roles: ['admin'] },
  'view_all_branches': { roles: ['admin'] },
  
  // Staff Management
  'manage_staff': { roles: ['admin'] },
  'view_staff': { roles: ['admin', 'staff'] },
  
  // Trainer Management
  'manage_roles': { roles: ['admin'] },
  'view_all_trainers': { roles: ['admin', 'staff'] },
  
  // Class Management
  'view_classes': { roles: ['admin', 'staff', 'trainer', 'member'] },
  'trainer_view_classes': { roles: ['admin', 'trainer'] },
  
  // Finance Management
  'manage_invoices': { roles: ['admin', 'staff'] },
  'manage_transactions': { roles: ['admin', 'staff'] },
  'manage_income': { roles: ['admin', 'staff'] },
  'manage_expenses': { roles: ['admin', 'staff'] },
  
  // Settings Management
  'manage_settings': { roles: ['admin'] },
  'manage_integrations': { roles: ['admin'] },
  'manage_templates': { roles: ['admin'] },
  'manage_devices': { roles: ['admin'] },
  
  // Feature Access
  'access_dashboards': { roles: ['admin', 'staff', 'trainer', 'member'] },
  'access_reports': { roles: ['admin', 'staff'] },
  'access_inventory': { roles: ['admin', 'staff'] },
  'access_communication': { roles: ['admin', 'staff', 'trainer'] },
  'access_marketing': { roles: ['admin', 'staff'] },
  'access_finance': { roles: ['admin', 'staff'] },
  'access_settings': { roles: ['admin'] },
  'access_crm': { roles: ['admin', 'staff'] },
  'access_store': { roles: ['admin', 'staff'] },
  
  // Fitness Plan Management
  'manage_fitness_data': { roles: ['admin', 'staff', 'trainer'] },
  'assign_workout_plan': { roles: ['admin', 'trainer'] },
  'assign_diet_plan': { roles: ['admin', 'trainer'] },
  
  // Attendance Management
  'view_all_attendance': { roles: ['admin', 'staff', 'trainer'] },
  'view_attendance': { roles: ['admin', 'staff', 'trainer'] },
  'log_attendance': { roles: ['admin', 'staff'] },
  
  // Assignment Management
  'assign_plan': { roles: ['admin', 'staff'] },
  
  // Website Management
  'manage_website': { roles: ['admin'] },
  
  // Trainer Specific
  'trainer_view_members': { roles: ['admin', 'trainer'] },
  'trainer_edit_fitness': { roles: ['admin', 'trainer'] },
  'trainer_view_attendance': { roles: ['admin', 'trainer'] },
  'feature_trainer_dashboard': { roles: ['admin', 'trainer'] },
  
  // Dashboard
  'view_dashboard': { roles: ['admin', 'staff', 'trainer', 'member'] },
  
  // Analytics
  'view_analytics': { roles: ['admin', 'staff'] },
  'view_reports': { roles: ['admin', 'staff'] },
  'view_finance_dashboard': { roles: ['admin', 'staff'] },
  
  // Manager
  'manage_branch': { roles: ['admin', 'staff'] },
  'manage_trainers': { roles: ['admin'] },
  'manage_memberships': { roles: ['admin', 'staff'] },
  
  // Marketing
  'manage_marketing': { roles: ['admin', 'staff'] },
  'manage_inventory': { roles: ['admin', 'staff'] },
  
  // Member dashboard
  'feature_member_dashboard': { roles: ['admin', 'member'] },
  'member_view_profile': { roles: ['admin', 'member'] },
  'member_book_classes': { roles: ['admin', 'member'] },
  'member_view_attendance': { roles: ['admin', 'member'] },
  'member_view_invoices': { roles: ['admin', 'member'] },
  
  // Email campaigns
  'feature_email_campaigns': { roles: ['admin', 'staff'] }
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
