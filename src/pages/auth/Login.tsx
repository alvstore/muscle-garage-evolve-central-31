
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/auth/use-auth";
import { Loader2 } from "lucide-react";

import { UserRole, isUserRole } from '@/hooks/auth/use-auth';

const Login = () => {
  const navigate = useNavigate();
  const { user, role, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Only redirect if we have confirmed authentication and user data
    if (isAuthenticated && user && !isLoading) {
      // Get the role from either the role prop or user.role, defaulting to 'member'
      const roleValue = role || user.role || 'member';
      // Ensure the role is valid, default to 'member' if not
      const userRole: UserRole = isUserRole(roleValue) ? roleValue : 'member';
      
      console.log("Redirecting authenticated user with role:", userRole);
      
      // Redirect based on role
      switch (userRole) {
        case 'admin':
          navigate("/admin/dashboard");
          break;
        case 'staff':
          navigate("/dashboard/overview");
          break;
        case 'trainer':
          navigate("/trainers/dashboard");
          break;
        case 'member':
        case 'guest':
        default:
          navigate("/dashboard/overview");
      }
    }
  }, [navigate, user, role, isAuthenticated, isLoading]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  // Only show login form if not authenticated
  return <LoginForm />;
};

export default Login;
