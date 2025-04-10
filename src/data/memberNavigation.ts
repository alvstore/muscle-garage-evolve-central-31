import {
  BarChart3,
  Calendar,
  Dumbbell,
  DumbbellIcon,
  LayoutDashboard,
  LineChart,
  ListChecks,
  LucideIcon,
  MessageSquare,
  Settings,
  User,
  Users,
  Apple,
} from "lucide-react";

interface SidebarNavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarNavGroup {
  name: string;
  items: SidebarNavItem[];
}

export const memberNavigation: SidebarNavGroup[] = [
  {
    name: "General",
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    name: "Classes",
    items: [
      {
        name: "Book a Class",
        href: "/classes/book",
        icon: Calendar,
      },
      {
        name: "My Classes",
        href: "/classes/my-classes",
        icon: ListChecks,
      },
    ],
  },
  {
    name: "Fitness",
    items: [
      {
        name: "Workout Plans",
        href: "/fitness/workout-plans",
        icon: Dumbbell,
      },
      {
        name: "Diet Plans",
        href: "/fitness/diet-plans",
        icon: Apple,
      },
      {
        name: "Progress Tracker",
        href: "/fitness/progress",
        icon: LineChart,
      },
    ],
  },
  {
    name: "Account",
    items: [
      {
        name: "Profile",
        href: "/profile",
        icon: User,
      },
      {
        name: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];
