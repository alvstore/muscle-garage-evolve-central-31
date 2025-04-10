
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';

// Finance pages
import InvoicePage from '@/pages/finance/InvoicePage';
import TransactionPage from '@/pages/finance/TransactionPage';

export const financeRoutes: RouteObject[] = [
  {
    path: '/finance/invoices',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'member']}>
        <InvoicePage />
      </PrivateRoute>
    )
  },
  {
    path: '/finance/transactions',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <TransactionPage />
      </PrivateRoute>
    )
  }
];
