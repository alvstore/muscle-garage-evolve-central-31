import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth/use-auth';

interface PermissionsContextType {
  userRole: string | null;
  isAdmin: boolean;
  isTrainer: boolean;
  isStaff: boolean;
  isMember: boolean;
  isBranchManager: boolean;
  hasPermission: (permission: string) => boolean;
  isLoading: boolean;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isBranchManager, setIsBranchManager] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setUserRole(null);
        setIsBranchManager(false);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role, is_branch_manager')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setUserRole(data?.role || null);
        setIsBranchManager(data?.is_branch_manager || false);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const isAdmin = userRole === 'admin';
  const isTrainer = userRole === 'trainer';
  const isStaff = userRole === 'staff';
  const isMember = userRole === 'member';

  const hasPermission = (permission: string): boolean => {
    if (!userRole) return false;
    
    if (isAdmin) return true;
    
    if (isBranchManager) {
      const branchManagerPermissions = [
        'view_branch', 'edit_branch', 'manage_staff',
        'manage_members', 'view_reports', 'manage_equipment',
        'manage_classes', 'view_finances'
      ];
      
      if (branchManagerPermissions.includes(permission)) {
        return true;
      }
    }
    
    if (isStaff) {
      const staffPermissions = [
        'view_members', 'edit_members', 'view_classes',
        'manage_attendance', 'view_equipment'
      ];
      
      if (staffPermissions.includes(permission)) {
        return true;
      }
    }
    
    if (isTrainer) {
      const trainerPermissions = [
        'view_members', 'view_classes', 'manage_workout_plans',
        'manage_diet_plans', 'manage_progress'
      ];
      
      if (trainerPermissions.includes(permission)) {
        return true;
      }
    }
    
    if (isMember) {
      const memberPermissions = [
        'view_profile', 'edit_profile', 'view_classes',
        'book_classes', 'view_plans'
      ];
      
      if (memberPermissions.includes(permission)) {
        return true;
      }
    }
    
    return false;
  };

  return (
    <PermissionsContext.Provider
      value={{
        userRole,
        isAdmin,
        isTrainer,
        isStaff,
        isMember,
        isBranchManager,
        hasPermission,
        isLoading,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  
  return context;
};
