
import React from 'react';
import {
  BarChart3,
  Users,
  CalendarDays,
  Dumbbell,
  Clock,
  Bell,
  Activity,
  FileText,
  Megaphone,
  UserCog2,
  ListChecks,
  Utensils,
  Target,
  CheckSquare,
  FolderHeart
} from "lucide-react";
import { NavSection } from '@/types/navigation';
import { Permission } from '@/hooks/use-permissions';

export const staffNavSections: NavSection[] = [
  {
    name: "Dashboard",
    icon: <BarChart3 className="h-4 w-4" />,
    items: [
      { 
        href: "/dashboard", 
        label: "Dashboard", 
        icon: <BarChart3 className="h-4 w-4" />,
        permission: "feature_staff_dashboard" as Permission
      }
    ]
  },
  {
    name: "Members",
    icon: <Users className="h-4 w-4" />,
    items: [
      { 
        href: "/members", 
        label: "Member Management", 
        icon: <Users className="h-4 w-4" />,
        permission: "manage_members" as Permission
      },
      { 
        href: "/members/attendance", 
        label: "Attendance", 
        icon: <Clock className="h-4 w-4" />,
        permission: "view_all_attendance" as Permission
      }
    ]
  },
  {
    name: "Classes",
    icon: <CalendarDays className="h-4 w-4" />,
    items: [
      { 
        href: "/classes", 
        label: "Class Schedule", 
        icon: <CalendarDays className="h-4 w-4" />,
        permission: "view_classes" as Permission
      }
    ]
  },
  {
    name: "Fitness",
    icon: <Dumbbell className="h-4 w-4" />,
    items: [
      { 
        href: "/fitness/workout-plans", 
        label: "Workout Plans", 
        icon: <Dumbbell className="h-4 w-4" />,
        permission: "manage_fitness_data" as Permission
      },
      { 
        href: "/fitness/workout-assignments", 
        label: "Workout Assignments", 
        icon: <CheckSquare className="h-4 w-4" />,
        permission: "assign_workout_plan" as Permission
      },
      { 
        href: "/fitness/diet-plans", 
        label: "Diet Plans", 
        icon: <Utensils className="h-4 w-4" />,
        permission: "assign_diet_plan" as Permission
      },
      { 
        href: "/fitness/member-progress", 
        label: "Member Progress", 
        icon: <Target className="h-4 w-4" />,
        permission: "view_member_profiles" as Permission
      }
    ]
  },
  {
    name: "Management",
    icon: <ListChecks className="h-4 w-4" />,
    items: [
      { 
        href: "/tasks", 
        label: "Tasks", 
        icon: <ListChecks className="h-4 w-4" />,
        permission: "manage_staff" as Permission
      },
      { 
        href: "/announcements", 
        label: "Announcements", 
        icon: <Megaphone className="h-4 w-4" />,
        permission: "feature_email_campaigns" as Permission
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
        href: "/profile", 
        label: "My Profile", 
        icon: <UserCog2 className="h-4 w-4" />,
        permission: "view_staff" as Permission
      }
    ]
  }
];
