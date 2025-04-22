
import { UserRole } from '@/types';
import { Permission } from '@/hooks/use-permissions';

// Define permissions for each role
const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    'full_system_access',
    'register_member',
    'view_member_profiles',
    'edit_member_fitness_data',
    'assign_diet_plan',
    'assign_workout_plan',
    'create_class',
    'book_class',
    'cancel_class',
    'assign_plan',
    'purchase_plan',
    'create_invoice',
    'log_attendance',
    'check_in',
    'send_email_notification',
    'access_dashboards',
    'manage_branches',
    'view_branch_data',
    'switch_branches',
    'access_own_resources',
    'manage_staff',
    'view_staff',
    'manage_trainers',
    'view_trainers',
    'assign_trainers',
    'manage_classes',
    'view_classes',
    'book_classes',
    'manage_finances',
    'view_finances',
    'process_payments',
    'manage_settings',
    'manage_roles',
    'access_reports',
    'access_inventory',
    'access_communication',
    'access_marketing',
    'view_all_users',
    'view_all_trainers',
    'view_all_classes',
    'view_all_attendance',
    'create_edit_plans',
    'view_invoices',
    'manage_integrations',
    'access_analytics',
    'manage_members',
    'manage_fitness_data',
    'manage_payments',
    'access_store',
    'access_crm',
    'trainer_view_members',
    'trainer_edit_fitness',
    'trainer_view_attendance',
    'trainer_view_classes',
    'feature_admin_dashboard',
    'feature_reporting',
    'feature_inventory_management',
    'feature_class_scheduling',
    'feature_attendance_tracking',
    'feature_membership_management',
    'feature_payment_processing',
    'feature_email_campaigns',
    'feature_sms_campaigns',
    'feature_whatsapp_campaigns',
    'feature_social_media_integration'
  ],
  staff: [
    'register_member',
    'view_member_profiles',
    'assign_workout_plan',
    'assign_diet_plan',
    'book_class',
    'cancel_class',
    'assign_plan',
    'purchase_plan',
    'create_invoice',
    'log_attendance',
    'check_in',
    'send_email_notification',
    'access_dashboards',
    'view_branch_data',
    'access_own_resources',
    'view_staff',
    'view_trainers',
    'assign_trainers',
    'view_classes',
    'book_classes',
    'view_finances',
    'process_payments',
    'view_all_classes',
    'view_all_attendance',
    'view_invoices',
    'manage_members',
    'manage_fitness_data',
    'manage_payments',
    'access_store',
    'trainer_view_members',
    'feature_staff_dashboard',
    'feature_class_scheduling',
    'feature_attendance_tracking',
    'feature_membership_management',
    'feature_payment_processing'
  ],
  trainer: [
    'view_member_profiles',
    'edit_member_fitness_data',
    'assign_diet_plan',
    'assign_workout_plan',
    'create_class',
    'log_attendance',
    'access_dashboards',
    'view_branch_data',
    'access_own_resources',
    'view_trainers',
    'view_classes',
    'access_reports',
    'trainer_view_members',
    'trainer_edit_fitness',
    'trainer_view_attendance',
    'trainer_view_classes',
    'create_edit_plans',
    'feature_trainer_dashboard',
    'feature_class_scheduling',
    'feature_attendance_tracking'
  ],
  member: [
    'access_own_resources',
    'book_classes',
    'check_in',
    'member_view_profile',
    'member_view_invoices',
    'member_make_payments',
    'member_view_plans',
    'member_book_classes',
    'member_view_attendance',
    'feature_member_dashboard'
  ]
};

// Common routes for all authenticated users
const commonRoutes = [
  '/',
  '/dashboard',
  '/profile'
];

// Role-specific routes
const roleRoutes: Record<UserRole, string[]> = {
  admin: [
    '/members',
    '/trainers',
    '/classes',
    '/reports',
    '/settings',
    '/finances',
    '/marketing',
    '/inventory',
    '/fitness',
    '/fitness-plans',
    '/fitness/workout-plans',
    '/fitness/diet-plans'
  ],
  staff: [
    '/members',
    '/classes',
    '/tasks',
    '/announcements',
    '/fitness',
    '/fitness/workout-plans',
    '/fitness/diet-plans'
  ],
  trainer: [
    '/trainers',
    '/fitness',
    '/fitness-plans',
    '/trainers/classes',
    '/trainers/allocation',
    '/trainers/pt-plans',
    '/trainers/workout-plans',
    '/trainers/workout-assignments',
    '/trainers/diet-plans',
    '/trainers/member-progress',
    '/trainers/attendance',
    '/trainers/profile',
    '/trainers/tasks',
    '/trainers/announcements'
  ],
  member: [
    '/membership',
    '/bookings',
    '/payments',
    '/my-plans',
    '/attendance'
  ]
};

/**
 * Check if the user has a specific permission based on their role
 * @param role User role
 * @param permission Permission to check
 * @param isOwner Whether the user owns the resource (for member-specific permissions)
 */
export const hasPermission = (
  role: UserRole | undefined,
  permission: Permission,
  isOwner = false
): boolean => {
  if (!role) return false;
  
  // Admin has all permissions
  if (role === 'admin') return true;
  
  // Resource owners have access to their own resources
  if (permission === 'access_own_resources' && isOwner) return true;
  
  // Check role-specific permissions
  return rolePermissions[role].includes(permission);
};

/**
 * Check if the user has access to a specific route
 * @param role User role
 * @param route Route to check
 */
export const hasRouteAccess = (
  role: UserRole | undefined,
  route: string
): boolean => {
  if (!role) return false;
  
  // Admin has access to all routes
  if (role === 'admin') return true;
  
  // Check common routes
  if (commonRoutes.some(r => route.startsWith(r))) return true;
  
  // Check role-specific routes
  return roleRoutes[role].some(r => route.startsWith(r));
};
