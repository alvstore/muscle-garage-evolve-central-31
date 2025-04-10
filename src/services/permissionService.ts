
import { UserRole } from '@/types';
import { Permission } from '@/hooks/use-permissions';

export const permissionDescriptions: Record<Permission, string> = {
  'full_system_access': 'Complete access to all system features',
  'register_member': 'Can register new members',
  'view_member_profiles': 'Can view member profiles',
  'edit_member_fitness_data': 'Can edit member fitness data',
  'assign_diet_plan': 'Can assign diet plans',
  'assign_workout_plan': 'Can assign workout plans',
  'create_class': 'Can create classes',
  'book_class': 'Can book classes',
  'cancel_class': 'Can cancel classes',
  'assign_plan': 'Can assign membership plans',
  'purchase_plan': 'Can purchase membership plans',
  'create_invoice': 'Can create invoices',
  'log_attendance': 'Can log attendance',
  'check_in': 'Can check-in members',
  'send_email_notification': 'Can send email notifications',
  'access_dashboards': 'Can access dashboards',
  'manage_branches': 'Can manage branches',
  'view_branch_data': 'Can view branch data',
  'switch_branches': 'Can switch between branches',
  'access_own_resources': 'Can access own resources',
  'view_all_users': 'Can view all users',
  'view_all_trainers': 'Can view all trainers',
  'view_all_classes': 'Can view all classes',
  'view_all_attendance': 'Can view all attendance records',
  'create_edit_plans': 'Can create and edit plans',
  'view_invoices': 'Can view invoices',
  'manage_integrations': 'Can manage system integrations',
  'access_analytics': 'Can access analytics',
  'manage_roles': 'Can manage user roles',
  'manage_members': 'Can manage members',
  'manage_fitness_data': 'Can manage fitness data',
  'manage_classes': 'Can manage classes',
  'manage_payments': 'Can manage payments',
  'access_communication': 'Can access communication tools',
  'access_inventory': 'Can access inventory',
  'access_store': 'Can access store',
  'access_crm': 'Can access CRM',
  'access_marketing': 'Can access marketing tools',
  'trainer_view_members': 'Trainers can view members',
  'trainer_edit_fitness': 'Trainers can edit fitness data',
  'trainer_view_attendance': 'Trainers can view attendance',
  'trainer_view_classes': 'Trainers can view classes',
  'member_view_profile': 'Members can view their profile',
  'member_view_invoices': 'Members can view invoices',
  'member_make_payments': 'Members can make payments',
  'member_view_plans': 'Members can view plans',
  'member_book_classes': 'Members can book classes',
  'member_view_attendance': 'Members can view attendance',
  'feature_trainer_dashboard': 'Access trainer dashboard',
  'feature_staff_dashboard': 'Access staff dashboard',
  'feature_member_dashboard': 'Access member dashboard',
  'feature_admin_dashboard': 'Access admin dashboard',
  'feature_pos_system': 'Access Point of Sale system',
  'feature_reporting': 'Access reporting features',
  'feature_inventory_management': 'Access inventory management',
  'feature_class_scheduling': 'Access class scheduling',
  'feature_attendance_tracking': 'Access attendance tracking',
  'feature_membership_management': 'Access membership management',
  'feature_payment_processing': 'Access payment processing',
  'feature_email_campaigns': 'Access email campaigns',
  'feature_sms_campaigns': 'Access SMS campaigns',
  'feature_whatsapp_campaigns': 'Access WhatsApp campaigns',
  'feature_social_media_integration': 'Access social media integration',
  'manage_content': 'Manage website content and front pages'
};

export const hasPermission = (
  userRole: UserRole | undefined, 
  permission: Permission, 
  isOwner = false, 
  currentBranchId?: string
) => {
  if (!userRole) return false;

  // System admin has all permissions
  if (userRole === 'admin') return true;

  // Check for specific role-based permissions
  switch (permission) {
    case 'view_member_profiles':
      return true; // Example: all logged-in users can view member profiles
    case 'edit_member_fitness_data':
      return userRole === 'trainer' || userRole === 'staff'; // Trainers and staff can edit fitness data
    case 'access_own_resources':
      return true; // Example: all logged-in users can access own resources
    case 'switch_branches':
      return userRole === 'staff'; // Fix comparison - don't compare 'staff' with 'admin'
    case 'manage_content':
      return userRole === 'staff'; // Allow staff to manage content but not compare with admin (admin already has all permissions)
    // Add more cases as needed
    default:
      return false; // Default: no permission
  }
};

export const hasRouteAccess = (userRole: UserRole | undefined, route: string) => {
  if (!userRole) return false;

  // System admin has access to all routes
  if (userRole === 'admin') return true;

  // Define route-based access control
  switch (route) {
    case '/dashboard':
      return true; // Example: all logged-in users can access the dashboard
    case '/members':
      return userRole === 'staff' || userRole === 'trainer'; // Staff and trainers can access the members page
    // Add more cases as needed
    default:
      return false; // Default: no access
  }
};
