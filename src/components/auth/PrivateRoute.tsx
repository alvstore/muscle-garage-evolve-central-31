
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { UserRole } from '@/types';

interface PrivateRouteProps {
  allowedRoles?: UserRole[];
  requiresAuth?: boolean;
}

const PrivateRoute = ({ allowedRoles, requiresAuth = true }: PrivateRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

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

  // If allowedRoles is specified, check if user has an allowed role
  if (allowedRoles && allowedRoles.length > 0 && user) {
    if (!allowedRoles.includes(user.role as UserRole)) {
      // Redirect to unauthorized page or dashboard based on role
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Render the protected route
  return <Outlet />;
};

export default PrivateRoute;
