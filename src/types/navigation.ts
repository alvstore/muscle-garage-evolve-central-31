
import { ReactNode } from 'react';
import { Permission } from '@/hooks/auth/use-permissions';

export interface NavItem {
  href: string;
  label: string;
  permission: Permission;
  icon?: ReactNode;
  badge?: string;
  children?: NavItem[];
}

export interface NavSection {
  name: string;
  items: NavItem[];
  icon?: ReactNode;
}

// Re-export Permission type from use-permissions
export type { Permission } from '@/hooks/auth/use-permissions';
