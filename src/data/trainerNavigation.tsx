
import React from 'react';
import {
  Activity,
  CalendarDays,
  ClipboardList,
  Dumbbell,
  ListChecks,
  LayoutDashboard,
  Users,
  UserCog2,
  Bell,
  Megaphone,
  Clock,
  Utensils,
  Target,
  CalendarRange,
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
    name: "Schedule",
    icon: <CalendarDays className="h-4 w-4" />,
    items: [
      { 
        href: "/trainers/classes", 
        label: "Classes", 
        icon: <CalendarRange className="h-4 w-4" />,
        permission: "trainer_view_classes" as Permission
      },
      { 
        href: "/trainers/attendance", 
        label: "Attendance", 
        icon: <Clock className="h-4 w-4" />,
        permission: "trainer_view_attendance" as Permission
      }
    ]
  },
  {
    name: "Training",
    icon: <Dumbbell className="h-4 w-4" />,
    items: [
      { 
        href: "/trainers/allocation", 
        label: "Member Allocation", 
        icon: <Users className="h-4 w-4" />,
        permission: "trainer_view_members" as Permission
      },
      { 
        href: "/trainers/pt-plans", 
        label: "PT Plans", 
        icon: <Activity className="h-4 w-4" />,
        permission: "trainer_edit_fitness" as Permission
      },
      { 
        href: "/trainers/workout-plans", 
        label: "Workout Plans", 
        icon: <Dumbbell className="h-4 w-4" />,
        permission: "trainer_edit_fitness" as Permission
      },
      { 
        href: "/trainers/workout-assignments", 
        label: "Workout Assignments", 
        icon: <ClipboardList className="h-4 w-4" />,
        permission: "trainer_edit_fitness" as Permission
      },
      { 
        href: "/trainers/diet-plans", 
        label: "Diet Plans", 
        icon: <Utensils className="h-4 w-4" />,
        permission: "trainer_edit_fitness" as Permission
      },
      { 
        href: "/trainers/member-progress", 
        label: "Member Progress", 
        icon: <Target className="h-4 w-4" />,
        permission: "trainer_view_members" as Permission
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
        permission: "trainer_view_tasks" as Permission
      },
      { 
        href: "/trainers/announcements", 
        label: "Announcements", 
        icon: <Megaphone className="h-4 w-4" />,
        permission: "trainer_view_announcements" as Permission
      },
      { 
        href: "/communication/notifications", 
        label: "Notifications", 
        icon: <Bell className="h-4 w-4" />,
        permission: "access_communication" as Permission
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
        permission: "trainer_view_profile" as Permission
      }
    ]
  }
];
