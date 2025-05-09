
import React from "react";
import { RouteObject, createBrowserRouter } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import WebsiteLayout from "@/components/layout/WebsiteLayout";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import { dashboardRoutes } from "./routes/dashboardRoutes";
import { memberRoutes } from "./routes/memberRoutes";
import { fitnessRoutes } from "./routes/fitnessRoutes";
import { classesRoutes } from "./routes/classesRoutes";
import { attendanceRoutes } from "./routes/attendanceRoutes";
import { adminMembershipRoutes } from "./routes/admin/membershipRoutes";
import { settingsRoutes } from "./routes/settingsRoutes";
import { financeRoutes } from "./routes/financeRoutes";
import { staffRoutes } from "./routes/staffRoutes";
import PrivateRoute from "@/components/auth/PrivateRoute";
import NotFoundPage from "@/pages/NotFoundPage";
import { inventoryRoutes } from "./routes/inventoryRoutes";
import { storeRoutes } from "./routes/storeRoutes";
import { insightsRoutes } from "./routes/insightsRoutes";

// Website pages
import AboutPage from "@/pages/website/AboutPage";
import ContactPage from "@/pages/website/ContactPage";
import ClassesPage from "@/pages/website/ClassesPage";

// Concatenate all routes
const routes: RouteObject[] = [
  // Website routes
  {
    path: "/",
    element: <WebsiteLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/classes",
        element: <ClassesPage />,
      },
    ],
  },
  // Auth routes
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
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
      ...dashboardRoutes,
      ...memberRoutes,
      ...fitnessRoutes,
      ...classesRoutes,
      ...attendanceRoutes,
      ...adminMembershipRoutes,
      ...settingsRoutes,
      ...financeRoutes,
      ...inventoryRoutes,
      ...storeRoutes,
      ...insightsRoutes,
      ...staffRoutes,
    ],
  },
  // 404 route
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

export const router = createBrowserRouter(routes);
