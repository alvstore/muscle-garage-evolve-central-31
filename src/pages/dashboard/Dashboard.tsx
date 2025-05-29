import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/hooks/auth/use-auth';
import { Loader2 } from 'lucide-react';

// Define valid dashboard roles
type DashboardRole = Exclude<UserRole, 'guest'>;

/**
 * Dashboard component that redirects to the appropriate role-specific dashboard.
 */
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, role } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      // Default to member dashboard if no user is logged in
      const userRole = role === 'guest' ? 'member' : role;
      
      // Ensure the role is a valid dashboard role
      const validRoles: DashboardRole[] = ['admin', 'staff', 'trainer', 'member'];
      const validRole = validRoles.includes(userRole as DashboardRole) 
        ? userRole as DashboardRole 
        : 'member';
      
      // Only navigate if we're not already on the correct path
      if (!window.location.pathname.includes(`/dashboard/${validRole}`)) {
        navigate(`/dashboard/${validRole}`, { replace: true });
      }
    }
  }, [isLoading, role, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // This component doesn't render anything visible
  // as it's only responsible for redirecting
  return null;
};

export default Dashboard;
