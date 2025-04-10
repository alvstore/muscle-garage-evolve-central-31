
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  ClipboardList,
  CreditCard,
  Activity as ActivityIcon,
  DollarSign,
  Receipt,
  ArrowLeftRight,
  Package,
  Bell,
  MessageSquare,
  Heart,
  AlarmClock,
  Settings,
  User as UserIcon,
  CalendarCheck,
  UserPlus,
  Filter,
  MessageCircle,
  ShoppingBag,
  Tag,
  Gift,
  Home,
  ChevronRight,
  ChevronDown,
  ShoppingCart,
  LogOut,
  Circle,
  FileText,
  BarChart3,
  Calendar,
  Mail,
  MessageCircleMore,
  Kanban,
  Plus,
  FileEdit,
  List,
  Eye
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types";
import Logo from "@/components/Logo";
import { usePermissions, Permission } from "@/hooks/use-permissions";
import { RoutePermissionGuard } from "@/components/auth/PermissionGuard";
import { Badge } from "@/components/ui/badge";

interface DashboardSidebarProps {
  isSidebarOpen: boolean;
  closeSidebar: () => void;
}

// Define navigation categories
type NavCategory = {
  name: string;
  items: NavItem[];
};

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  badge?: number | string;
  children?: NavItem[];
  permission: Permission;
  isExpanded?: boolean;
}

