
import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface AdminLayoutProps {
  children?: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default AdminLayout;
