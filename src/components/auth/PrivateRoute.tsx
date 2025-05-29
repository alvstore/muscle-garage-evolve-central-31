import React, { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/hooks/auth/use-auth';
import { Loader2 } from 'lucide-react';
import { usePermissions } from '@/hooks/permissions/use-permissions-manager';

// Define valid roles for type safety
type AllowedRole = Exclude<UserRole, 'guest'>;

interface PrivateRouteProps {
  allowedRoles?: AllowedRole[];
  requiresAuth?: boolean;
  requiredPermission?: string;
  permission?: string; // Alias for requiredPermission for backward compatibility
  children?: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  allowedRoles = [], 
  requiresAuth = true, 
  requiredPermission,
  permission,
  children
}) => {
  // Use permission as an alias for requiredPermission if not explicitly provided
  const effectivePermission = requiredPermission || permission;
  const { isAuthenticated, user, role, isLoading: isAuthLoading } = useAuth();
  const { hasPermission, isLoading: isPermissionsLoading } = usePermissions();
  const location = useLocation();
  
  const isLoading = isAuthLoading || isPermissionsLoading;

  // Show a loading indicator while checking authentication status
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // If authentication is required but user is not authenticated or is a guest
  if (requiresAuth && (!isAuthenticated || role === 'guest')) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Determine effective role, ensuring it's a valid AllowedRole
  const effectiveRole = (role && role !== 'guest' ? role : 'member') as AllowedRole;

  // If a permission is required, check if user has the required permission
  if (effectivePermission) {
    if (!hasPermission(effectivePermission)) {
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  }

  // If specific roles are required, check if user has any of the allowed roles
  if (allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.some(
      (allowedRole) => effectiveRole.toLowerCase() === allowedRole.toLowerCase()
    );
    
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  }

  // If we have children, render them, otherwise render the Outlet
  return <>{children || <Outlet />}</>;
};

export default PrivateRoute;
