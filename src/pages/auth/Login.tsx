
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/auth/use-auth";
import { UserRole } from "@/types";
import { Loader2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { user, userRole, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Only redirect if we have confirmed authentication and user data
    if (isAuthenticated && user && !isLoading) {
      console.log("Redirecting authenticated user with role:", userRole || user.role);
      const role = userRole || user.role as UserRole;
      
      // Redirect based on role
      if (role === 'admin') {
        navigate("/admin/dashboard");
      } else if (role === 'staff') {
        navigate("/dashboard/overview");
      } else if (role === 'trainer') {
        navigate("/trainers/dashboard");
      } else if (role === 'member') {
        navigate("/dashboard/overview");
      } else {
        navigate("/dashboard/overview");
      }
    }
  }, [navigate, user, userRole, isAuthenticated, isLoading]);

  // If still loading, render nothing or a loader
  if (isLoading && isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Redirecting...</span>
      </div>
    );
  }

  // Only show login form if not authenticated
  return <LoginForm />;
};

export default Login;
