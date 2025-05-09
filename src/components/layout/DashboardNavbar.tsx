
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  Settings, 
  Menu, 
  UserCircle, 
  Search, 
  LogOut,
  LayoutDashboard,
  Users,
  Calendar,
  Dumbbell,
  CreditCard,
  HardHat,
  Store,
  AlertCircle,
  BarChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getInitials } from '@/utils/stringUtils';
import { useAuth } from '@/hooks/use-auth';

interface NavbarProps {
  user?: {
    name: string;
    avatar?: string;
  };
  onMenuToggle: () => void;
}

export function DashboardNavbar({ user, onMenuToggle }: NavbarProps) {
  const { user: authUser, signOut } = useAuth();
  
  const displayName = user?.name || authUser?.displayName || 'User';
  
  const handleLogout = async () => {
    try {
      await signOut();
      // Will be redirected by the auth listener
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  // Mobile navigation items
  const mobileNavItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard' },
    { icon: <Users size={20} />, label: 'Members', href: '/members' },
    { icon: <Calendar size={20} />, label: 'Classes', href: '/classes' },
    { icon: <Dumbbell size={20} />, label: 'Trainers', href: '/trainers' },
    { icon: <CreditCard size={20} />, label: 'Billing', href: '/finance/invoices' },
    { icon: <HardHat size={20} />, label: 'Staff', href: '/staff' },
    { icon: <Store size={20} />, label: 'Inventory', href: '/inventory' },
    { icon: <AlertCircle size={20} />, label: 'Notifications', href: '/notifications' },
    { icon: <BarChart size={20} />, label: 'Reports', href: '/reports' }
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuToggle}>
            <Menu />
            <span className="sr-only">Toggle Menu</span>
          </Button>

          <div className="hidden md:flex">
            {/* Logo/branding can go here */}
          </div>

          <div className="flex-1 md:grow-0">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search..."
                  className="w-full rounded-lg border border-input bg-background pl-8 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:w-[200px] lg:w-[300px]"
                />
              </div>
            </form>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-2">
          {/* Desktop navigation items */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Bell />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                No new notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings/general">General Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings/company">Company Settings</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative h-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{displayName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <DropdownMenu>
          <DropdownMenuTrigger asChild className="md:hidden">
            <Button variant="ghost" size="sm" className="relative h-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 md:hidden">
            <DropdownMenuLabel>{displayName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Mobile navigation */}
            {mobileNavItems.map((item, index) => (
              <DropdownMenuItem key={index} asChild>
                <Link to={item.href} className="flex items-center">
                  <span className="mr-2">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex items-center">
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="flex items-center">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default DashboardNavbar;
