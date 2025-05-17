
import React from 'react';
import {
  LayoutDashboard,
  Dumbbell,
  ClipboardList,
  CreditCard,
  Activity,
  Bell,
  MessageSquare,
  CalendarDays,
  Receipt,
  User,
  FileText
} from "lucide-react";
import { NavSection } from '@/types/navigation';
import { Permission } from '@/hooks/auth/use-permissions';

export const memberNavSections: NavSection[] = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
    items: [
      { 
        href: "/dashboard", 
        label: "Dashboard", 
        icon: <LayoutDashboard className="h-4 w-4" />, 
        permission: "access_dashboards" as Permission
      }
    ]
  },
  {
    name: "Fitness",
    icon: <Activity className="h-4 w-4" />,
    items: [
      { 
        href: "/fitness-plans", 
        label: "My Fitness Plan", 
        icon: <Dumbbell className="h-4 w-4" />, 
        permission: "access_own_resources" as Permission
      },
      { 
        href: "/fitness/progress", 
        label: "My Progress", 
        icon: <Activity className="h-4 w-4" />, 
        permission: "access_own_resources" as Permission
      },
      { 
        href: "/fitness/diet", 
        label: "Diet Plan", 
        icon: <ClipboardList className="h-4 w-4" />, 
        permission: "access_own_resources" as Permission
      }
    ]
  },
  {
    name: "Membership",
    icon: <CreditCard className="h-4 w-4" />,
    items: [
      { 
        href: "/classes", 
        label: "Book Classes", 
        icon: <CalendarDays className="h-4 w-4" />, 
        permission: "member_book_classes" as Permission
      },
      { 
        href: "/memberships", 
        label: "Membership Plans", 
        icon: <CreditCard className="h-4 w-4" />, 
        permission: "member_view_plans" as Permission
      },
      { 
        href: "/finance/invoices", 
        label: "Invoices", 
        icon: <Receipt className="h-4 w-4" />, 
        permission: "member_view_invoices" as Permission 
      },
      { 
        href: "/attendance", 
        label: "Attendance", 
        icon: <CalendarDays className="h-4 w-4" />, 
        permission: "member_view_attendance" as Permission
      }
    ]
  },
  {
    name: "Profile",
    icon: <User className="h-4 w-4" />,
    items: [
      { 
        href: "/profile", 
        label: "My Profile", 
        icon: <User className="h-4 w-4" />, 
        permission: "member_view_profile" as Permission 
      },
      { 
        href: "/communication/feedback", 
        label: "Provide Feedback", 
        icon: <MessageSquare className="h-4 w-4" />, 
        permission: "access_communication" as Permission
      },
      { 
        href: "/communication/announcements", 
        label: "Announcements", 
        icon: <Bell className="h-4 w-4" />, 
        permission: "access_communication" as Permission
      }
    ]
  }
];
