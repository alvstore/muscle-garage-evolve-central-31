
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
  Settings,
  User,
  Calendar,
  UserCircle,
  ChefHat,
  ListTodo,
  MessageCircle
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
        label: "Overview", 
        icon: <LayoutDashboard className="h-4 w-4" />, 
        permission: "feature_trainer_dashboard" as Permission
      },
      { 
        href: "/trainers/tasks", 
        label: "Task Management", 
        icon: <ListTodo className="h-4 w-4" />,
        badge: "3", // Number of pending tasks
        permission: "trainer_view_classes" as Permission
      },
    ]
  },
  {
    name: "My Profile",
    icon: <User className="h-4 w-4" />,
    items: [
      { 
        href: "/trainers/profile", 
        label: "Profile", 
        icon: <User className="h-4 w-4" />,
        permission: "access_own_resources" as Permission
      },
      { 
        href: "/trainers/attendance", 
        label: "My Attendance", 
        icon: <Calendar className="h-4 w-4" />,
        permission: "trainer_view_attendance" as Permission
      },
    ]
  },
  {
    name: "Members",
    icon: <Users className="h-4 w-4" />,
    items: [
      { 
        href: "/trainers/allocation", 
        label: "My Assigned Members", 
        icon: <UserCircle className="h-4 w-4" />,
        permission: "trainer_view_members" as Permission
      },
      { 
        href: "/trainers/pt-plans", 
        label: "PT Plans", 
        icon: <Dumbbell className="h-4 w-4" />,
        permission: "trainer_edit_fitness" as Permission
      },
    ]
  },
  {
    name: "Fitness & Diet",
    icon: <Activity className="h-4 w-4" />,
    items: [
      { 
        href: "/classes", 
        label: "Classes", 
        icon: <Calendar className="h-4 w-4" />,
        permission: "trainer_view_classes" as Permission
      },
      { 
        href: "/fitness/workout-plans", 
        label: "Workout Plans", 
        icon: <Activity className="h-4 w-4" />,
        permission: "trainer_edit_fitness" as Permission
      },
      { 
        href: "/fitness/diet", 
        label: "Diet Plans", 
        icon: <ChefHat className="h-4 w-4" />,
        permission: "trainer_edit_fitness" as Permission
      },
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
        href: "/communication/notifications", 
        label: "My Notifications", 
        icon: <MessageCircle className="h-4 w-4" />,
        badge: "5", // Number of unread notifications
        permission: "access_communication" as Permission
      },
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
