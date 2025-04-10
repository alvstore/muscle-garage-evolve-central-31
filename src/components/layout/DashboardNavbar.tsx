
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User as UserType } from "@/types";
import Logo from "@/components/Logo";
import { NavbarNotifications } from "./navbar/NavbarNotifications";
import { NavbarUserMenu } from "./navbar/NavbarUserMenu";
import { NavbarSearchBar } from "./navbar/NavbarSearchBar";
import { NavbarCart } from "./navbar/NavbarCart";
import { ThemeToggle } from "./navbar/ThemeToggle";

interface DashboardNavbarProps {
  user: UserType;
  onToggleSidebar: () => void;
}

const DashboardNavbar = ({ user, onToggleSidebar }: DashboardNavbarProps) => {
  return (
    <div className="sticky top-0 z-30 flex h-16 items-center border-b bg-white px-4 md:px-6">
      <div className="flex items-center gap-4 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <Logo />
      </div>
      
      <div className="flex-1 md:ml-4">
        <NavbarSearchBar />
      </div>
      
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <NavbarCart />
        <NavbarNotifications />
        <NavbarUserMenu user={user} />
      </div>
    </div>
  );
};

export default DashboardNavbar;
