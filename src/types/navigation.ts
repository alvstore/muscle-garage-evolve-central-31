
import { Permission } from "@/hooks/use-permissions";

export interface NavItem {
  href: string;
  label: string;
  icon?: string;
  permission?: Permission;
  children?: NavItem[];
}

export interface NavSection {
  name: string;
  items: NavItem[];
}
