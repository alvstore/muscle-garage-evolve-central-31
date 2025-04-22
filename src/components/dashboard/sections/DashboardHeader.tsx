
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Menu, Moon, Search, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useBranch } from "@/hooks/use-branch";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import NotificationsPanel from "@/components/notifications/NotificationsPanel";

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
  const { user } = useAuth();
  const { currentBranch } = useBranch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Enhanced search functionality for staff
      const lowerQuery = searchQuery.toLowerCase();
      if (lowerQuery.includes('member') || lowerQuery.includes('customer')) {
        navigate('/members');
        toast.info(`Searching for members with query: ${searchQuery}`);
      } else if (lowerQuery.includes('diet')) {
        navigate('/fitness/diet-plans');
        toast.info(`Searching for diet plans with query: ${searchQuery}`);
      } else if (lowerQuery.includes('workout')) {
        navigate('/fitness/workout-plans');
        toast.info(`Searching for workout plans with query: ${searchQuery}`);
      } else if (lowerQuery.includes('invoice')) {
        navigate('/finance/invoices');
        toast.info(`Searching for invoices with query: ${searchQuery}`);
      } else {
        toast.info(`Searching for: ${searchQuery}`);
      }
    }
  };

  // Check if user is a member or staff
  const isMember = user?.role === 'member';
  const isStaff = user?.role === 'staff';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden md:flex items-center">
          <span className="text-lg font-semibold max-w-[200px] truncate">
            {currentBranch?.name || "Muscle Garage"}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Only show search for non-member users */}
        {!isMember && (
          <>
            <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
              <Input
                type="search"
                placeholder="Search members, plans, invoices..."
                className="w-64 pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
            </form>
            
            <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Search className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="pt-10">
                <form onSubmit={handleSearch} className="flex items-center relative">
                  <Input
                    type="search"
                    placeholder="Search members, plans, invoices..."
                    className="w-full pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
                </form>
              </SheetContent>
            </Sheet>
          </>
        )}
        
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        
        <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <NotificationsPanel />
          </SheetContent>
        </Sheet>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || ""} alt={user?.name || "User"} />
                <AvatarFallback>
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              Profile
            </DropdownMenuItem>
            {/* Only show settings for admin users, not staff or members */}
            {user?.role === 'admin' && (
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                Settings
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
