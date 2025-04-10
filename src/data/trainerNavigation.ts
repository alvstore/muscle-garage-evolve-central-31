
import { ReactNode } from "react";
import { createNavIcon, IconName } from "@/utils/createNavIcon";

export interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  activeIcon?: ReactNode;
  badge?: number | string;
  children?: NavItem[];
}

export interface NavSection {
  name: string;
  icon: ReactNode;
  items: NavItem[];
}

export const trainerNavSections: NavSection[] = [
  {
    name: "Dashboard",
    icon: createNavIcon("Home"),
    items: [
      { 
        href: "/dashboard", 
        label: "Overview", 
        icon: createNavIcon("Home")
      },
      { 
        href: "/trainers/tasks", 
        label: "Task Management", 
        icon: createNavIcon("ListTodo")
      },
    ],
  },
  {
    name: "My Profile",
    icon: createNavIcon("User"),
    items: [
      { 
        href: "/trainers/profile", 
        label: "Profile", 
        icon: createNavIcon("User")
      },
      { 
        href: "/trainers/attendance", 
        label: "My Attendance", 
        icon: createNavIcon("Calendar")
      },
    ],
  },
  {
    name: "Members",
    icon: createNavIcon("Users"),
    items: [
      { 
        href: "/members", 
        label: "All Members", 
        icon: createNavIcon("Users")
      },
      { 
        href: "/trainers/allocation", 
        label: "Member Allocation", 
        icon: createNavIcon("UserCircle")
      },
      { 
        href: "/trainers/pt-plans", 
        label: "PT Plans", 
        icon: createNavIcon("Dumbbell")
      },
    ],
  },
  {
    name: "Fitness & Diet",
    icon: createNavIcon("Activity"),
    items: [
      { 
        href: "/classes", 
        label: "Classes", 
        icon: createNavIcon("Calendar")
      },
      { 
        href: "/fitness/workout-plans", 
        label: "Workout Plans", 
        icon: createNavIcon("Activity")
      },
      { 
        href: "/fitness/diet", 
        label: "Diet Plans", 
        icon: createNavIcon("ChefHat")
      },
    ],
  },
  {
    name: "Communication",
    icon: createNavIcon("Bell"),
    items: [
      { 
        href: "/communication/announcements", 
        label: "Announcements", 
        icon: createNavIcon("Bell")
      },
      { 
        href: "/communication/motivational", 
        label: "Motivational", 
        icon: createNavIcon("TrendingUp")
      },
    ],
  },
];
