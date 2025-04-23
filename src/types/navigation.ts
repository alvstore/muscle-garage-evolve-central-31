
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

export interface WebsiteContent {
  id: string;
  pageKey: string;
  section: string;
  title: string;
  content: any;
  updatedAt: string;
  createdAt: string;
}

export interface WebsiteImage {
  id: string;
  pageKey: string;
  section: string;
  imageUrl: string;
  altText: string;
  updatedAt: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  designation: string;
  review: string;
  image: string;
}

export interface ServicePlan {
  id: string;
  title: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
  iconType: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}
