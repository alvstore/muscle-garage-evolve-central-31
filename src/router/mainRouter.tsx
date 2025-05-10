
import React from "react";
import { RouteObject } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PrivateRoute from "@/components/auth/PrivateRoute";
import { settingsRoutes } from "./routes/admin/settingsRoutes";

// Temporary placeholder until pages are created
const PlaceholderPage = () => <div>Page Coming Soon</div>;

const routes: RouteObject[] = [
  // Website routes placeholder
  {
    path: "/",
    element: <PlaceholderPage />,
    children: [
      {
        path: "/",
        element: <PlaceholderPage />,
      },
      {
        path: "/about",
        element: <PlaceholderPage />,
      },
      {
        path: "/contact",
        element: <PlaceholderPage />,
      },
      {
        path: "/classes",
        element: <PlaceholderPage />,
      },
    ],
  },
  // Auth routes
  {
    path: "/login",
    element: <PlaceholderPage />,
  },
  {
    path: "/register",
    element: <PlaceholderPage />,
  },
  {
    path: "/forgot-password",
    element: <PlaceholderPage />,
  },
  {
    path: "/reset-password",
    element: <PlaceholderPage />,
  },
  // Dashboard routes with auth protection
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // Only include settings routes since they exist
      ...settingsRoutes,
    ],
  },
  // 404 route
  {
    path: "*",
    element: <PlaceholderPage />,
  },
];

export { routes };
