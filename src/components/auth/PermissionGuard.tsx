
import React, { ReactNode } from 'react';
import { usePermissions, Permission } from '@/hooks/use-permissions';

interface PermissionGuardProps {
  permission: Permission;
  isOwner?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Component that conditionally renders children based on user permissions
 */
export const PermissionGuard = ({ 
  permission, 
  isOwner = false, 
  fallback = null, 
  children 
}: PermissionGuardProps) => {
  const { can } = usePermissions();
  
  if (can(permission, isOwner)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};

interface PermissionButtonProps {
  permission: Permission;
  isOwner?: boolean;
  disableOnly?: boolean;
  children: ReactNode;
  [key: string]: any; // Additional props to pass to the button
}

/**
 * Button that is disabled or hidden based on user permissions
 */
export const PermissionButton = ({ 
  permission, 
  isOwner = false,
  disableOnly = false,
  children,
  ...props
}: PermissionButtonProps) => {
  const { can } = usePermissions();
  const hasPermission = can(permission, isOwner);
  
  if (!hasPermission && !disableOnly) {
    return null;
  }
  
  return (
    <button
      {...props}
      disabled={!hasPermission || props.disabled}
    >
      {children}
    </button>
  );
};

/**
 * Checks if a user has permission to view a specific route/link
 */
export const RoutePermissionGuard = ({ 
  permission, 
  isOwner = false, 
  children 
}: { 
  permission: Permission; 
  isOwner?: boolean; 
  children: ReactNode 
}) => {
  const { can } = usePermissions();
  
  if (can(permission, isOwner)) {
    return <>{children}</>;
  }
  
  return null;
};

export default PermissionGuard;
