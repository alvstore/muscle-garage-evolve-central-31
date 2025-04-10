import { useAuth } from "./use-auth";

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
  | "access_dashboards"
  | "manage_branches"
  | "view_branch_data"
  | "switch_branches"
  | "access_own_resources"
  | "view_all_users"
  | "view_all_trainers"
  | "view_all_classes"
  | "view_all_attendance"
  | "create_edit_plans"
  | "view_invoices"
  | "manage_integrations"
  | "access_analytics"
  | "manage_roles"
  | "manage_members"
  | "manage_fitness_data"
  | "manage_classes"
  | "manage_payments"
  | "access_communication"
  | "access_inventory"
  | "access_store"
  | "access_crm"
  | "access_marketing"
  | "trainer_view_members"
  | "trainer_edit_fitness"
  | "trainer_view_attendance"
  | "trainer_view_classes"
  | "member_view_profile"
  | "member_view_invoices"
  | "member_make_payments"
  | "member_view_plans"
  | "member_book_classes"
  | "member_view_attendance"
  | "feature_trainer_dashboard"
  | "feature_staff_dashboard"
  | "feature_member_dashboard"
  | "feature_admin_dashboard"
  | "feature_pos_system"
  | "feature_reporting"
  | "feature_inventory_management"
  | "feature_class_scheduling"
  | "feature_attendance_tracking"
  | "feature_membership_management"
  | "feature_payment_processing"
  | "feature_email_campaigns"
  | "feature_sms_campaigns"
  | "feature_whatsapp_campaigns"
  | "feature_social_media_integration"
  | "member_submit_feedback"
  | "member_view_feedback"
  | "manage_sms_templates";

export const usePermissions = () => {
  const { user } = useAuth();
  
  const userRole = user?.role || "member";
  
  const can = (permission: Permission, isOwner = false): boolean => {
    switch (permission) {
      case "full_system_access":
      case "manage_branches":
      case "manage_roles":
      case "feature_admin_dashboard":
        return userRole === "admin";
      
      case "register_member":
      case "view_all_users":
      case "view_all_trainers":
      case "manage_members":
      case "create_invoice":
      case "view_invoices":
      case "manage_payments":
      case "access_analytics":
      case "feature_staff_dashboard":
      case "feature_pos_system":
      case "feature_reporting":
        return userRole === "admin" || userRole === "staff";
      
      case "view_member_profiles":
      case "edit_member_fitness_data":
      case "assign_diet_plan":
      case "assign_workout_plan":
      case "trainer_view_members":
      case "trainer_edit_fitness":
      case "manage_fitness_data":
      case "feature_trainer_dashboard":
        return userRole === "admin" || userRole === "staff" || userRole === "trainer";
      
      case "member_view_profile":
      case "member_view_invoices":
      case "member_make_payments":
      case "member_view_plans":
      case "member_book_classes":
      case "member_view_attendance":
      case "feature_member_dashboard":
      case "member_submit_feedback":
      case "member_view_feedback":
        return true;
      
      case "log_attendance":
      case "manage_classes":
      case "view_all_classes":
      case "feature_class_scheduling":
      case "view_all_attendance":
      case "feature_attendance_tracking":
        return userRole === "admin" || userRole === "staff";
      
      default:
        return userRole === "admin";
    }
  };
  
  const canAccess = (route: string): boolean => {
    if (route.startsWith("/admin")) {
      return userRole === "admin";
    } else if (route.startsWith("/trainer")) {
      return userRole === "admin" || userRole === "trainer";
    }
    return true;
  };
  
  const hasRole = (roles: string[]): boolean => {
    return roles.includes(userRole);
  };
  
  const isSystemAdmin = (): boolean => {
    return userRole === "admin";
  };
  
  const isBranchAdmin = (): boolean => {
    return userRole === "admin" || (userRole === "staff" && user?.isBranchManager === true);
  };
  
  return {
    userRole,
    can,
    canAccess,
    hasRole,
    isSystemAdmin,
    isBranchAdmin,
    canManageMembers: userRole === "admin" || userRole === "staff",
    canManageClasses: userRole === "admin" || userRole === "staff",
    canAssignTrainers: userRole === "admin" || userRole === "staff",
    canViewAllMembers: userRole === "admin" || userRole === "staff" || userRole === "trainer",
    isAdmin: userRole === "admin",
    isTrainer: userRole === "trainer",
    isMember: userRole === "member",
  };
};
