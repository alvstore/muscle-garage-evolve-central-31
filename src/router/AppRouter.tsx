
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { appRoutes } from './appRoutes';

const router = createBrowserRouter(appRoutes);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
