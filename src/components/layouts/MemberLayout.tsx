
import React from "react";
import { Outlet } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";

const MemberLayout: React.FC = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default MemberLayout;
