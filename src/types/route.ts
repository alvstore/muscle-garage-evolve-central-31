
import { ReactNode } from 'react';
import { RouteObject } from 'react-router-dom';
import { Permission } from './navigation';

export interface AppRouteMetadata {
  title: string;
  breadcrumb?: string;
  permission?: Permission;
  hideInNav?: boolean;
  icon?: ReactNode;
  children?: AppRoute[];
}

export interface AppRoute extends RouteObject {
  meta?: AppRouteMetadata;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}
