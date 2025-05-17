import React, { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/use-auth';
import { Loader2 } from 'lucide-react';
import { usePermissions } from '@/hooks/permissions/use-permissions-manager';
import { UserRole } from '@/types/auth/user';

interface PrivateRouteProps {
  allowedRoles?: UserRole[];
  requiresAuth?: boolean;
  requiredPermission?: string;
  children?: ReactNode;
}

const PrivateRoute = ({ 
  allowedRoles, 
  requiresAuth = true, 
  requiredPermission,
  children
}: PrivateRouteProps) => {
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

  // If authentication is required but user is not authenticated
  if (requiresAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Determine effective role, prioritizing the one from the profile
  const effectiveRole = role || (user?.role as UserRole);

  // If allowedRoles is specified, check if user has an allowed role
  if (allowedRoles && allowedRoles.length > 0 && effectiveRole) {
    if (!allowedRoles.includes(effectiveRole as UserRole)) {
      // Redirect to unauthorized page if user doesn't have an allowed role
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check if user has required permission if specified
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // If children are provided, render them, otherwise use Outlet
  return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute;
