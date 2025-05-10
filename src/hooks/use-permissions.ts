
import { useAuth } from '@/hooks/use-auth';

export type Permission = 
  // Role-based permissions
  | 'access_dashboards'
  | 'manage_settings'
  | 'view_analytics'
  
  // Member management
  | 'create_members'
  | 'view_members'
  | 'edit_members'
  | 'delete_members'
  
  // Staff management
  | 'create_staff'
  | 'view_staff'
  | 'edit_staff'
  | 'delete_staff'
  
  // Trainer management
  | 'create_trainers'
  | 'view_all_trainers'
  | 'edit_trainers'
  | 'delete_trainers'
  
  // Class management
  | 'create_classes'
  | 'view_classes'
  | 'edit_classes'
  | 'delete_classes'
  
  // Branch management
  | 'view_branch_data'
  | 'manage_branch_settings'
  | 'create_branches'
  | 'edit_branches'
  | 'delete_branches';

export const usePermissions = () => {
  const { user } = useAuth();
  
  const getPermissions = (): Permission[] => {
    switch (user?.role) {
      case 'admin':
        return [
          'access_dashboards',
          'manage_settings',
          'view_analytics',
          'create_members',
          'view_members',
          'edit_members',
          'delete_members',
          'create_staff',
          'view_staff',
          'edit_staff',
          'delete_staff',
          'create_trainers',
          'view_all_trainers',
          'edit_trainers',
          'delete_trainers',
          'create_classes',
          'view_classes',
          'edit_classes',
          'delete_classes',
          'view_branch_data',
          'manage_branch_settings',
          'create_branches',
          'edit_branches',
          'delete_branches',
        ];
      case 'staff':
        return [
          'access_dashboards',
          'view_members',
          'edit_members',
          'create_members',
          'view_all_trainers',
          'view_classes',
          'view_branch_data',
        ];
      case 'trainer':
        return [
          'access_dashboards',
          'view_members',
          'view_classes',
        ];
      case 'member':
        return [
          'access_dashboards',
          'view_classes',
        ];
      default:
        return [];
    }
  };
  
  const hasPermission = (permission: Permission): boolean => {
    const userPermissions = getPermissions();
    return userPermissions.includes(permission);
  };
  
  return {
    hasPermission,
    getPermissions,
  };
};
