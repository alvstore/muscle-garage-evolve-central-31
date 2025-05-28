import React from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  User,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { useAuth } from '@/hooks/auth/use-auth';
import { useNavigate } from 'react-router-dom';
import { siteConfig } from "@/configs/site";

const DashboardNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Navbar shouldHideOnScroll className="bg-background border-b border-border">
      <NavbarBrand>
        <Link href="/dashboard">
          <p className="font-bold text-xl">{siteConfig.name}</p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/dashboard">
            Dashboard
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/members">
            Members
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/classes">
            Classes
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/finances">
            Finances
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/crm">
            CRM
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/settings">
            Settings
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {user ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <User
                as="button"
                className="transition-opacity hover:opacity-80"
                avatarProps={{
                  src: user.avatar || "https://i.pravatar.cc/150?u=" + user.email,
                }}
                name={user.full_name || user.name || user.email}
                description={user.email}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="User menu actions">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="text-sm text-default-400">{user.email}</p>
              </DropdownItem>
              <DropdownItem key="logout" onClick={handleLogout}>
                Log out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <NavbarItem>
            <Button as={Link} className="font-medium" href="/login" color="primary">
              Login
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default DashboardNavbar;
