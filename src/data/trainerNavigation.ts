
import { ReactNode } from "react";
import { createNavIcon } from "@/utils/createNavIcon";
import { NavItem, NavSection } from "@/types/navigation";
import { Permission } from "@/hooks/use-permissions";

export const trainerNavSections: NavSection[] = [
  {
    name: "Dashboard",
    items: [
      { 
        href: "/dashboard", 
        label: "Overview", 
        icon: createNavIcon("Home"),
        permission: "feature_trainer_dashboard" as Permission
      },
      { 
        href: "/trainers/tasks", 
        label: "Task Management", 
        icon: createNavIcon("ListTodo"),
        badge: "3", // Number of pending tasks
        permission: "trainer_view_classes" as Permission
      },
    ],
  },
  {
    name: "My Profile",
    items: [
      { 
        href: "/trainers/profile", 
        label: "Profile", 
        icon: createNavIcon("User"),
        permission: "access_own_resources" as Permission
      },
      { 
        href: "/trainers/attendance", 
        label: "My Attendance", 
        icon: createNavIcon("Calendar"),
        permission: "trainer_view_attendance" as Permission
      },
    ],
  },
  {
    name: "Members",
    items: [
      { 
        href: "/trainers/allocation", 
        label: "My Assigned Members", 
        icon: createNavIcon("UserCircle"),
        permission: "trainer_view_members" as Permission
      },
      { 
        href: "/trainers/pt-plans", 
        label: "PT Plans", 
        icon: createNavIcon("Dumbbell"),
        permission: "trainer_edit_fitness" as Permission
      },
    ],
  },
  {
    name: "Fitness & Diet",
    items: [
      { 
        href: "/classes", 
        label: "Classes", 
        icon: createNavIcon("Calendar"),
        permission: "trainer_view_classes" as Permission
      },
      { 
        href: "/fitness/workout-plans", 
        label: "Workout Plans", 
        icon: createNavIcon("Activity"),
        permission: "trainer_edit_fitness" as Permission
      },
      { 
        href: "/fitness/diet", 
        label: "Diet Plans", 
        icon: createNavIcon("ChefHat"),
        permission: "trainer_edit_fitness" as Permission
      },
    ],
  },
  {
    name: "Communication",
    items: [
      { 
        href: "/communication/announcements", 
        label: "Announcements", 
        icon: createNavIcon("Bell"),
        permission: "access_communication" as Permission
      },
      { 
        href: "/communication/notifications", 
        label: "My Notifications", 
        icon: createNavIcon("MessageCircle"),
        badge: "5", // Number of unread notifications
        permission: "access_communication" as Permission
      },
    ],
  },
];
