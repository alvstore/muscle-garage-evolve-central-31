
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
  Activity,
  DollarSign,
  Receipt,
  ArrowLeftRight,
  Package,
  Bell,
  MessageSquare,
  CalendarCheck,
  UserPlus,
  ShoppingBag,
  Gift,
  Home,
  ChevronRight,
  ChevronDown,
  LogOut,
  Circle,
  BarChart3,
  CalendarDays,
  Settings,
  Eye,
  FileText,
  Store,
  MessageCircle
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
  
  const [expandedSections, setExpandedSections] = useState<string[]>(['Dashboard']);
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

  const navCategories: NavCategory[] = [
    {
      name: "",
      items: [
        { 
          href: "/dashboard", 
          label: "Dashboard", 
          icon: <LayoutDashboard className="h-5 w-5" />, 
          permission: "access_dashboards"
        },
        { 
          href: "/dashboard/overview", 
          label: "Overview", 
          icon: <Eye className="h-5 w-5" />, 
          permission: "access_dashboards" 
        },
      ]
    },
    {
      name: "GYM MANAGEMENT",
      items: [
        { 
          href: "/members", 
          label: "Members & Trainers", 
          icon: <Users className="h-5 w-5" />,
          badge: "328",
          permission: "manage_members",
          children: [
            { 
              href: "/members", 
              label: "Members List", 
              icon: <Users className="h-5 w-5" />, 
              permission: "manage_members" 
            },
            { 
              href: "/members/new", 
              label: "Add Member", 
              icon: <UserPlus className="h-5 w-5" />, 
              permission: "register_member" 
            },
            { 
              href: "/trainers", 
              label: "Trainers", 
              icon: <Dumbbell className="h-5 w-5" />, 
              permission: "view_all_trainers" 
            }
          ]
        },
        { 
          href: "/classes", 
          label: "Programs", 
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
              icon: <Activity className="h-5 w-5" />, 
              permission: "trainer_edit_fitness",
            },
            { 
              href: "/memberships", 
              label: "Membership Plans", 
              icon: <CreditCard className="h-5 w-5" />, 
              permission: "member_view_plans" 
            },
          ]
        },
        { 
          href: "/finance/invoices", 
          label: "Finance", 
          icon: <DollarSign className="h-5 w-5" />, 
          permission: "view_invoices",
          children: [
            { 
              href: "/finance/invoices", 
              label: "Invoices", 
              icon: <Receipt className="h-5 w-5" />, 
              permission: "view_invoices" 
            },
            { 
              href: "/finance/transactions", 
              label: "Transactions", 
              icon: <ArrowLeftRight className="h-5 w-5" />, 
              permission: "manage_payments" 
            },
          ]
        },
        { 
          href: "/store", 
          label: "E-commerce", 
          icon: <ShoppingBag className="h-5 w-5" />,
          permission: "access_store",
          children: [
            { 
              href: "/store", 
              label: "Store", 
              icon: <Store className="h-5 w-5" />,
              permission: "access_store",
            },
            { 
              href: "/inventory", 
              label: "Inventory", 
              icon: <Package className="h-5 w-5" />,
              permission: "access_inventory",
            }
          ]
        },
        { 
          href: "/crm/leads", 
          label: "CRM", 
          icon: <UserPlus className="h-5 w-5" />, 
          permission: "access_crm",
          children: [
            { 
              href: "/crm/leads", 
              label: "Leads", 
              icon: <UserPlus className="h-5 w-5" />, 
              permission: "access_crm" 
            },
            { 
              href: "/crm/funnel", 
              label: "Sales Funnel", 
              icon: <BarChart3 className="h-5 w-5" />, 
              permission: "access_crm" 
            },
            { 
              href: "/crm/follow-up", 
              label: "Follow-up", 
              icon: <CalendarCheck className="h-5 w-5" />, 
              permission: "access_crm" 
            }
          ]
        },
        { 
          href: "/communication/announcements", 
          label: "Communication", 
          icon: <MessageCircle className="h-5 w-5" />, 
          permission: "access_communication",
          children: [
            { 
              href: "/communication/announcements", 
              label: "Announcements", 
              icon: <Bell className="h-5 w-5" />, 
              permission: "access_communication" 
            },
            { 
              href: "/communication/feedback", 
              label: "Feedback", 
              icon: <MessageSquare className="h-5 w-5" />, 
              permission: "access_communication" 
            },
            { 
              href: "/communication/reminders", 
              label: "Reminders", 
              icon: <Bell className="h-5 w-5" />, 
              permission: "access_communication" 
            }
          ]
        }
      ]
    },
    {
      name: "TOOLS",
      items: [
        { 
          href: "/attendance", 
          label: "Attendance", 
          icon: <CalendarDays className="h-5 w-5" />, 
          permission: "view_all_attendance" 
        },
        { 
          href: "/marketing/promo", 
          label: "Marketing", 
          icon: <Gift className="h-5 w-5" />,
          permission: "access_marketing",
          children: [
            { 
              href: "/marketing/promo", 
              label: "Promotions", 
              icon: <Gift className="h-5 w-5" />,
              permission: "access_marketing",
            },
            { 
              href: "/marketing/referral", 
              label: "Referral Program", 
              icon: <Gift className="h-5 w-5" />,
              permission: "access_marketing",
            }
          ]
        },
        { 
          href: "/reports", 
          label: "Reports", 
          icon: <FileText className="h-5 w-5" />, 
          permission: "access_analytics" 
        },
        { 
          href: "/settings", 
          label: "Settings", 
          icon: <Settings className="h-5 w-5" />, 
          permission: "access_own_resources" 
        }
      ]
    }
  ];
  
  const filteredCategories = navCategories.map(category => {
    const filteredItems = category.items.filter(item => {
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
          <div className="p-4 flex items-center gap-3 border-b border-gray-700">
            <div className="bg-indigo-600 p-1 rounded-md">
              <Logo variant="white" />
            </div>
            <h1 className="text-xl font-semibold text-white">Muscle Garage</h1>
          </div>
          
          <div className="flex-1 overflow-y-auto py-2">
            {filteredCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-4">
                {category.name && (
                  <div className="px-4 py-2 text-xs font-semibold text-gray-400 tracking-wider">
                    {category.name}
                  </div>
                )}
                
                <div className="space-y-1">
                  {category.items.map((item, itemIndex) => {
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
