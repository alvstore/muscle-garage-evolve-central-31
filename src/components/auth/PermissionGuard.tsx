
import React, { ReactNode } from 'react';
import { usePermissions } from '@/hooks/use-permissions';

interface PermissionGuardProps {
  permission: string;
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
  permission: string;
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

export default PermissionGuard;
