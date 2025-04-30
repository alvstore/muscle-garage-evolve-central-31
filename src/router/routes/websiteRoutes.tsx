
import React from 'react';
import { RouteObject } from 'react-router-dom';
import Index from '@/pages/Index';
import WebsiteLayout from '@/layouts/WebsiteLayout';
import MembershipPricingPage from '@/pages/website/MembershipPricingPage';
import AboutUsPage from '@/pages/website/AboutUsPage';
import ClassesPage from '@/pages/website/ClassesPage';
import ContactPage from '@/pages/website/ContactPage';

export const websiteRoutes: RouteObject[] = [
  {
    path: '/',
    element: <WebsiteLayout />,
    children: [
      {
        path: '',
        element: <Index />
      },
      {
        path: 'membership',
        element: <MembershipPricingPage />
      },
      {
        path: 'about',
        element: <AboutUsPage />
      },
      {
        path: 'classes',
        element: <ClassesPage />
      },
      {
        path: 'contact',
        element: <ContactPage />
      }
    ]
  }
];
