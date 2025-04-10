
import React from "react";
import { RouteObject } from "react-router-dom";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import FrontPagesManager from "@/pages/frontpages/FrontPagesManager";

export const miscRoutes: RouteObject[] = [
  {
    path: "/frontpages",
    element: (
      <PermissionGuard permission="manage_content">
        <FrontPagesManager />
      </PermissionGuard>
    ),
  },
];
