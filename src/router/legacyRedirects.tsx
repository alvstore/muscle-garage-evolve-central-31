import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export const AdminRedirect: React.FC = () => {
  const location = useLocation();
  // Extract the rest of the path after /admin
  const restOfPath = location.pathname.replace(/^\/admin(\/|$)/, '');
  const to = `/dashboard/admin${restOfPath ? `/${restOfPath}` : ''}`;
  
  return <Navigate to={to} replace />;
};

export const legacyRedirectRoutes = [
  {
    path: '/admin/*',
    element: <AdminRedirect />
  }
];
