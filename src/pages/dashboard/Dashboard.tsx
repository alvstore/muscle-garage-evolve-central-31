
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
      console.log("Dashboard - Full user object:", user);
      console.log("Dashboard - User role from user object:", user.role);
      console.log("Dashboard - User role from context:", userRole);
      console.log("Dashboard - Effective role being used:", userRole || user.role);
    }
  }, [user, userRole]);

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

  const renderDashboard = (role: UserRole | string | undefined) => {
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
        console.error("Unknown or undefined user role:", role);
        return <Navigate to="/unauthorized" replace />;
    }
  };

  // Use userRole from the fetched profile, falling back to user.role if needed
  const effectiveRole = userRole || user.role;
  
  return renderDashboard(effectiveRole as UserRole);
};

export default Dashboard;
