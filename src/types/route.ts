
import { ReactNode } from 'react';
import { Permission } from '@/hooks/use-permissions';
import { RouteObject } from 'react-router-dom';

export interface AppRouteMeta {
  title?: string;
  breadcrumb?: string;
  permission?: Permission;
  hideInNav?: boolean;
  icon?: ReactNode;
  children?: AppRoute[];
}

export interface AppRoute extends RouteObject {
  path: string;
  element?: React.ReactNode;
  meta?: AppRouteMeta;
}
