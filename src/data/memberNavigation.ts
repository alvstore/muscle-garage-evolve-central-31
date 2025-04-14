
import { ReactNode } from "react";
import { createNavIcon } from "@/utils/createNavIcon";
import { NavItem, NavSection } from "@/types/navigation";
import { Permission } from "@/hooks/use-permissions";

export const memberNavSections: NavSection[] = [
  {
    name: "Dashboard",
    items: [
      { 
        href: "/dashboard", 
        label: "Overview", 
        icon: createNavIcon("Home"),
        permission: "feature_member_dashboard" as Permission
      },
    ],
  },
  {
    name: "My Profile",
    items: [
      { 
        href: "/members/profile", 
        label: "Profile", 
        icon: createNavIcon("User"),
        permission: "member_view_profile" as Permission
      },
    ],
  },
  {
    name: "Fitness & Classes",
    items: [
      { 
        href: "/classes", 
        label: "Book Classes", 
        icon: createNavIcon("Calendar"),
        permission: "member_book_classes" as Permission
      },
      { 
        href: "/attendance", 
        label: "Attendance", 
        icon: createNavIcon("Activity"),
        permission: "member_view_attendance" as Permission
      },
      { 
        href: "/fitness/progress", 
        label: "Progress Tracker", 
        icon: createNavIcon("TrendingUp"),
        permission: "member_view_profile" as Permission
      },
      { 
        href: "/fitness/workout-plans", 
        label: "Workout Plans", 
        icon: createNavIcon("Activity"),
        permission: "member_view_plans" as Permission
      },
      { 
        href: "/fitness/diet", 
        label: "Diet Plan", 
        icon: createNavIcon("Utensils"),
        permission: "member_view_plans" as Permission
      },
    ],
  },
  {
    name: "Finance",
    items: [
      { 
        href: "/finance/invoices", 
        label: "Invoices", 
        icon: createNavIcon("FileText"),
        permission: "member_view_invoices" as Permission
      },
      { 
        href: "/membership", 
        label: "Membership", 
        icon: createNavIcon("CreditCard"),
        permission: "member_view_plans" as Permission
      },
    ],
  },
  {
    name: "Store",
    items: [
      { 
        href: "/store", 
        label: "Shop", 
        icon: createNavIcon("ShoppingBag"),
        permission: "access_store" as Permission
      },
    ],
  },
  {
    name: "Communication",
    items: [
      { 
        href: "/communication/feedback", 
        label: "Feedback", 
        icon: createNavIcon("MessageSquare"),
        permission: "access_communication" as Permission
      },
      { 
        href: "/communication/announcements", 
        label: "Announcements", 
        icon: createNavIcon("Bell"),
        permission: "access_communication" as Permission
      },
    ],
  },
];
