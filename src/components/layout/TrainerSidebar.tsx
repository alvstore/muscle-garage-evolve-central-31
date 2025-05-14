
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  DumbbellIcon, 
  ClipboardList,
  MessageSquare,
  UserCheck,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface TrainerSidebarProps {
  isSidebarOpen: boolean;
  closeSidebar: () => void;
}

const TrainerSidebar: React.FC<TrainerSidebarProps> = ({ 
  isSidebarOpen, 
  closeSidebar 
}) => {
  const navItems = [
    { name: 'Dashboard', path: '/trainer/dashboard', icon: <BarChart3 className="w-4 h-4 mr-2" /> },
    { name: 'My Members', path: '/trainer/members', icon: <Users className="w-4 h-4 mr-2" /> },
    { name: 'Schedule', path: '/trainer/schedule', icon: <Calendar className="w-4 h-4 mr-2" /> },
    { name: 'Fitness Plans', path: '/trainer/fitness-plans', icon: <DumbbellIcon className="w-4 h-4 mr-2" /> },
    { name: 'Diet Plans', path: '/trainer/diet-plans', icon: <ClipboardList className="w-4 h-4 mr-2" /> },
    { name: 'Attendance', path: '/trainer/attendance', icon: <UserCheck className="w-4 h-4 mr-2" /> },
    { name: 'Messages', path: '/trainer/messages', icon: <MessageSquare className="w-4 h-4 mr-2" /> }
  ];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 border-r dark:border-gray-700 shadow-sm">
      <div className="p-4 flex items-center justify-between border-b dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Trainer Portal</h2>
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
          {navItems.map((item) => (
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
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Trainer Portal v1.0
        </p>
      </div>
    </div>
  );
};

export default TrainerSidebar;
