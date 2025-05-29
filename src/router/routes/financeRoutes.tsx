
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';
import InvoicesPage from '@/pages/finance/InvoicesPage';
import NewInvoicePage from '@/pages/finance/NewInvoicePage';
import TransactionPage from '@/pages/finance/TransactionPage';
import FinanceDashboardPage from '@/pages/finance/FinanceDashboardPage';
import IncomeRecordsPage from '@/pages/finance/IncomeRecordsPage';
import ExpenseRecordsPage from '@/pages/finance/ExpenseRecordsPage';

export const financeRoutes: RouteObject[] = [
  {
    path: 'finance/dashboard',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <FinanceDashboardPage />
      </PrivateRoute>
    )
  },
  {
    path: 'finance/invoices',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <InvoicesPage />
      </PrivateRoute>
    )
  },
  {
    path: 'finance/invoices/new',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <NewInvoicePage />
      </PrivateRoute>
    )
  },
  {
    path: 'finance/transactions',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <TransactionPage />
      </PrivateRoute>
    )
  },
  {
    path: 'finance/income',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <IncomeRecordsPage />
      </PrivateRoute>
    )
  },
  {
    path: 'finance/expenses',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <ExpenseRecordsPage />
      </PrivateRoute>
    )
  }
];
