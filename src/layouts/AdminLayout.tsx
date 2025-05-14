
import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';

const AdminLayout = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default AdminLayout;
