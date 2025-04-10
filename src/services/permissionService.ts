
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
  
  // Menu Access Permissions
  'view_all_users': { roles: ['admin'] },
  'view_all_trainers': { roles: ['admin'] },
  'view_all_classes': { roles: ['admin', 'staff', 'trainer'] },
  'view_all_attendance': { roles: ['admin', 'staff'] },
  'create_edit_plans': { roles: ['admin'] },
  'view_invoices': { roles: ['admin', 'staff', 'member'], memberSelfOnly: true },
  'manage_integrations': { roles: ['admin'] },
  'access_analytics': { roles: ['admin'] },
  'manage_roles': { roles: ['admin'] },
  'manage_members': { roles: ['admin', 'staff'] },
  'manage_fitness_data': { roles: ['admin', 'staff', 'trainer'] },
  'manage_classes': { roles: ['admin', 'staff'] },
  'manage_payments': { roles: ['admin', 'staff'] },
  'access_communication': { roles: ['admin', 'staff'] },
  'access_inventory': { roles: ['admin', 'staff'] },
  'access_store': { roles: ['admin', 'staff', 'member'] },
  'access_crm': { roles: ['admin', 'staff'] },
  'access_marketing': { roles: ['admin', 'staff'] },
  
  // Trainer-specific permissions
  'trainer_view_members': { roles: ['admin', 'trainer'] },
  'trainer_edit_fitness': { roles: ['admin', 'trainer'] },
  'trainer_view_attendance': { roles: ['admin', 'trainer'] },
  'trainer_view_classes': { roles: ['admin', 'staff', 'trainer'] },
  
  // Member-specific permissions
  'member_view_profile': { roles: ['admin', 'staff', 'trainer', 'member'], memberSelfOnly: true },
  'member_view_invoices': { roles: ['admin', 'staff', 'member'], memberSelfOnly: true },
  'member_make_payments': { roles: ['admin', 'staff', 'member'], memberSelfOnly: true },
  'member_view_plans': { roles: ['admin', 'staff', 'trainer', 'member'], memberSelfOnly: true },
  'member_book_classes': { roles: ['admin', 'staff', 'member'], memberSelfOnly: true },
  'member_view_attendance': { roles: ['admin', 'staff', 'trainer', 'member'], memberSelfOnly: true },
  
  // Enhanced role-specific feature permissions
  'feature_trainer_dashboard': { roles: ['admin', 'trainer'] },
  'feature_staff_dashboard': { roles: ['admin', 'staff'] },
  'feature_member_dashboard': { roles: ['admin', 'staff', 'trainer', 'member'], memberSelfOnly: true },
  'feature_admin_dashboard': { roles: ['admin'] },
  'feature_pos_system': { roles: ['admin', 'staff'] },
  'feature_reporting': { roles: ['admin', 'staff'] },
  'feature_inventory_management': { roles: ['admin', 'staff'] },
  'feature_class_scheduling': { roles: ['admin', 'staff'] },
  'feature_attendance_tracking': { roles: ['admin', 'staff', 'trainer'] },
  'feature_membership_management': { roles: ['admin', 'staff'] },
  'feature_payment_processing': { roles: ['admin', 'staff'] },
  'feature_email_campaigns': { roles: ['admin'] },
  'feature_sms_campaigns': { roles: ['admin'] },
  'feature_whatsapp_campaigns': { roles: ['admin'] },
  'feature_social_media_integration': { roles: ['admin'] },
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
    '/settings': ['admin'],
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

/**
 * Get a list of all permissions for a given role
 * @param role The user's role
 * @returns Array of permission names the role has access to
 */
export const getPermissionsForRole = (role: UserRole): Permission[] => {
  if (!role) return [];
  
  // Admin has all permissions
  if (role === 'admin') {
    return Object.keys(permissionsMatrix) as Permission[];
  }
  
  // For other roles, check the matrix
  return Object.entries(permissionsMatrix)
    .filter(([_, config]) => config.roles.includes(role))
    .map(([permission]) => permission as Permission);
};

/**
 * Get grouped permissions by module
 * @returns Object with permissions grouped by module
 */
