
import { Bell, ChevronDown, Menu, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "@/components/Logo";
import { User as UserType } from "@/types";
import { useState } from "react";

interface DashboardNavbarProps {
  user: UserType;
  onToggleSidebar: () => void;
}

const DashboardNavbar = ({ user, onToggleSidebar }: DashboardNavbarProps) => {
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "New Member Registration",
      message: "Sarah Parker has registered as a new member.",
      time: "10 minutes ago",
      read: false,
    },
    {
      id: "2",
      title: "Payment Received",
      message: "John Doe has completed payment for Premium Annual membership.",
      time: "30 minutes ago",
      read: false,
    },
    {
      id: "3",
      title: "Low Inventory Alert",
      message: "Protein powder (Chocolate) is below reorder level.",
      time: "1 hour ago",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button
        variant="outline"
        size="icon"
        className="md:hidden"
        onClick={onToggleSidebar}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="hidden md:block">
        <Logo />
      </div>
      <div className="flex-1">
        <form className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full max-w-lg bg-background pl-8 md:w-80 lg:w-96"
          />
        </form>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                  {unreadCount}
                </span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs font-normal"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </Button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="py-4 text-center text-sm text-muted-foreground">
                No new notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="cursor-pointer flex flex-col items-start gap-1 p-3"
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex w-full justify-between">
                    <span className="font-medium">{notification.title}</span>
                    {!notification.read && (
                      <span className="flex h-2 w-2 rounded-full bg-accent" />
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {notification.message}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {notification.time}
                  </span>
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer justify-center">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="hidden gap-1 md:flex"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={user.avatar}
                  alt={user.name}
                />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <span>{user.name}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user.avatar}
                  alt={user.name}
                />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <User className="h-5 w-5" />
              <span className="sr-only">User Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user.avatar}
                  alt={user.name}
                />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default DashboardNavbar;
