
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import StaffDashboard from "./StaffDashboard";
import TrainerDashboard from "./TrainerDashboard";
import MemberDashboard from "./MemberDashboard";
import { User, UserRole } from "@/types";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-t-accent mx-auto animate-spin"></div>
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
