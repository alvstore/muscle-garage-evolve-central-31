
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import StaffDashboard from "./StaffDashboard";
import TrainerDashboard from "./TrainerDashboard";
import MemberDashboard from "./MemberDashboard";
import { UserRole } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { user, userRole, isLoading } = useAuth();
  
  useEffect(() => {
    if (user) {
      console.log("User role in dashboard:", user.role);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
          <p className="mt-4 text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const renderDashboard = (role: UserRole) => {
    switch (role) {
      case "admin":
        return <AdminDashboard />;
      case "staff":
        return <StaffDashboard />;
      case "trainer":
        return <TrainerDashboard />;
      case "member":
        return <MemberDashboard />;
      default:
        return <Navigate to="/unauthorized" replace />;
    }
  };

  // Use userRole from the fetched profile, falling back to user.role if needed
  // Make sure to cast to UserRole type
  const effectiveRole = userRole || (user.role as UserRole);
  
  return renderDashboard(effectiveRole);
};

export default Dashboard;
