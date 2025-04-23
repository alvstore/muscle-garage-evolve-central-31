
import { NavSection } from '@/types/navigation';
import { Permission } from '@/hooks/use-permissions';

export const trainerNavSections: NavSection[] = [
  {
    name: "Dashboard",
    items: [
      {
        href: "/dashboard",
        label: "Overview",
        icon: "BarChart",
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
        icon: "CalendarCheck",
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
        icon: "Users",
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
        icon: "Dumbbell",
        permission: 'manage_fitness_data' as Permission,
      },
      {
        href: "/fitness/workout-plans",
        label: "Workout Plans",
        icon: "Gauge",
        permission: 'manage_fitness_data' as Permission,
      },
      {
        href: "/fitness/diet-plans",
        label: "Diet Plans",
        icon: "BadgeCheck",
        permission: 'manage_fitness_data' as Permission,
      },
      {
        href: "/fitness/progress",
        label: "Progress Tracking",
        icon: "Scale",
        permission: 'manage_fitness_data' as Permission,
      },
      {
        href: "/members/progress",
        label: "Member Progress",
        icon: "Clipboard",
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
        icon: "PanelTop",
        permission: 'view_staff' as Permission,
      },
      {
        href: "/communication/announcements",
        label: "Announcements",
        icon: "Bell",
        permission: 'access_communication' as Permission,
      },
      {
        href: "/communication/email",
        label: "Email",
        icon: "Mail",
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
        icon: "UserCog",
        permission: 'member_view_plans' as Permission,
      }
    ]
  }
];
