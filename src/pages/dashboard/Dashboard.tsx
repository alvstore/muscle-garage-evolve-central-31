
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
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
          <p className="mt-4 text-lg font-medium">Loading...</p>
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
        return <Navigate to="/login" replace />;
    }
  };

  return renderDashboard(user.role as UserRole);
};

export default Dashboard;
