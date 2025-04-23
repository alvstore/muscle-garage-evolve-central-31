
import { NavSection } from '@/types/navigation';
import { Permission } from '@/hooks/use-permissions';

export const memberNavSections: NavSection[] = [
  {
    name: "Dashboard",
    items: [
      { 
        href: "/dashboard", 
        label: "Dashboard", 
        icon: "LayoutDashboard", 
        permission: "access_dashboards" as Permission
      }
    ]
  },
  {
    name: "Fitness",
    items: [
      { 
        href: "/fitness-plans", 
        label: "My Fitness Plan", 
        icon: "Dumbbell", 
        permission: "access_own_resources" as Permission
      },
      { 
        href: "/fitness/progress", 
        label: "My Progress", 
        icon: "Activity", 
        permission: "access_own_resources" as Permission
      },
      { 
        href: "/fitness/diet", 
        label: "Diet Plan", 
        icon: "ClipboardList", 
        permission: "access_own_resources" as Permission
      }
    ]
  },
  {
    name: "Membership",
    items: [
      { 
        href: "/classes", 
        label: "Book Classes", 
        icon: "CalendarDays", 
        permission: "member_book_classes" as Permission
      },
      { 
        href: "/memberships", 
        label: "Membership Plans", 
        icon: "CreditCard", 
        permission: "member_view_plans" as Permission
      },
      { 
        href: "/finance/invoices", 
        label: "Invoices", 
        icon: "Receipt", 
        permission: "member_view_invoices" as Permission 
      },
      { 
        href: "/attendance", 
        label: "Attendance", 
        icon: "CalendarDays", 
        permission: "member_view_attendance" as Permission
      }
    ]
  },
  {
    name: "Profile",
    items: [
      { 
        href: "/profile", 
        label: "My Profile", 
        icon: "User", 
        permission: "member_view_profile" as Permission 
      },
      { 
        href: "/communication/feedback", 
        label: "Provide Feedback", 
        icon: "MessageSquare", 
        permission: "access_communication" as Permission
      },
      { 
        href: "/communication/announcements", 
        label: "Announcements", 
        icon: "Bell", 
        permission: "access_communication" as Permission
      }
    ]
  }
];
