
import React from 'react';
import { AppRoute } from '@/types/route';
import PrivateRoute from '@/components/auth/PrivateRoute';

// CRM pages
import LeadsPage from '@/pages/crm/LeadsPage';
import LeadDetailPage from '@/pages/crm/LeadDetailPage';
import FunnelPage from '@/pages/crm/FunnelPage';
import FollowUpPage from '@/pages/crm/FollowUpPage';
import ContactsPage from '@/pages/crm/ContactsPage';
import DealsPage from '@/pages/crm/DealsPage';
import TasksPage from '@/pages/crm/TasksPage';
import DashboardPage from '@/pages/crm/DashboardPage';
import { 
  UserPlus, 
  BarChart, 
  Clock, 
  Users, 
  DollarSign, 
  CheckSquare 
} from 'lucide-react';

export const crmRoutes: AppRoute[] = [
  {
    path: '/crm/dashboard',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <DashboardPage />
      </PrivateRoute>
    ),
    meta: {
      title: 'CRM Dashboard',
      breadcrumb: 'Dashboard',
      permission: 'access_crm',
      icon: <BarChart className="h-5 w-5" />
    }
  },
  {
    path: '/crm/leads',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <LeadsPage />
      </PrivateRoute>
    ),
    meta: {
      title: 'Lead Management',
      breadcrumb: 'Leads',
      permission: 'access_crm',
      icon: <UserPlus className="h-5 w-5" />
    }
  },
  {
    path: '/crm/leads/:id',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <LeadDetailPage />
      </PrivateRoute>
    ),
    meta: {
      title: 'Lead Details',
      breadcrumb: 'Lead Details',
      permission: 'access_crm',
      icon: <UserPlus className="h-5 w-5" />
    }
  },
  {
    path: '/crm/funnel',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <FunnelPage />
      </PrivateRoute>
    ),
    meta: {
      title: 'Sales Funnel',
      breadcrumb: 'Sales Funnel',
      permission: 'access_crm',
      icon: <BarChart className="h-5 w-5" />
    }
  },
  {
    path: '/crm/follow-up',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <FollowUpPage />
      </PrivateRoute>
    ),
    meta: {
      title: 'Follow-Up Management',
      breadcrumb: 'Follow-Up',
      permission: 'access_crm',
      icon: <Clock className="h-5 w-5" />
    }
  },
  {
    path: '/crm/contacts',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <ContactsPage />
      </PrivateRoute>
    ),
    meta: {
      title: 'Contacts',
      breadcrumb: 'Contacts',
      permission: 'access_crm',
      icon: <Users className="h-5 w-5" />
    }
  },
  {
    path: '/crm/deals',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <DealsPage />
      </PrivateRoute>
    ),
    meta: {
      title: 'Deals',
      breadcrumb: 'Deals',
      permission: 'access_crm',
      icon: <DollarSign className="h-5 w-5" />
    }
  },
  {
    path: '/crm/tasks',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <TasksPage />
      </PrivateRoute>
    ),
    meta: {
      title: 'Task Manager',
      breadcrumb: 'Tasks',
      permission: 'access_crm',
      icon: <CheckSquare className="h-5 w-5" />
    }
  }
];
