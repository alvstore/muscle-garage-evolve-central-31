import React from 'react';
import {
  BarChart3,
  Users,
  CalendarDays,
  Dumbbell,
  Clock,
  Bell,
  Activity,
  FileText,
  Megaphone,
  UserCog2,
  ListChecks,
  Utensils,
  Target,
  CheckSquare,
  MessageCircle,
  CreditCard,
  BanknoteIcon,
  WalletIcon
} from "lucide-react";
import { NavSection } from '@/types/navigation';
import { Permission } from '@/hooks/use-permissions';

export const staffNavSections: NavSection[] = [
  {
    name: "Dashboard",
    icon: <BarChart3 className="h-4 w-4" />,
    items: [
      { 
        href: "/dashboard", 
        label: "Dashboard", 
        icon: <BarChart3 className="h-4 w-4" />,
        permission: "feature_staff_dashboard" as Permission
      }
    ]
  },
  {
    name: "Finance",
    icon: <WalletIcon className="h-4 w-4" />,
    items: [
      { 
        href: "/finance/invoices", 
        label: "Invoices", 
        icon: <FileText className="h-4 w-4" />,
        permission: "view_invoices" as Permission
      },
      { 
        href: "/finance/transactions", 
        label: "Transactions", 
        icon: <CreditCard className="h-4 w-4" />,
        permission: "manage_transactions" as Permission
      },
      { 
        href: "/finance/income-records", 
        label: "Income Records", 
        icon: <BanknoteIcon className="h-4 w-4" />,
        permission: "manage_income" as Permission
      },
      { 
        href: "/finance/expense-records", 
        label: "Expense Records", 
        icon: <WalletIcon className="h-4 w-4" />,
        permission: "manage_expenses" as Permission
      }
    ]
  },
  {
    name: "Members",
    icon: <Users className="h-4 w-4" />,
    items: [
      { 
        href: "/members", 
        label: "Member Management", 
        icon: <Users className="h-4 w-4" />,
        permission: "manage_members" as Permission
      },
      { 
        href: "/members/attendance", 
        label: "Attendance", 
        icon: <Clock className="h-4 w-4" />,
        permission: "view_all_attendance" as Permission
      }
    ]
  },
  {
    name: "Classes",
    icon: <CalendarDays className="h-4 w-4" />,
    items: [
      { 
        href: "/classes", 
        label: "Class Schedule", 
        icon: <CalendarDays className="h-4 w-4" />,
        permission: "view_classes" as Permission
      }
    ]
  },
  {
    name: "Fitness",
    icon: <Dumbbell className="h-4 w-4" />,
    items: [
      { 
        href: "/fitness/workout-plans", 
        label: "Workout Plans", 
        icon: <Dumbbell className="h-4 w-4" />,
        permission: "manage_fitness_data" as Permission
      },
      { 
        href: "/fitness/diet-plans", 
        label: "Diet Plans", 
        icon: <Utensils className="h-4 w-4" />,
        permission: "manage_fitness_data" as Permission
      },
      { 
        href: "/fitness/member-progress", 
        label: "Member Progress", 
        icon: <Target className="h-4 w-4" />,
        permission: "view_member_profiles" as Permission
      }
    ]
  },
  {
    name: "Communication",
    icon: <Bell className="h-4 w-4" />,
    items: [
      { 
        href: "/communication/announcements", 
        label: "Announcements", 
        icon: <Megaphone className="h-4 w-4" />,
        permission: "access_communication" as Permission
      },
      { 
        href: "/communication/feedback", 
        label: "Feedback Management", 
        icon: <MessageCircle className="h-4 w-4" />,
        permission: "access_communication" as Permission
      },
      { 
        href: "/communication/notifications", 
        label: "Notifications", 
        icon: <Bell className="h-4 w-4" />,
        permission: "access_communication" as Permission
      },
      { 
        href: "/communication/tasks", 
        label: "Task Manager", 
        icon: <ListChecks className="h-4 w-4" />,
        permission: "access_communication" as Permission
      }
    ]
  }
];
