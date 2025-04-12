
import React from 'react';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  ClipboardList,
  Activity,
  CalendarDays,
  Bell,
  MessageSquare,
  FileText,
  Settings
} from "lucide-react";
import { NavSection } from '@/types/navigation';
import { Permission } from '@/hooks/use-permissions';

export const trainerNavSections: NavSection[] = [
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
    name: "Training",
    icon: <Dumbbell className="h-4 w-4" />,
    items: [
      { 
        href: "/members", 
        label: "My Members", 
        icon: <Users className="h-4 w-4" />,
        permission: "trainer_view_members" as Permission
      },
      { 
        href: "/classes", 
        label: "Classes", 
        icon: <ClipboardList className="h-4 w-4" />, 
        permission: "trainer_view_classes" as Permission
      },
      { 
        href: "/fitness-plans", 
        label: "Fitness Plans", 
        icon: <Activity className="h-4 w-4" />, 
        permission: "trainer_edit_fitness" as Permission
      },
      { 
        href: "/attendance", 
        label: "Attendance", 
        icon: <CalendarDays className="h-4 w-4" />, 
        permission: "trainer_view_attendance" as Permission
      }
    ]
  },
  {
    name: "Communication",
    icon: <Bell className="h-4 w-4" />,
    items: [
      { 
        href: "/communication/announcements", 
        label: "Announcements", 
        icon: <Bell className="h-4 w-4" />, 
        permission: "access_communication" as Permission 
      },
      { 
        href: "/communication/feedback", 
        label: "Feedback", 
        icon: <MessageSquare className="h-4 w-4" />, 
        permission: "access_communication" as Permission
      }
    ]
  },
  {
    name: "Other",
    icon: <FileText className="h-4 w-4" />,
    items: [
      { 
        href: "/reports", 
        label: "Reports", 
        icon: <FileText className="h-4 w-4" />, 
        permission: "access_analytics" as Permission
      },
      { 
        href: "/settings", 
        label: "Settings", 
        icon: <Settings className="h-4 w-4" />, 
        permission: "access_own_resources" as Permission
      }
    ]
  }
];
