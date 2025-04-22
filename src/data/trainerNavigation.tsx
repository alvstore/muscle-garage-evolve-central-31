import {
  Activity,
  CalendarDays,
  ClipboardList,
  Dumbbell,
  ListChecks,
  LayoutDashboard,
  Users,
  UserCog2,
  Menu as MenuIcon,
  Bell,
  Megaphone,
  Clock,
  Utensils,
  MessageSquare,
  CalendarRange,
  Target,
} from "lucide-react";

export const trainerNavSections = [
  {
    name: "Dashboard",
    links: [
      {
        title: "Overview",
        href: "/dashboard",
        icon: <LayoutDashboard className="h-4 w-4" />,
      },
    ],
  },
  {
    name: "Schedule",
    links: [
      {
        title: "Classes",
        href: "/trainers/classes",
        icon: <CalendarRange className="h-4 w-4" />,
      },
      {
        title: "Attendance",
        href: "/trainers/attendance",
        icon: <Clock className="h-4 w-4" />,
      },
    ],
  },
  {
    name: "Training",
    links: [
      {
        title: "Member Allocation",
        href: "/trainers/allocation",
        icon: <Users className="h-4 w-4" />,
      },
      {
        title: "PT Plans",
        href: "/trainers/pt-plans",
        icon: <Activity className="h-4 w-4" />,
      },
      {
        title: "Workout Plans",
        href: "/trainers/workout-plans",
        icon: <Dumbbell className="h-4 w-4" />,
      },
      {
        title: "Workout Assignments",
        href: "/trainers/workout-assignments",
        icon: <ClipboardList className="h-4 w-4" />,
      },
      {
        title: "Diet Plans",
        href: "/trainers/diet-plans",
        icon: <Utensils className="h-4 w-4" />,
      },
      {
        title: "Member Progress",
        href: "/trainers/member-progress",
        icon: <Target className="h-4 w-4" />,
      },
    ],
  },
  {
    name: "Management",
    links: [
      {
        title: "Tasks",
        href: "/trainers/tasks",
        icon: <ListChecks className="h-4 w-4" />,
      },
      {
        title: "Announcements",
        href: "/trainers/announcements",
        icon: <Megaphone className="h-4 w-4" />,
      },
      {
        title: "Notifications",
        href: "/trainers/notifications",
        icon: <Bell className="h-4 w-4" />,
      },
    ],
  },
  {
    name: "Profile",
    links: [
      {
        title: "My Profile",
        href: "/trainers/profile",
        icon: <UserCog2 className="h-4 w-4" />,
      },
    ],
  },
];
