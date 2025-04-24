
import React from "react";
import { NavSection } from "@/types/navigation";
import { Home, Users, Calendar, CreditCard, Settings, Package, BarChart2, Bell, FileText, Globe, ShoppingCart } from "lucide-react";

export const adminNavSections: NavSection[] = [
  {
    name: "Dashboard",
    items: [
      {
        href: "/dashboard",
        label: "Overview",
        permission: "view_dashboard",
        icon: <Home className="h-5 w-5" />
      }
    ]
  },
  {
    name: "Members",
    items: [
      {
        href: "/members",
        label: "Member Management",
        permission: "manage_members",
        icon: <Users className="h-5 w-5" />
      },
      {
        href: "/fitness/progress",
        label: "Progress Tracking",
        permission: "manage_members",
        icon: <BarChart2 className="h-5 w-5" />
      }
    ]
  },
  {
    name: "Classes",
    items: [
      {
        href: "/classes",
        label: "Class Schedule",
        permission: "manage_classes",
        icon: <Calendar className="h-5 w-5" />
      }
    ]
  },
  {
    name: "Finance",
    items: [
      {
        href: "/finance/transactions",
        label: "Transactions",
        permission: "manage_finances",
        icon: <CreditCard className="h-5 w-5" />
      },
      {
        href: "/finance/invoices",
        label: "Invoices",
        permission: "manage_finances",
        icon: <FileText className="h-5 w-5" />
      }
    ]
  },
  {
    name: "Website",
    items: [
      {
        href: "/website",
        label: "Website Management",
        permission: "manage_website",
        icon: <Globe className="h-5 w-5" />
      }
    ]
  },
  {
    name: "Store",
    items: [
      {
        href: "/store",
        label: "Store Management",
        permission: "manage_inventory",
        icon: <ShoppingCart className="h-5 w-5" />
      },
      {
        href: "/inventory",
        label: "Inventory",
        permission: "manage_inventory",
        icon: <Package className="h-5 w-5" />
      }
    ]
  },
  {
    name: "Communication",
    items: [
      {
        href: "/announcements",
        label: "Announcements",
        permission: "manage_branch",
        icon: <Bell className="h-5 w-5" />
      }
    ]
  },
  {
    name: "Settings",
    items: [
      {
        href: "/settings",
        label: "System Settings",
        permission: "manage_settings",
        icon: <Settings className="h-5 w-5" />
      }
    ]
  }
];
