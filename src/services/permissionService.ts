
import { UserRole } from "@/types";

// Define permission map based on user roles
const permissionMap: Record<UserRole, string[]> = {
  admin: [
    "manage_users",
    "manage_members",
    "manage_trainers",
    "manage_staff",
    "manage_branches",
    "manage_classes",
    "manage_memberships",
    "manage_finances",
    "manage_announcements",
    "manage_settings",
    "view_dashboard",
    "view_reports",
    "manage_inventory",
    "manage_attendance",
    "manage_crm",
    "assign_workout_plan",
    "assign_diet_plan",
    "create_class",
    "edit_class",
    "delete_class",
    "create_announcement",
    "edit_announcement",
    "delete_announcement",
    "view_all_branches",
  ],
  staff: [
    "manage_members",
    "manage_classes",
    "view_dashboard",
    "manage_attendance",
    "manage_crm",
    "assign_workout_plan",
    "assign_diet_plan",
    "create_class",
    "edit_class",
    "create_announcement",
    "edit_announcement"
  ],
  trainer: [
    "view_assigned_members",
    "assign_workout_plan",
    "assign_diet_plan",
    "create_class",
    "edit_class",
    "track_member_progress"
  ],
  member: [
    "view_profile",
    "book_class",
    "view_classes",
    "view_workout_plan",
    "view_diet_plan",
    "track_own_progress",
    "delete_announcement"
  ]
};

/**
 * Check if a user has the specified permission based on their role
 * @param role The user's role
 * @param permission The permission to check
 * @param isOwner Whether the user is the owner of the resource (for ownership-based permissions)
 * @returns Boolean indicating whether the user has the permission
 */
export const hasPermission = (
  role: UserRole,
  permission: string,
  isOwner = false
): boolean => {
  // Super admins have all permissions
  if (role === "admin") {
    return true;
  }

  // Check if the role has the specific permission
  if (permissionMap[role]?.includes(permission)) {
    return true;
  }

  // Some permissions may be allowed if the user is the owner
  if (isOwner) {
    const ownerPermissions: Record<UserRole, string[]> = {
      member: ["edit_own_profile", "delete_own_comments", "delete_announcement"],
      trainer: ["edit_own_profile", "edit_own_class"],
      staff: ["edit_own_profile"],
      admin: []
    };

    if (ownerPermissions[role]?.includes(permission)) {
      return true;
    }
  }

  return false;
};

export default hasPermission;