export default function DashboardSidebar({ isSidebarOpen, closeSidebar }: DashboardSidebarProps) {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, logout } = useAuth();
  const { userRole, can } = usePermissions();
  
  // State to track expanded menu sections
  const [expandedSections, setExpandedSections] = useState<string[]>(['Dashboards']);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleSection = (sectionName: string) => {
    if (expandedSections.includes(sectionName)) {
      setExpandedSections(expandedSections.filter(name => name !== sectionName));
    } else {
      setExpandedSections([...expandedSections, sectionName]);
    }
  };

  const toggleItem = (itemName: string) => {
    if (expandedItems.includes(itemName)) {
      setExpandedItems(expandedItems.filter(name => name !== itemName));
    } else {
      setExpandedItems([...expandedItems, itemName]);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Define navigation categories
  const navCategories: NavCategory[] = [
    {
      name: "",
      items: [
        { 
          href: "/dashboard", 
          label: "Dashboards", 
          icon: <LayoutDashboard className="h-5 w-5" />, 
          badge: "5",
          permission: "access_dashboards",
          children: [
            { 
              href: "/dashboard", 
              label: "Analytics", 
              icon: <BarChart3 className="h-5 w-5" />, 
              permission: "access_dashboards" 
            },
            { 
              href: "/crm", 
              label: "CRM", 
              icon: <UserPlus className="h-5 w-5" />, 
              permission: "access_crm" 
            },
            { 
              href: "/store", 
              label: "Ecommerce", 
              icon: <ShoppingBag className="h-5 w-5" />,
              permission: "access_store",
            },
            { 
              href: "/classes", 
              label: "Academy", 
              icon: <Dumbbell className="h-5 w-5" />, 
              permission: "trainer_view_classes",
            },
            { 
              href: "/inventory", 
              label: "Logistics", 
              icon: <Package className="h-5 w-5" />,
              permission: "access_inventory",
            },
          ]
        },
        { 
          href: "/pages", 
          label: "Front Pages", 
          icon: <FileText className="h-5 w-5" />, 
          permission: "access_dashboards" 
        },
      ]
    },
    {
      name: "APPS & PAGES",
      items: [
        { 
          href: "/store", 
          label: "Ecommerce", 
          icon: <ShoppingCart className="h-5 w-5" />,
          permission: "access_store",
          children: [
            { 
              href: "/store", 
              label: "Store", 
              icon: <ShoppingBag className="h-5 w-5" />,
              permission: "access_store",
            },
            { 
              href: "/inventory", 
              label: "Inventory", 
              icon: <Package className="h-5 w-5" />,
              permission: "access_inventory",
            },
            { 
              href: "/marketing/promo", 
              label: "Promotions", 
              icon: <Tag className="h-5 w-5" />,
              permission: "access_marketing",
            },
          ]
        },
        { 
          href: "/classes", 
          label: "Academy", 
          icon: <Dumbbell className="h-5 w-5" />, 
          permission: "trainer_view_classes",
          children: [
            { 
              href: "/classes", 
              label: "Classes", 
              icon: <ClipboardList className="h-5 w-5" />, 
              permission: "trainer_view_classes",
            },
            { 
              href: "/fitness-plans", 
              label: "Fitness Plans", 
              icon: <ActivityIcon className="h-5 w-5" />, 
              permission: "trainer_edit_fitness",
            },
          ]
        },
        { 
          href: "/inventory", 
          label: "Logistics", 
          icon: <Package className="h-5 w-5" />,
          permission: "access_inventory",
          children: [
            { 
              href: "/inventory", 
              label: "Inventory", 
              icon: <Package className="h-5 w-5" />,
              permission: "access_inventory",
            },
            { 
              href: "/marketing/referral", 
              label: "Referral Program", 
              icon: <Gift className="h-5 w-5" />,
              permission: "access_marketing",
            },
          ]
        },
        { 
          href: "/communication", 
          label: "Email", 
          icon: <Mail className="h-5 w-5" />, 
          permission: "access_communication" 
        },
        { 
          href: "/communication/announcements", 
          label: "Chat", 
          icon: <MessageCircleMore className="h-5 w-5" />, 
          permission: "access_communication" 
        },
        { 
          href: "/attendance", 
          label: "Calendar", 
          icon: <Calendar className="h-5 w-5" />, 
          permission: "view_all_attendance" 
        },
        { 
          href: "/crm/funnel", 
          label: "Kanban", 
          icon: <Kanban className="h-5 w-5" />, 
          permission: "access_crm" 
        },
        { 
          href: "/finance/invoices", 
          label: "Invoice", 
          icon: <Receipt className="h-5 w-5" />, 
          permission: "view_invoices",
          children: [
            { 
              href: "/finance/invoices", 
              label: "List", 
              icon: <List className="h-5 w-5" />, 
              permission: "view_invoices" 
            },
            { 
              href: "/finance/invoices/preview", 
              label: "Preview", 
              icon: <Eye className="h-5 w-5" />, 
              permission: "view_invoices" 
            },
            { 
              href: "/finance/invoices/edit", 
              label: "Edit", 
              icon: <FileEdit className="h-5 w-5" />, 
              permission: "manage_payments" 
            },
            { 
              href: "/finance/invoices/add", 
              label: "Add", 
              icon: <Plus className="h-5 w-5" />, 
              permission: "manage_payments" 
            },
          ]
        },
        { 
          href: "/members", 
          label: "Members", 
          icon: <Users className="h-5 w-5" />, 
          permission: "manage_members" 
        },
        { 
          href: "/trainers", 
          label: "Trainers", 
          icon: <Dumbbell className="h-5 w-5" />, 
          permission: "view_all_trainers" 
        },
        { 
          href: "/memberships", 
          label: "Memberships", 
          icon: <CreditCard className="h-5 w-5" />, 
          permission: "member_view_plans" 
        },
        { 
          href: "/settings", 
          label: "Settings", 
          icon: <Settings className="h-5 w-5" />, 
          permission: "access_own_resources" 
        },
      ]
    },
  ];
  
  const filteredCategories = navCategories.map(category => {
    // Filter items based on user permissions
    const filteredItems = category.items.filter(item => {
      // If the item has children, include it if at least one child is accessible
      if (item.children && item.children.length > 0) {
        const accessibleChildren = item.children.filter(child => can(child.permission));
        return accessibleChildren.length > 0 || can(item.permission);
      }
      return can(item.permission);
    });
    
    return {
      ...category,
      items: filteredItems
    };
  }).filter(category => category.items.length > 0);

  return (
    <Sheet open={isSidebarOpen} onOpenChange={closeSidebar}>
      <SheetContent side="left" className="w-64 p-0 bg-[#283046] text-white border-none">
        <div className="flex flex-col h-full">
          {/* Sidebar Header with Logo */}
          <div className="p-4 flex items-center gap-3 border-b border-gray-700">
            <div className="bg-indigo-600 p-1 rounded-md">
              <Logo variant="white" className="w-10 h-10" />
            </div>
            <h1 className="text-xl font-semibold text-white">Vuexy</h1>
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-auto text-gray-400 hover:text-white hover:bg-transparent"
            >
              <Circle className="h-5 w-5 fill-current" />
            </Button>
          </div>
          
          {/* Sidebar Navigation */}
          <div className="flex-1 overflow-y-auto py-2">
            {filteredCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-4">
                {/* Category Header */}
                {category.name && (
                  <div className="px-4 py-2 text-xs font-semibold text-gray-400 tracking-wider">
                    {category.name}
                  </div>
                )}
                
                {/* Category Items */}
                <div className="space-y-1">
                  {category.items.map((item, itemIndex) => {
                    // Check if this item has accessible children
                    const hasChildren = item.children && item.children.length > 0;
                    const filteredChildren = hasChildren 
                      ? item.children!.filter(child => can(child.permission))
                      : [];
                    const showChildren = hasChildren && filteredChildren.length > 0;
                    const isExpanded = expandedSections.includes(item.label);
                    
                    return (
                      <RoutePermissionGuard 
                        key={itemIndex} 
                        permission={item.permission}
                      >
                        <div className="mb-1">
                          {/* Parent Item */}
                          <button
                            onClick={() => showChildren ? toggleSection(item.label) : navigate(item.href)}
                            className={`w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-[#1e2740] transition-colors ${isExpanded && 'bg-[#1e2740]'}`}
                          >
                            <div className="flex items-center gap-2">
                              {item.icon}
                              <span>{item.label}</span>
                            </div>
                            <div className="flex items-center">
                              {item.badge && (
                                <Badge variant="default" className="mr-2 bg-red-500 hover:bg-red-600">
                                  {item.badge}
                                </Badge>
                              )}
                              {showChildren && (
                                isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )
                              )}
                            </div>
                          </button>
                          
                          {/* Child Items */}
                          {showChildren && isExpanded && (
                            <div className="mt-1 py-1 bg-[#161d31]">
                              {filteredChildren.map((child, childIndex) => (
                                <RoutePermissionGuard 
                                  key={childIndex} 
                                  permission={child.permission}
                                >
                                  <NavLink
                                    to={child.href}
                                    className={({ isActive }) => `
                                      flex items-center gap-2 py-2 px-10 text-sm my-1 transition-colors
                                      ${isActive 
                                        ? 'text-indigo-400 font-medium' 
                                        : 'text-gray-300 hover:text-white'}
                                    `}
                                    onClick={closeSidebar}
                                  >
                                    <Circle className="h-2 w-2" />
                                    <span>{child.label}</span>
                                  </NavLink>
                                </RoutePermissionGuard>
                              ))}
                            </div>
                          )}
                        </div>
                      </RoutePermissionGuard>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          {/* Sidebar Footer */}
          <div className="mt-auto p-4">
            <Separator className="my-2 bg-gray-700" />
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#1e2740]"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="mr-2 h-5 w-5" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
