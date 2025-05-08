import React from 'react';
import { RouteObject } from 'react-router-dom';

import WebsiteLayout from '@/layouts/WebsiteLayout';
import HomePage from '@/pages/website/HomePage';
import AboutPage from '@/pages/website/AboutPage';
import WebsiteMembershipPage from '@/pages/website/WebsiteMembershipPage';
import ServicesPage from '@/pages/website/ServicesPage';
import ContactPage from '@/pages/website/ContactPage';
import WebsiteContentManager from '@/pages/website/WebsiteContentManager';
import PaymentSuccessPage from '@/pages/website/PaymentSuccessPage';
import PaymentCancelPage from '@/pages/website/PaymentCancelPage';

export const websiteRoutes: RouteObject[] = [
  {
    path: '/',
    element: <WebsiteLayout />,
    children: [
      {
        path: '',
        element: <HomePage />
      },
      {
        path: 'about',
        element: <AboutPage />
      },
      {
        path: 'membership',
        element: <WebsiteMembershipPage />
      },
      {
        path: 'services',
        element: <ServicesPage />
      },
      {
        path: 'contact',
        element: <ContactPage />
      },
      {
        path: 'website-manager',
        element: <WebsiteContentManager />
      }
    ]
  },
  {
    path: '/payment-success',
    element: <PaymentSuccessPage />
  },
  {
    path: '/payment-cancel',
    element: <PaymentCancelPage />
  }
];
