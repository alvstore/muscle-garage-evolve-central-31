
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../use-auth';
import { Permission } from '@/hooks/use-permissions';
import { hasPermission, isUserSystemAdmin, isUserBranchAdmin } from './use-permission-utils';
import { UserRole } from '@/types';

interface PermissionsContextType {
  can: (permission: Permission) => boolean;
  isSystemAdmin: () => boolean;
  isBranchAdmin: () => boolean;
  userRole: UserRole | null;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const PermissionsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  
  useEffect(() => {
    if (user) {
      setUserRole(user.role as UserRole);
    } else {
      setUserRole(null);
    }
  }, [user]);
  
  // Check if the user has a specific permission
  const can = (permission: Permission): boolean => {
    return hasPermission(userRole, permission);
  };
  
  // Check if user is a system admin (full access)
  const isSystemAdmin = (): boolean => {
    return isUserSystemAdmin(userRole);
  };
  
  // Check if user is a branch admin
  const isBranchAdmin = (): boolean => {
    return isUserBranchAdmin(userRole, user?.isBranchManager);
  };
  
  return (
    <PermissionsContext.Provider value={{ can, isSystemAdmin, isBranchAdmin, userRole }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissionsManager = (): PermissionsContextType => {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error('usePermissionsManager must be used within a PermissionsProvider');
  }
  return context;
};

export interface User {
  id: string;
  email?: string;
  role?: string;
  branch_id?: string;
  isBranchManager?: boolean;
}
