import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/hooks/auth/use-auth';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

// Define valid roles for type safety
type AllowedRole = Exclude<UserRole, 'guest'>;

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles?: AllowedRole[];
  redirectTo?: string;
  showUnauthorized?: boolean;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  allowedRoles = [],
  redirectTo = '/unauthorized',
  showUnauthorized = true,
}) => {
  const { user, isLoading, role } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If no specific roles are provided, allow access to all authenticated users except guests
  if (allowedRoles.length === 0 && user && role !== 'guest') {
    return <>{children}</>;
  }

  // Redirect to login if not authenticated
  if (!user || role === 'guest') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has any of the allowed roles (case-insensitive comparison)
  const hasRequiredRole = allowedRoles.some(allowedRole => 
    role.toLowerCase() === allowedRole.toLowerCase()
  );

  if (!hasRequiredRole) {
    if (showUnauthorized) {
      toast({
        title: 'Unauthorized',
        description: 'You do not have permission to access this page.',
        variant: 'destructive',
      });
    }
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RoleBasedRoute;
