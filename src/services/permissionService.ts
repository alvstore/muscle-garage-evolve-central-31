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
  'manage_integrations': { roles: ['admin'] },
  
  // Feature Access
  'access_dashboards': { roles: ['admin', 'staff', 'trainer', 'member'] },
  'access_reports': { roles: ['admin', 'staff'] },
  'access_inventory': { roles: ['admin', 'staff'] },
  'access_communication': { roles: ['admin', 'staff'] },
  'access_marketing': { roles: ['admin'] },
  
  // Additional permissions that were missing
  'create_class': { roles: ['admin', 'staff'] },
  'assign_diet_plan': { roles: ['admin', 'trainer'] },
  'assign_workout_plan': { roles: ['admin', 'trainer'] },
  'book_class': { roles: ['admin', 'staff', 'member'] },
  'cancel_class': { roles: ['admin', 'staff'] },
  'assign_plan': { roles: ['admin', 'staff'] },
  'purchase_plan': { roles: ['member'] },
  'create_invoice': { roles: ['admin', 'staff'] },
  'log_attendance': { roles: ['admin', 'staff'] },
  'check_in': { roles: ['member'] },
  'send_email_notification': { roles: ['admin', 'staff'] },
  'access_own_resources': { roles: ['admin', 'staff', 'trainer', 'member'] },
  'view_all_users': { roles: ['admin', 'staff'] },
  'view_all_trainers': { roles: ['admin', 'staff'] },
  'view_all_classes': { roles: ['admin', 'staff', 'trainer'] },
  'view_all_attendance': { roles: ['admin', 'staff'] },
  'create_edit_plans': { roles: ['admin', 'staff'] },
  'view_invoices': { roles: ['admin', 'staff', 'member'], memberSelfOnly: true },
  'view_all_member_progress': { roles: ['admin', 'staff'] },
  'manage_fitness_data': { roles: ['admin', 'trainer'] },
  'manage_payments': { roles: ['admin', 'staff'] },
  'access_store': { roles: ['admin', 'staff'] },
  'access_crm': { roles: ['admin', 'staff'] },
  'trainer_view_members': { roles: ['admin', 'trainer'] },
  'trainer_edit_fitness': { roles: ['admin', 'trainer'] },
  'trainer_view_attendance': { roles: ['admin', 'trainer'] },
  'trainer_view_classes': { roles: ['admin', 'trainer'] },
  'member_view_profile': { roles: ['admin', 'staff', 'trainer', 'member'], memberSelfOnly: true },
  'member_view_invoices': { roles: ['admin', 'staff', 'member'], memberSelfOnly: true },
  'member_make_payments': { roles: ['admin', 'staff', 'member'], memberSelfOnly: true },
  'member_view_plans': { roles: ['admin', 'staff', 'trainer', 'member'] },
  'member_book_classes': { roles: ['admin', 'staff', 'member'] },
  'member_view_attendance': { roles: ['admin', 'staff', 'trainer', 'member'], memberSelfOnly: true },
  'feature_trainer_dashboard': { roles: ['admin', 'trainer'] },
  'feature_staff_dashboard': { roles: ['admin', 'staff'] },
  'feature_member_dashboard': { roles: ['admin', 'staff', 'trainer', 'member'] },
  'feature_admin_dashboard': { roles: ['admin'] },
  'feature_pos_system': { roles: ['admin', 'staff'] },
  'feature_reporting': { roles: ['admin', 'staff'] },
  'feature_inventory_management': { roles: ['admin', 'staff'] },
  'feature_class_scheduling': { roles: ['admin', 'staff'] },
  'feature_attendance_tracking': { roles: ['admin', 'staff', 'trainer'] },
  'feature_membership_management': { roles: ['admin', 'staff'] },
  'feature_payment_processing': { roles: ['admin', 'staff'] },
  'feature_email_campaigns': { roles: ['admin', 'staff'] },
  'feature_sms_campaigns': { roles: ['admin', 'staff'] },
  'feature_whatsapp_campaigns': { roles: ['admin', 'staff'] },
  'feature_social_media_integration': { roles: ['admin'] },
  
  // Basic CRUD permissions
  'dashboard_view': { roles: ['admin', 'staff', 'trainer', 'member'] },
  'members_view': { roles: ['admin', 'staff', 'trainer'] },
  'members_create': { roles: ['admin', 'staff'] },
  'members_edit': { roles: ['admin', 'staff'] },
  'members_delete': { roles: ['admin'] },
  'trainers_view': { roles: ['admin', 'staff'] },
  'trainers_create': { roles: ['admin'] },
  'trainers_edit': { roles: ['admin'] },
  'trainers_delete': { roles: ['admin'] },
  'staff_view': { roles: ['admin'] },
  'staff_create': { roles: ['admin'] },
  'staff_edit': { roles: ['admin'] },
  'staff_delete': { roles: ['admin'] },
  'classes_view': { roles: ['admin', 'staff', 'trainer', 'member'] },
  'classes_create': { roles: ['admin', 'staff'] },
  'classes_edit': { roles: ['admin', 'staff'] },
  'classes_delete': { roles: ['admin'] },
  'memberships_view': { roles: ['admin', 'staff', 'member'] },
  'memberships_create': { roles: ['admin'] },
  'memberships_edit': { roles: ['admin'] },
  'memberships_delete': { roles: ['admin'] },
  'fitness_plans_view': { roles: ['admin', 'staff', 'trainer', 'member'] },
  'fitness_plans_create': { roles: ['admin', 'trainer'] },
  'fitness_plans_edit': { roles: ['admin', 'trainer'] },
  'fitness_plans_delete': { roles: ['admin'] },
  'attendance_view': { roles: ['admin', 'staff', 'trainer'] },
  'attendance_create': { roles: ['admin', 'staff'] },
  'attendance_edit': { roles: ['admin', 'staff'] },
  'attendance_delete': { roles: ['admin'] },
  'branches_view': { roles: ['admin', 'staff'] },
  'branches_create': { roles: ['admin'] },
  'branches_edit': { roles: ['admin'] },
  'branches_delete': { roles: ['admin'] },
  'announcements_view': { roles: ['admin', 'staff', 'trainer', 'member'] },
  'announcements_create': { roles: ['admin', 'staff'] },
  'announcements_edit': { roles: ['admin', 'staff'] },
  'announcements_delete': { roles: ['admin'] },
  'tasks_view': { roles: ['admin', 'staff', 'trainer'] },
  'tasks_create': { roles: ['admin', 'staff', 'trainer'] },
  'tasks_edit': { roles: ['admin', 'staff', 'trainer'] },
  'tasks_delete': { roles: ['admin', 'staff'] },
  'feedback_view': { roles: ['admin', 'staff'] },
  'feedback_create': { roles: ['admin', 'staff', 'trainer', 'member'] },
  'feedback_edit': { roles: ['admin'] },
  'feedback_delete': { roles: ['admin'] },
  'leads_view': { roles: ['admin', 'staff'] },
  'leads_create': { roles: ['admin', 'staff'] },
  'leads_edit': { roles: ['admin', 'staff'] },
  'leads_delete': { roles: ['admin'] },
  'funnel_view': { roles: ['admin', 'staff'] },
  'funnel_create': { roles: ['admin'] },
  'funnel_edit': { roles: ['admin'] },
  'funnel_delete': { roles: ['admin'] },
  'follow_up_view': { roles: ['admin', 'staff'] },
  'follow_up_create': { roles: ['admin', 'staff'] },
  'follow_up_edit': { roles: ['admin', 'staff'] },
  'follow_up_delete': { roles: ['admin'] },
  'promo_view': { roles: ['admin', 'staff'] },
  'promo_create': { roles: ['admin'] },
  'promo_edit': { roles: ['admin'] },
  'promo_delete': { roles: ['admin'] },
  'referral_view': { roles: ['admin', 'staff', 'member'] },
  'referral_create': { roles: ['admin'] },
  'referral_edit': { roles: ['admin'] },
  'referral_delete': { roles: ['admin'] },
  'store_view': { roles: ['admin', 'staff', 'member'] },
  'store_create': { roles: ['admin'] },
  'store_edit': { roles: ['admin'] },
  'store_delete': { roles: ['admin'] },
  'invoices_view': { roles: ['admin', 'staff', 'member'], memberSelfOnly: true },
  'invoices_create': { roles: ['admin', 'staff'] },
  'invoices_edit': { roles: ['admin', 'staff'] },
  'invoices_delete': { roles: ['admin'] },
  'transactions_view': { roles: ['admin', 'staff'] },
  'transactions_create': { roles: ['admin', 'staff'] },
  'transactions_edit': { roles: ['admin', 'staff'] },
  'transactions_delete': { roles: ['admin'] },
  'income_view': { roles: ['admin', 'staff'] },
  'income_create': { roles: ['admin', 'staff'] },
  'income_edit': { roles: ['admin', 'staff'] },
  'income_delete': { roles: ['admin'] },
  'expenses_view': { roles: ['admin', 'staff'] },
  'expenses_create': { roles: ['admin', 'staff'] },
  'expenses_edit': { roles: ['admin', 'staff'] },
  'expenses_delete': { roles: ['admin'] },
  'finance_dashboard_view': { roles: ['admin', 'staff'] },
  'website_view': { roles: ['admin'] },
  'website_create': { roles: ['admin'] },
  'website_edit': { roles: ['admin'] },
  'website_delete': { roles: ['admin'] },
  'settings_view': { roles: ['admin'] },
  'settings_edit': { roles: ['admin'] },
  'integrations_view': { roles: ['admin'] },
  'integrations_edit': { roles: ['admin'] },
  'payment_gateways_view': { roles: ['admin'] },
  'payment_gateways_edit': { roles: ['admin'] },
  'analytics_view': { roles: ['admin', 'staff'] }
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
