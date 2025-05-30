
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';

// Marketing pages
import PromoPage from '@/pages/marketing/PromoPage';
import ReferralPage from '@/pages/marketing/ReferralPage';
import StorePage from '@/pages/store/StorePage';

export const marketingRoutes: RouteObject[] = [
  {
    path: '/marketing/promo',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <PromoPage />
      </PrivateRoute>
    )
  },
  {
    path: '/marketing/referral',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <ReferralPage />
      </PrivateRoute>
    )
  },
  {
    path: '/store',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'member']}>
        <StorePage />
      </PrivateRoute>
    )
  }
];
