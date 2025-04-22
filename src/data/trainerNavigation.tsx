
import React from 'react';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  Activity,
  CalendarDays,
  Bell,
  MessageSquare,
  User,
  Calendar,
  UserCircle,
  ChefHat,
  ListTodo,
  MessageCircle,
  Search,
  TrendingUp,
  FileText
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
    name: "My Members",
    icon: <Users className="h-4 w-4" />,
    items: [
      { 
        href: "/trainers/allocation", 
        label: "My Assigned Members", 
        icon: <UserCircle className="h-4 w-4" />,
        permission: "trainer_view_members" as Permission
      },
      { 
        href: "/members/progress", 
        label: "Member Progress", 
        icon: <TrendingUp className="h-4 w-4" />,
        permission: "trainer_view_members" as Permission
      },
    ]
  },
  {
    name: "Workout Plans",
    icon: <Dumbbell className="h-4 w-4" />,
    items: [
      { 
        href: "/trainers/workout-plans", 
        label: "Manage Plans", 
        icon: <Dumbbell className="h-4 w-4" />,
        permission: "trainer_edit_fitness" as Permission
      },
      { 
        href: "/trainers/workout-assignments", 
        label: "Assign Plans", 
        icon: <Users className="h-4 w-4" />,
        permission: "trainer_edit_fitness" as Permission
      },
    ]
  },
  {
    name: "Diet Plans",
    icon: <ChefHat className="h-4 w-4" />,
    items: [
      { 
        href: "/trainers/diet-plans", 
        label: "Manage Diet Plans", 
        icon: <ChefHat className="h-4 w-4" />,
        permission: "trainer_edit_fitness" as Permission
      },
      { 
        href: "/trainers/diet-assignments", 
        label: "Assign Diet Plans", 
        icon: <Users className="h-4 w-4" />,
        permission: "trainer_edit_fitness" as Permission
      },
    ]
  },
  {
    name: "Classes",
    icon: <Calendar className="h-4 w-4" />,
    items: [
      { 
        href: "/classes", 
        label: "My Classes", 
        icon: <Calendar className="h-4 w-4" />,
        permission: "trainer_view_classes" as Permission
      },
    ]
  },
  {
    name: "Communication",
    icon: <Bell className="h-4 w-4" />,
    items: [
      { 
        href: "/communication/announcements", 
        label: "Member Announcements", 
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
    name: "Profile",
    icon: <User className="h-4 w-4" />,
    items: [
      { 
        href: "/trainers/profile", 
        label: "My Profile", 
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
  }
];
