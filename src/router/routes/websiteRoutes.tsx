
import React from 'react';
import { RouteObject } from 'react-router-dom';
import Index from '@/pages/Index';

export const websiteRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Index />
  }
];
