
import React from 'react';
import { NavSection } from '@/types/navigation';
import {
  BarChart,
  CalendarCheck,
  Users,
  Settings,
  Dumbbell,
  Bell,
  PanelTop,
  Scale,
  BadgeCheck,
  Clipboard,
  Mail,
  Heart,
  UserCog,
  CreditCard,
  Gauge
} from 'lucide-react';
import { Permission } from '@/hooks/use-permissions';

export const trainerNavSections: NavSection[] = [
  {
    name: "Dashboard",
    items: [
      {
        href: "/dashboard",
        label: "Overview",
        icon: <BarChart className="w-5 h-5" />,
        permission: 'access_dashboards' as Permission,
      }
    ]
  },
  {
    name: "Attendance",
    items: [
      {
        href: "/attendance",
        label: "Attendance",
        icon: <CalendarCheck className="w-5 h-5" />,
        permission: 'view_all_attendance' as Permission,
      }
    ]
  },
  {
    name: "Members",
    items: [
      {
        href: "/members",
        label: "My Members",
        icon: <Users className="w-5 h-5" />,
        permission: 'view_all_trainers' as Permission,
      }
    ]
  },
  {
    name: "Fitness Plans",
    items: [
      {
        href: "/fitness-plans",
        label: "Fitness Plans",
        icon: <Dumbbell className="w-5 h-5" />,
        permission: 'manage_fitness_data' as Permission,
      },
      {
        href: "/fitness/workout-plans",
        label: "Workout Plans",
        icon: <Gauge className="w-5 h-5" />,
        permission: 'manage_fitness_data' as Permission,
      },
      {
        href: "/fitness/diet-plans",
        label: "Diet Plans",
        icon: <BadgeCheck className="w-5 h-5" />,
        permission: 'manage_fitness_data' as Permission,
      },
      {
        href: "/fitness/progress",
        label: "Progress Tracking",
        icon: <Scale className="w-5 h-5" />,
        permission: 'manage_fitness_data' as Permission,
      },
      {
        href: "/members/progress",
        label: "Member Progress",
        icon: <Clipboard className="w-5 h-5" />,
        permission: 'view_all_trainers' as Permission,
      }
    ]
  },
  {
    name: "Communication",
    items: [
      {
        href: "/communication/tasks",
        label: "Tasks",
        icon: <PanelTop className="w-5 h-5" />,
        permission: 'view_staff' as Permission,
      },
      {
        href: "/communication/announcements",
        label: "Announcements",
        icon: <Bell className="w-5 h-5" />,
        permission: 'access_communication' as Permission,
      },
      {
        href: "/communication/email",
        label: "Email",
        icon: <Mail className="w-5 h-5" />,
        permission: 'access_communication' as Permission,
      }
    ]
  },
  {
    name: "My Account",
    items: [
      {
        href: "/profile",
        label: "Profile",
        icon: <UserCog className="w-5 h-5" />,
        permission: 'member_view_plans' as Permission,
      }
    ]
  }
];
