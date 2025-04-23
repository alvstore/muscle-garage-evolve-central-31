
import { NavSection } from "@/types/navigation";
import { Permission } from "@/hooks/use-permissions";

export const memberNavSections: NavSection[] = [
  {
    name: "Dashboard",
    items: [
      { 
        href: "/dashboard", 
        label: "Overview", 
        icon: "Home",
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
        icon: "User",
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
        icon: "Calendar",
        permission: "member_book_classes" as Permission
      },
      { 
        href: "/attendance", 
        label: "Attendance", 
        icon: "Activity",
        permission: "member_view_attendance" as Permission
      },
      { 
        href: "/fitness/progress", 
        label: "Progress Tracker", 
        icon: "TrendingUp",
        permission: "member_view_profile" as Permission
      },
      { 
        href: "/fitness/workout-plans", 
        label: "Workout Plans", 
        icon: "Activity",
        permission: "member_view_plans" as Permission
      },
      { 
        href: "/fitness/diet", 
        label: "Diet Plan", 
        icon: "Utensils",
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
        icon: "FileText",
        permission: "member_view_invoices" as Permission
      },
      { 
        href: "/membership", 
        label: "Membership", 
        icon: "CreditCard",
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
        icon: "ShoppingBag",
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
        icon: "MessageCircle",
        permission: "access_communication" as Permission
      },
      { 
        href: "/communication/announcements", 
        label: "Announcements", 
        icon: "Bell",
        permission: "access_communication" as Permission
      },
    ],
  },
];
