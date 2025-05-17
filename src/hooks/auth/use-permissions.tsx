
import { useAuth } from '@/hooks/auth/use-auth';
import { useCallback } from 'react';

export type Permission = 
  | 'view:members' 
  | 'create:members' 
  | 'edit:members' 
  | 'delete:members'
  | 'view:trainers' 
  | 'create:trainers' 
  | 'edit:trainers' 
  | 'delete:trainers'
  | 'view:staff' 
  | 'create:staff' 
  | 'edit:staff' 
  | 'delete:staff'
  | 'view:classes' 
  | 'create:classes' 
  | 'edit:classes' 
  | 'delete:classes'
  | 'view:memberships' 
  | 'create:memberships' 
  | 'edit:memberships' 
  | 'delete:memberships'
  | 'view:reports'
  | 'view:dashboard'
  | 'view:settings'
  | 'edit:settings'
  | 'view:finances'
  | 'create:finances'
  | 'view:branches'
  | 'create:branches'
  | 'edit:branches'
  | 'export_data';

export const usePermissions = () => {
  const { user, role, userRole } = useAuth();
  
  const can = useCallback((permission: Permission): boolean => {
    const effectiveRole = userRole || user?.role;
    
    if (!user || !effectiveRole) return false;
    
    // Admin has all permissions
    if (effectiveRole === 'admin') return true;
    
    // Permission matrix based on user role
    const permissionMatrix: Record<string, Permission[]> = {
      staff: [
        'view:members', 'create:members', 'edit:members',
        'view:trainers',
        'view:classes', 'create:classes', 'edit:classes',
        'view:memberships', 'create:memberships', 'edit:memberships',
        'view:dashboard',
        'view:finances', 'create:finances',
      ],
      trainer: [
        'view:members', 
        'view:classes', 'create:classes', 'edit:classes',
        'view:dashboard',
      ],
      member: [
        'view:classes',
      ],
    };
    
    return permissionMatrix[effectiveRole]?.includes(permission) || false;
  }, [user, userRole]);
  
  const isAdmin = useCallback(() => {
    return role === 'admin';
  }, [role]);
  
  const isStaff = useCallback(() => {
    return role === 'staff';
  }, [role]);
  
  const isTrainer = useCallback(() => {
    return role === 'trainer';
  }, [role]);
  
  const isMember = useCallback(() => {
    return role === 'member';
  }, [role]);
  
  const isSuperAdmin = useCallback(() => {
    return role === 'admin' && user?.email === 'admin@example.com';
  }, [role, user?.email]);
  
  const isSystemAdmin = useCallback(() => {
    return role === 'admin' && user?.email === 'admin@example.com';
  }, [role, user?.email]);

  return {
    can,
    isAdmin,
    isStaff,
    isTrainer,
    isMember,
    isSuperAdmin,
    isSystemAdmin
  };
};
