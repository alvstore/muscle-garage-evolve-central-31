
import React from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ListChecks,
  UserCog2,
  Bell,
  Megaphone,
  Clock,
  Utensils,
  Target,
} from "lucide-react";
import { NavSection } from '@/types/navigation';

export const trainerNavSections: NavSection[] = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
    items: [
      { 
        href: "/dashboard", 
        label: "Dashboard", 
        icon: <LayoutDashboard className="h-4 w-4" />,
        permission: "feature_trainer_dashboard"
      }
    ]
  },
  {
    name: "Schedule",
    icon: <CalendarDays className="h-4 w-4" />,
    items: [
      { 
        href: "/trainers/classes", 
        label: "Classes", 
        icon: <CalendarDays className="h-4 w-4" />,
        permission: "trainer_view_classes"
      },
      { 
        href: "/trainers/attendance", 
        label: "Attendance", 
        icon: <Clock className="h-4 w-4" />,
        permission: "trainer_view_attendance"
      }
    ]
  },
  {
    name: "Training",
    icon: <Users className="h-4 w-4" />,
    items: [
      { 
        href: "/trainers/allocation", 
        label: "Member Allocation", 
        icon: <Users className="h-4 w-4" />,
        permission: "trainer_view_members"
      },
      { 
        href: "/trainers/member-progress", 
        label: "Member Progress", 
        icon: <Target className="h-4 w-4" />,
        permission: "trainer_view_members"
      }
    ]
  },
  {
    name: "Management",
    icon: <ListChecks className="h-4 w-4" />,
    items: [
      { 
        href: "/trainers/tasks", 
        label: "Tasks", 
        icon: <ListChecks className="h-4 w-4" />,
        permission: "manage_staff"
      },
      { 
        href: "/trainers/announcements", 
        label: "Announcements", 
        icon: <Megaphone className="h-4 w-4" />,
        permission: "feature_email_campaigns"
      },
      { 
        href: "/communication/notifications", 
        label: "Notifications", 
        icon: <Bell className="h-4 w-4" />,
        permission: "access_communication"
      }
    ]
  },
  {
    name: "Profile",
    icon: <UserCog2 className="h-4 w-4" />,
    items: [
      { 
        href: "/trainers/profile", 
        label: "My Profile", 
        icon: <UserCog2 className="h-4 w-4" />,
        permission: "view_staff"
      }
    ]
  }
];
