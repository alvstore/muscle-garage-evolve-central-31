
import React, { ReactNode } from 'react';
import { usePermissions, Permission } from '@/hooks/auth/use-permissions';

interface PermissionGuardProps {
  permission: Permission;
  isOwner?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}

export const PermissionGuard = ({ 
  permission, 
  isOwner = false, 
  fallback = null, 
  children 
}: PermissionGuardProps) => {
  const { can } = usePermissions();
  
  if (can(permission)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};

interface PermissionButtonProps {
  permission: Permission;
  isOwner?: boolean;
  disableOnly?: boolean;
  children: ReactNode;
  [key: string]: any;
}

export const PermissionButton = ({ 
  permission, 
  isOwner = false,
  disableOnly = false,
  children,
  ...props
}: PermissionButtonProps) => {
  const { can } = usePermissions();
  const hasPermission = can(permission);
  
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

// Add RoutePermissionGuard component for navigation items
export const RoutePermissionGuard = ({ 
  permission, 
  children 
}: {
  permission: Permission;
  children: ReactNode;
}) => {
  const { can } = usePermissions();
  
  if (can(permission)) {
    return <>{children}</>;
  }
  
  return null;
};

export default PermissionGuard;
