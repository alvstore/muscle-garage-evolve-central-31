
import { useAuth } from "./use-auth";

export const usePermissions = () => {
  const { user } = useAuth();
  
  return {
    userRole: user?.role || "member",
    canManageMembers: user?.role === "admin" || user?.role === "staff",
    canManageClasses: user?.role === "admin" || user?.role === "staff",
    canAssignTrainers: user?.role === "admin" || user?.role === "staff",
    canViewAllMembers: user?.role === "admin" || user?.role === "staff" || user?.role === "trainer",
    isAdmin: user?.role === "admin",
    isTrainer: user?.role === "trainer",
    isMember: user?.role === "member",
  };
};
