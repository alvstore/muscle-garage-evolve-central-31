
import React, { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { UserRole } from '@/types';
import { usePermissions } from '@/hooks/use-permissions';

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
  const { isAuthenticated, user, userRole, isLoading } = useAuth();
  const { can } = usePermissions();
  const location = useLocation();

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
  const effectiveRole = userRole || (user?.role as UserRole);

  // If allowedRoles is specified, check if user has an allowed role
  if (allowedRoles && allowedRoles.length > 0 && effectiveRole) {
    if (!allowedRoles.includes(effectiveRole)) {
      // Redirect to unauthorized page if user doesn't have an allowed role
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check for specific permission if required
  if (requiredPermission && !can(requiredPermission as any)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If children are provided, render them, otherwise use Outlet
  return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute;
