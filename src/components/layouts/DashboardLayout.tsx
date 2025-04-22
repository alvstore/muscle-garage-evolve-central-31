
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/sidebar/Sidebar";
import Header from "@/components/header/Header";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import TrainerSidebarContent from "@/components/sidebar/TrainerSidebarContent";
import StaffSidebarContent from "@/components/sidebar/StaffSidebarContent";
import AdminSidebarContent from "@/components/sidebar/AdminSidebarContent";
import MemberSidebarContent from "@/components/sidebar/MemberSidebarContent";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Determine which sidebar content to render based on user role
  const renderSidebarContent = () => {
    if (!user) return null;

    switch (user.role) {
      case 'admin':
        return <AdminSidebarContent closeSidebar={() => setIsSidebarOpen(false)} />;
      case 'staff':
        return <StaffSidebarContent closeSidebar={() => setIsSidebarOpen(false)} />;
      case 'trainer':
        return <TrainerSidebarContent closeSidebar={() => setIsSidebarOpen(false)} />;
      case 'member':
        return <MemberSidebarContent closeSidebar={() => setIsSidebarOpen(false)} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}>
        {renderSidebarContent()}
      </Sidebar>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main
          className={cn(
            "flex-1 overflow-y-auto p-4 md:p-6 transition-all",
            !isSidebarOpen && "ml-0"
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
