
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/use-auth';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import DashboardNavbar from '@/components/layout/DashboardNavbar';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(!useIsMobile());
  const { user } = useAuth();

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar 
        isSidebarOpen={sidebarOpen} 
        closeSidebar={handleCloseSidebar} 
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardNavbar 
          user={user}
          onToggleSidebar={handleToggleSidebar}
        />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
