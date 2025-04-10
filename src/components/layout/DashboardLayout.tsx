
import { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { User } from "@/types";

interface DashboardLayoutProps {
  user: User;
}

const DashboardLayout = ({ user }: DashboardLayoutProps) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNavbar user={user} onToggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <DashboardSidebar
          isSidebarOpen={sidebarOpen}
          closeSidebar={closeSidebar}
        />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container mx-auto p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
