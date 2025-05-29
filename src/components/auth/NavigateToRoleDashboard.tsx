import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/hooks/auth/use-auth';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

// Define valid dashboard roles
type DashboardRole = Exclude<UserRole, 'guest'>;

const NavigateToRoleDashboard: React.FC = () => {
  const { user, isLoading, role } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading) {
      // Default to member dashboard if no user is logged in
      const userRole = role === 'guest' ? 'member' : role as DashboardRole;
      
      // Define role-based dashboard paths with type safety
      const roleDashboards: Record<DashboardRole, string> = {
        admin: '/dashboard/admin',
        staff: '/dashboard/staff',
        trainer: '/dashboard/trainer',
        member: '/dashboard/member'
      };

      const targetPath = roleDashboards[userRole] || '/dashboard/member';
      
      // Only navigate if we're not already on the correct path
      if (!window.location.pathname.includes(targetPath)) {
        navigate(targetPath, { replace: true });
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

  // Fallback in case navigation doesn't work
  return <Navigate to="/dashboard/member" replace />;
};

export default NavigateToRoleDashboard;