export const getGroupedPermissions = () => {
  const groupedPermissions: Record<string, { name: string, description: string }[]> = {
    'members': [],
    'trainers': [],
    'classes': [],
    'finance': [],
    'communication': [],
    'system': [],
    'features': []
  };
  
  // Map permissions to their respective groups
  Object.entries(permissionsMatrix).forEach(([permName, _]) => {
    const permission = permName as Permission;
    
    if (permission.startsWith('member_')) {
      groupedPermissions['members'].push({
        name: permission,
        description: getPermissionDescription(permission)
      });
    } else if (permission.startsWith('trainer_')) {
      groupedPermissions['trainers'].push({
        name: permission,
        description: getPermissionDescription(permission)
      });
    } else if (permission.includes('class')) {
      groupedPermissions['classes'].push({
        name: permission,
        description: getPermissionDescription(permission)
      });
    } else if (permission.includes('invoice') || permission.includes('payment')) {
      groupedPermissions['finance'].push({
        name: permission,
        description: getPermissionDescription(permission)
      });
    } else if (permission.includes('email') || permission.includes('sms') || permission.includes('notification')) {
      groupedPermissions['communication'].push({
        name: permission,
        description: getPermissionDescription(permission)
      });
    } else if (permission.startsWith('feature_')) {
      groupedPermissions['features'].push({
        name: permission,
        description: getPermissionDescription(permission)
      });
    } else {
      groupedPermissions['system'].push({
        name: permission,
        description: getPermissionDescription(permission)
      });
    }
  });
  
  return groupedPermissions;
};

/**
 * Get a human-readable description for a permission
 * @param permission The permission name
 * @returns Human-readable description
 */
export const getPermissionDescription = (permission: Permission): string => {
  const descriptionMap: Record<Permission, string> = {
    'full_system_access': 'Full access to all system features',
    'register_member': 'Register new members',
    'view_member_profiles': 'View member profiles',
    'edit_member_fitness_data': 'Edit member fitness data',
    'assign_diet_plan': 'Assign diet plans to members',
    'assign_workout_plan': 'Assign workout plans to members',
    'create_class': 'Create and schedule classes',
    'book_class': 'Book classes',
    'cancel_class': 'Cancel class bookings',
    'assign_plan': 'Assign membership plans',
    'purchase_plan': 'Purchase membership plans',
    'create_invoice': 'Create invoices',
    'log_attendance': 'Log member attendance',
    'check_in': 'Check in to the gym',
    'send_email_notification': 'Send email notifications',
    'access_dashboards': 'Access dashboards',
    'manage_branches': 'Manage gym branches',
    'view_branch_data': 'View branch data',
    'switch_branches': 'Switch between branches',
    'access_own_resources': 'Access own resources',
    'view_all_users': 'View all users',
    'view_all_trainers': 'View all trainers',
    'view_all_classes': 'View all classes',
    'view_all_attendance': 'View all attendance records',
    'create_edit_plans': 'Create and edit plans',
    'view_invoices': 'View invoices',
    'manage_integrations': 'Manage system integrations',
    'access_analytics': 'Access analytics',
    'manage_roles': 'Manage user roles',
    'manage_members': 'Manage members',
    'manage_fitness_data': 'Manage fitness data',
    'manage_classes': 'Manage classes',
    'manage_payments': 'Manage payments',
    'access_communication': 'Access communication tools',
    'access_inventory': 'Access inventory management',
    'access_store': 'Access store',
    'access_crm': 'Access CRM',
    'access_marketing': 'Access marketing tools',
    'trainer_view_members': 'Trainers can view members',
    'trainer_edit_fitness': 'Trainers can edit fitness data',
    'trainer_view_attendance': 'Trainers can view attendance',
    'trainer_view_classes': 'Trainers can view classes',
    'member_view_profile': 'Members can view their profiles',
    'member_view_invoices': 'Members can view their invoices',
    'member_make_payments': 'Members can make payments',
    'member_view_plans': 'Members can view plans',
    'member_book_classes': 'Members can book classes',
    'member_view_attendance': 'Members can view their attendance',
    'feature_trainer_dashboard': 'Access to trainer dashboard',
    'feature_staff_dashboard': 'Access to staff dashboard',
    'feature_member_dashboard': 'Access to member dashboard',
    'feature_admin_dashboard': 'Access to admin dashboard',
    'feature_pos_system': 'Access to POS system',
    'feature_reporting': 'Access to reporting tools',
    'feature_inventory_management': 'Access to inventory management',
    'feature_class_scheduling': 'Access to class scheduling',
    'feature_attendance_tracking': 'Access to attendance tracking',
    'feature_membership_management': 'Access to membership management',
    'feature_payment_processing': 'Access to payment processing',
    'feature_email_campaigns': 'Access to email campaigns',
    'feature_sms_campaigns': 'Access to SMS campaigns',
    'feature_whatsapp_campaigns': 'Access to WhatsApp campaigns',
    'feature_social_media_integration': 'Access to social media integration'
  };
  
  return descriptionMap[permission] || `Permission to ${permission.replace(/_/g, ' ')}`;
};

export default {
  hasPermission,
  hasRouteAccess,
  getPermissionsForRole,
  getGroupedPermissions,
  getPermissionDescription
};
