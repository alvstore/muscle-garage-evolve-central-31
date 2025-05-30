
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';
import PaymentGatewaySettingsPage from '@/pages/settings/payments/PaymentGatewaySettingsPage';

export const settingsRoutes: RouteObject[] = [
  {
    path: '/settings/payments/gateways',
    element: (
      <PrivateRoute permission="edit:settings">
        <PaymentGatewaySettingsPage />
      </PrivateRoute>
    )
  }
];
