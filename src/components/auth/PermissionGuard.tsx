
import React, { ReactNode } from 'react';
import { usePermissions, Permission } from '@/hooks/use-permissions';

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
  const { hasPermission } = usePermissions();
  
  if (hasPermission(permission)) {
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
  const { hasPermission } = usePermissions();
  const hasAccess = hasPermission(permission);
  
  if (!hasAccess && !disableOnly) {
    return null;
  }
  
  return (
    <button
      {...props}
      disabled={!hasAccess || props.disabled}
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
  const { hasPermission } = usePermissions();
  
  if (hasPermission(permission)) {
    return <>{children}</>;
  }
  
  return null;
};

export default PermissionGuard;
