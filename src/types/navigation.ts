
import { ReactNode } from 'react';
import { Permission } from '@/hooks/use-permissions';

export interface NavItem {
  href: string;
  label: string;
  icon?: ReactNode;
  badge?: string;
  permission: Permission;
  children?: Array<{
    href: string;
    label: string;
    permission: Permission;
  }>;
}

export interface NavSection {
  name: string;
  icon?: ReactNode;
  items: NavItem[];
}
