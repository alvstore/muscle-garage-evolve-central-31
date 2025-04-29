
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types";

const Login = () => {
  const navigate = useNavigate();
  const { user, userRole, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Only redirect if we have confirmed authentication and user data
    if (isAuthenticated && user && !isLoading) {
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
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return <LoginForm />;
};

export default Login;
