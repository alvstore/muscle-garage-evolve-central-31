
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import TrainerSidebar from "@/components/layout/TrainerSidebar";

const TrainerLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen">
      <TrainerSidebar isSidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default TrainerLayout;
