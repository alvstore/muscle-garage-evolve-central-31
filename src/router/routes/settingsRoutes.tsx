
import React from 'react';
import { RouteObject } from 'react-router-dom';
import UnifiedSettingsPage from '@/pages/settings/UnifiedSettingsPage';

export const settingsRoutes: RouteObject[] = [
  {
    path: '/settings',
    element: <UnifiedSettingsPage />
  }
];
