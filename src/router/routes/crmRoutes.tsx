
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';

// CRM pages
import LeadsPage from '@/pages/crm/LeadsPage';
import FunnelPage from '@/pages/crm/FunnelPage';
import FollowUpPage from '@/pages/crm/FollowUpPage';
import ContactsPage from '@/pages/crm/ContactsPage';
import DealsPage from '@/pages/crm/DealsPage';
import TasksPage from '@/pages/crm/TasksPage';

export const crmRoutes: RouteObject[] = [
  {
    path: '/crm/leads',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <LeadsPage />
      </PrivateRoute>
    )
  },
  {
    path: '/crm/funnel',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <FunnelPage />
      </PrivateRoute>
    )
  },
  {
    path: '/crm/follow-up',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <FollowUpPage />
      </PrivateRoute>
    )
  },
  {
    path: '/crm/contacts',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <ContactsPage />
      </PrivateRoute>
    )
  },
  {
    path: '/crm/deals',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <DealsPage />
      </PrivateRoute>
    )
  },
  {
    path: '/crm/tasks',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <TasksPage />
      </PrivateRoute>
    )
  }
];
