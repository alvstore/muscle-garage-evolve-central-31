
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

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  label?: string;
}

export interface NavSection {
  name: string;
  items: NavItem[];
}

export const memberNavSections: NavSection[] = [
  {
    name: "Dashboard",
    items: [
      {
        name: "Overview",
        href: "/",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    name: "Fitness & Classes",
    items: [
      {
        name: "Book Classes",
        href: "/classes",
        icon: Calendar,
      },
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

// For backward compatibility
export const memberNavigation = [
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
