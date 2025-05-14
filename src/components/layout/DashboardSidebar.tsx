
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  Settings, 
  Archive,
  ShoppingCart,
  MessageSquare,
  Bell,
  Database,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePermissions } from '@/hooks/use-permissions';
import { Button } from '@/components/ui/button';

interface DashboardSidebarProps {
  isSidebarOpen: boolean;
  closeSidebar: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ 
  isSidebarOpen, 
  closeSidebar 
}) => {
  const { can, userRole } = usePermissions();

  const isAdmin = userRole === 'admin';
  const isStaff = userRole === 'staff' || userRole === 'admin';

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <BarChart3 className="w-4 h-4 mr-2" /> },
    { name: 'Members', path: '/members', icon: <Users className="w-4 h-4 mr-2" />, visible: isStaff },
    { name: 'Classes', path: '/classes', icon: <Calendar className="w-4 h-4 mr-2" />, visible: isStaff },
    { name: 'CRM', path: '/crm/dashboard', icon: <MessageSquare className="w-4 h-4 mr-2" />, visible: isStaff },
    { name: 'Store', path: '/store', icon: <ShoppingCart className="w-4 h-4 mr-2" /> },
    { name: 'Communications', path: '/communications', icon: <Bell className="w-4 h-4 mr-2" />, visible: isStaff },
    { name: 'Reports', path: '/reports', icon: <Database className="w-4 h-4 mr-2" />, visible: isAdmin },
    { name: 'Archives', path: '/archives', icon: <Archive className="w-4 h-4 mr-2" />, visible: isAdmin },
    { name: 'Settings', path: '/settings', icon: <Settings className="w-4 h-4 mr-2" />, visible: isAdmin }
  ];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 border-r dark:border-gray-700 shadow-sm">
      <div className="p-4 flex items-center justify-between border-b dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Gym CRM</h2>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={closeSidebar}
          className="lg:hidden"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {navItems.map((item) => 
            (item.visible === undefined || item.visible) && (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => closeSidebar()}
                  className={({ isActive }) => cn(
                    "flex items-center px-3 py-2 rounded-md text-sm",
                    isActive 
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              </li>
            )
          )}
        </ul>
      </nav>
      <div className="p-4 border-t dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Version 1.0.0
        </p>
      </div>
    </div>
  );
};

export default DashboardSidebar;
