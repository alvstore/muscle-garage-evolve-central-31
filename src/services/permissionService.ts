
import { UserRole } from "@/types";
import { Permission } from "@/hooks/use-permissions";

/**
 * Check if a user with the specified role has a specific permission
 */
export const hasPermission = (
  role: UserRole | undefined,
  permission: Permission,
  isOwner: boolean = false,
  branchId?: string
): boolean => {
  if (!role) return false;
  
  // Simple permission logic based on roles
  switch (role) {
    case "admin":
      return true; // Admin has all permissions
      
    case "staff":
      // Staff can do most things except system-level operations
      return permission !== "full_system_access" && 
             permission !== "manage_roles" &&
             permission !== "feature_admin_dashboard";
      
    case "trainer":
      // Trainers can manage fitness data and view their assigned members
      return permission.startsWith("trainer_") ||
             permission === "view_member_profiles" ||
             permission === "edit_member_fitness_data" ||
             permission === "assign_diet_plan" ||
             permission === "assign_workout_plan" ||
             permission === "manage_fitness_data" ||
             permission === "feature_trainer_dashboard" ||
             (permission.startsWith("member_") && isOwner);
      
    case "member":
      // Members can only access their own data
      return permission.startsWith("member_") && (isOwner || permission === "member_submit_feedback");
      
    default:
      return false;
  }
};

/**
 * Check if a user with the specified role has access to a specific route
 */
export const hasRouteAccess = (
  role: UserRole | undefined,
  route: string
): boolean => {
  if (!role) return false;
  
  // Simple route access based on roles
  if (route.startsWith("/admin")) {
    return role === "admin";
  }
  
  if (route.startsWith("/staff")) {
    return role === "admin" || role === "staff";
  }
  
  if (route.startsWith("/trainer")) {
    return role === "admin" || role === "staff" || role === "trainer";
  }
  
  // Members and everyone can access public routes
  return true;
};
