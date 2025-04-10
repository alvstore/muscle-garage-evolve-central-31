import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  ClipboardList,
  Users,
  Calendar,
  UserCircle,
  DumbbellIcon,
  ClipboardEdit,
  ShoppingCart,
  FileText,
  UserPlus,
  Bell,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Logo from "@/components/Logo";
import { UserRole } from "@/types";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
  submenu?: SidebarItem[];
}

interface SidebarProps {
  userRole: UserRole;
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
    roles: ["admin", "staff", "trainer", "member"],
  },
  {
    title: "Member Management",
    href: "/members",
    icon: Users,
    roles: ["admin", "staff"],
    submenu: [
      {
        title: "All Members",
        href: "/members",
        icon: Users,
        roles: ["admin", "staff"],
      },
      {
        title: "Add Member",
        href: "/members/add",
        icon: UserPlus,
        roles: ["admin", "staff"],
      },
      {
        title: "Memberships",
        href: "/memberships",
        icon: FileText,
        roles: ["admin", "staff"],
      },
    ],
  },
  {
    title: "Trainer & Classes",
    href: "/classes",
    icon: Calendar,
    roles: ["admin", "staff", "trainer", "member"],
    submenu: [
      {
        title: "All Classes",
        href: "/classes",
        icon: Calendar,
        roles: ["admin", "staff", "trainer", "member"],
      },
      {
        title: "Trainers",
        href: "/trainers",
        icon: UserCircle,
        roles: ["admin", "staff"],
      },
    ],
  },
  {
    title: "Attendance",
    href: "/attendance",
    icon: ClipboardList,
    roles: ["admin", "staff"],
  },
  {
    title: "Fitness & Diet Plans",
    href: "/fitness-plans",
    icon: DumbbellIcon,
    roles: ["admin", "staff", "trainer", "member"],
    submenu: [
      {
        title: "Workout Plans",
        href: "/fitness-plans/workout",
        icon: DumbbellIcon,
        roles: ["admin", "staff", "trainer", "member"],
      },
      {
        title: "Diet Plans",
        href: "/fitness-plans/diet",
        icon: ClipboardEdit,
        roles: ["admin", "staff", "trainer", "member"],
      },
      {
        title: "Progress Tracking",
        href: "/fitness-plans/progress",
        icon: BarChart3,
        roles: ["admin", "staff", "trainer", "member"],
      },
    ],
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: ShoppingCart,
    roles: ["admin", "staff"],
  },
  {
    title: "Finance",
    href: "/finance",
    icon: FileText,
    roles: ["admin", "staff"],
    submenu: [
      {
        title: "Invoices",
        href: "/invoices",
        icon: FileText,
        roles: ["admin", "staff"],
      },
      {
        title: "Expenses",
        href: "/transactions",
        icon: FileText,
        roles: ["admin", "staff"],
      },
      {
        title: "Income",
        href: "/transactions",
        icon: FileText,
        roles: ["admin", "staff"],
      },
    ],
  },
  {
    title: "CRM & Leads",
    href: "/leads",
    icon: UserPlus,
    roles: ["admin", "staff"],
  },
  {
    title: "Announcements",
    href: "/announcements",
    icon: Bell,
    roles: ["admin", "staff"],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["admin", "staff", "trainer", "member"],
  },
];

const DashboardSidebar = ({
  userRole,
  isMobile,
  isOpen,
  onClose,
}: SidebarProps) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );

  const filteredItems = sidebarItems.filter((item) =>
    item.roles.includes(userRole)
  );

  const toggleSubMenu = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isActive = (href: string) => {
    if (href === "/dashboard" && location.pathname === "/") {
      return true;
    }
    return location.pathname === href || location.pathname.startsWith(href + "/");
  };

  const handleLinkClick = () => {
    if (isMobile) {
      onClose();
    }
  };

  const SidebarContent = (
    <>
      <div className="flex h-14 items-center border-b px-6">
        <Logo />
      </div>
      <ScrollArea className="h-[calc(100vh-3.5rem)] px-2 py-4">
        <div className="space-y-1 px-2">
          {filteredItems.map((item) => (
            <div key={item.title} className="mb-1">
              {item.submenu ? (
                <>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      isActive(item.href) &&
                        "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    )}
                    onClick={() => toggleSubMenu(item.title)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                    {expandedItems[item.title] ? (
                      <ChevronDown className="ml-auto h-4 w-4" />
                    ) : (
                      <ChevronRight className="ml-auto h-4 w-4" />
                    )}
                  </Button>
                  {expandedItems[item.title] && (
                    <div className="mt-1 ml-4 pl-4 border-l border-gray-300 dark:border-gray-700 space-y-1">
                      {item.submenu
                        .filter((subitem) => subitem.roles.includes(userRole))
                        .map((subitem) => (
                          <Link
                            key={subitem.href}
                            to={subitem.href}
                            onClick={handleLinkClick}
                          >
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                isActive(subitem.href) &&
                                  "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                              )}
                            >
                              <subitem.icon className="mr-2 h-4 w-4" />
                              {subitem.title}
                            </Button>
                          </Link>
                        ))}
                    </div>
                  )}
                </>
              ) : (
                <Link to={item.href} onClick={handleLinkClick}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      isActive(item.href) &&
                        "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </>
  );

  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/80"
            onClick={onClose}
          ></div>
        )}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-sidebar transition-transform duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {SidebarContent}
        </div>
      </>
    );
  }

  return (
    <div className="hidden border-r bg-sidebar md:block md:w-64">
      {SidebarContent}
    </div>
  );
};

export default DashboardSidebar;
