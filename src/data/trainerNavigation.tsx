
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
  Dumbbell,
  FileText,
  CheckSquare
} from "lucide-react";
import { NavSection } from '@/types/navigation';
import { Permission } from '@/hooks/use-permissions';

// Helper function to safely cast permission strings
const asPermission = (p: string): Permission => p as Permission;

export const trainerNavSections: NavSection[] = [
  {
    name: "Dashboard",
    items: [
      { 
        href: "/dashboard", 
        label: "Dashboard", 
        icon: <LayoutDashboard className="h-4 w-4" />,
        permission: asPermission("feature_trainer_dashboard")
      }
    ]
  },
  {
    name: "Schedule",
    items: [
      { 
        href: "/trainers/classes", 
        label: "Classes", 
        icon: <CalendarDays className="h-4 w-4" />,
        permission: asPermission("trainer_view_classes")
      },
      { 
        href: "/trainers/attendance", 
        label: "Attendance", 
        icon: <Clock className="h-4 w-4" />,
        permission: asPermission("trainer_view_attendance")
      }
    ]
  },
  {
    name: "Training",
    items: [
      { 
        href: "/trainers/allocation", 
        label: "Member Allocation", 
        icon: <Users className="h-4 w-4" />,
        permission: asPermission("trainer_view_members")
      },
      { 
        href: "/trainers/pt-plans", 
        label: "PT Plans", 
        icon: <FileText className="h-4 w-4" />,
        permission: asPermission("trainer_edit_fitness")
      },
      { 
        href: "/trainers/workout-plans", 
        label: "Workout Plans", 
        icon: <Dumbbell className="h-4 w-4" />,
        permission: asPermission("trainer_edit_fitness")
      },
      { 
        href: "/trainers/workout-assignments", 
        label: "Workout Assignments", 
        icon: <CheckSquare className="h-4 w-4" />,
        permission: asPermission("trainer_edit_fitness")
      },
      { 
        href: "/trainers/diet-plans", 
        label: "Diet Plans", 
        icon: <Utensils className="h-4 w-4" />,
        permission: asPermission("trainer_edit_fitness")
      },
      { 
        href: "/trainers/member-progress", 
        label: "Member Progress", 
        icon: <Target className="h-4 w-4" />,
        permission: asPermission("trainer_view_members")
      }
    ]
  },
  {
    name: "Management",
    items: [
      { 
        href: "/trainers/tasks", 
        label: "Tasks", 
        icon: <ListChecks className="h-4 w-4" />,
        permission: asPermission("manage_staff")
      },
      { 
        href: "/trainers/announcements", 
        label: "Announcements", 
        icon: <Megaphone className="h-4 w-4" />,
        permission: asPermission("feature_email_campaigns")
      },
      { 
        href: "/communication/notifications", 
        label: "Notifications", 
        icon: <Bell className="h-4 w-4" />,
        permission: asPermission("access_communication")
      }
    ]
  },
  {
    name: "Profile",
    items: [
      { 
        href: "/trainers/profile", 
        label: "My Profile", 
        icon: <UserCog2 className="h-4 w-4" />,
        permission: asPermission("view_staff")
      }
    ]
  }
];
