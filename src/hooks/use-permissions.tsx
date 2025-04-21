import { createContext, useContext, ReactNode } from "react";
import { UserRole } from "@/types";
import { useAuth } from "./use-auth";
import { hasPermission } from "@/services/permissionService";

export type Permission = string;

interface PermissionsContextType {
  userRole: UserRole | null;
  can: (permission: Permission, isOwner?: boolean) => boolean;
  canCreateAnnouncement: boolean;
  canEditAnnouncement: boolean;
  canDeleteAnnouncement: boolean;
  canViewFinance: boolean;
  canEditFinance: boolean;
  canCreateClass: boolean;
  canEditClass: boolean;
  canEditSettings: boolean;
  canViewAllBranches: boolean;
  canEditProfiles: boolean;
  canDeleteProfiles: boolean;
  canAssignTrainers: boolean;
  canCreateFitnessPlan: boolean;
  canEditFitnessPlan: boolean;
  canViewMembersList: boolean;
  isBranchManager: boolean;
  isSuperAdmin: boolean;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const PermissionsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const userRole = user?.role as UserRole || null;
  
  const isBranchManager = !!user?.isBranchManager;
  const isSuperAdmin = userRole === "admin" && !user?.branchId;
  
  const canCreateAnnouncement = ["admin", "staff"].includes(userRole as string);
  const canEditAnnouncement = ["admin", "staff"].includes(userRole as string);
  const canDeleteAnnouncement = ["admin", "staff"].includes(userRole as string) || (userRole === "member");
  
  const canViewFinance = ["admin", "staff"].includes(userRole as string);
  const canEditFinance = ["admin"].includes(userRole as string);
  
  const canCreateClass = ["admin", "staff", "trainer"].includes(userRole as string);
  const canEditClass = ["admin", "staff", "trainer"].includes(userRole as string);
  
  const canEditSettings = ["admin"].includes(userRole as string);
  const canViewAllBranches = isSuperAdmin || (userRole === "admin" && !!user?.branchIds?.length);
  
  const canEditProfiles = ["admin", "staff"].includes(userRole as string);
  const canDeleteProfiles = ["admin"].includes(userRole as string);
  
  const canAssignTrainers = ["admin", "staff"].includes(userRole as string);
  
  const canCreateFitnessPlan = ["admin", "staff", "trainer"].includes(userRole as string);
  const canEditFitnessPlan = ["admin", "staff", "trainer"].includes(userRole as string) || (userRole === "member" && false); // Members can't edit by default
  
  const canViewMembersList = ["admin", "staff", "trainer"].includes(userRole as string);
  
  const can = (permission: Permission, isOwner = false): boolean => {
    if (!user || !userRole) return false;
    return hasPermission(userRole, permission as any, isOwner);
  };
  
  return (
    <PermissionsContext.Provider
      value={{
        userRole,
        can,
        canCreateAnnouncement,
        canEditAnnouncement,
        canDeleteAnnouncement,
        canViewFinance,
        canEditFinance,
        canCreateClass,
        canEditClass,
        canEditSettings,
        canViewAllBranches,
        canEditProfiles,
        canDeleteProfiles,
        canAssignTrainers,
        canCreateFitnessPlan,
        canEditFitnessPlan,
        canViewMembersList,
        isBranchManager,
        isSuperAdmin,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
};
