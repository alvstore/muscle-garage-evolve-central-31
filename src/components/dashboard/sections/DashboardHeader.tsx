
import React from "react";
import { 
  Bell, 
  Menu, 
  Moon, 
  Search, 
  Sun, 
  User,
  MessageSquare,
  Settings
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";

interface DashboardHeaderProps {
  toggleSidebar: () => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
  sidebarOpen: boolean;
}

const DashboardHeader = ({ 
  toggleSidebar, 
  toggleTheme, 
  isDarkMode,
  sidebarOpen
}: DashboardHeaderProps) => {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
  };
  
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-4 lg:gap-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="lg:hidden"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden md:flex items-center relative w-full max-w-md">
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full pl-8 bg-background"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          className="md:hidden"
          onClick={() => {
            const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
            if (searchInput) {
              searchInput.focus();
            }
          }}
        >
          <Search className="h-5 w-5" />
        </Button>
        <ThemeToggle />
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <Link to="/messages">
            <MessageSquare className="h-5 w-5" />
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full overflow-hidden"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage 
                  src={user?.avatar_url || undefined} 
                  alt={user?.full_name || "User"} 
                />
                <AvatarFallback>
                  {getInitials(user?.full_name || "")}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.full_name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={logout}
              className="cursor-pointer"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
