
import { 
  BarChart3, 
  Calendar, 
  CreditCard, 
  Users, 
  ShoppingCart, 
  BarChart, 
  MessageSquare,
  Home,
  Dumbbell,
  GraduationCap,
  Utensils,
  Heart,
  ChevronUp
} from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  submenu?: boolean;
  subMenuItems?: NavItem[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const memberNavSections: NavSection[] = [
  {
    title: 'Overview',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: <Home size={20} />
      },
      {
        title: 'Classes',
        href: '/classes',
        icon: <Calendar size={20} />
      },
      {
        title: 'Payments',
        href: '/payments',
        icon: <CreditCard size={20} />
      }
    ]
  },
  {
    title: 'Fitness',
    items: [
      {
        title: 'Workouts',
        href: '/fitness/workout',
        icon: <Dumbbell size={20} />
      },
      {
        title: 'Diet Plans',
        href: '/fitness/diet',
        icon: <Utensils size={20} />
      },
      {
        title: 'Progress Tracker',
        href: '/fitness/progress',
        icon: <BarChart3 size={20} />
      },
      {
        title: 'Personal Training',
        href: '/fitness/training',
        icon: <GraduationCap size={20} />
      }
    ]
  },
  {
    title: 'Community',
    items: [
      {
        title: 'Announcements',
        href: '/community/announcements',
        icon: <MessageSquare size={20} />
      },
      {
        title: 'Members',
        href: '/community/members',
        icon: <Users size={20} />
      },
      {
        title: 'Feedback',
        href: '/community/feedback',
        icon: <MessageSquare size={20} />
      }
    ]
  },
  {
    title: 'Shop',
    items: [
      {
        title: 'Supplements',
        href: '/shop/supplements',
        icon: <ShoppingCart size={20} />
      },
      {
        title: 'Merchandise',
        href: '/shop/merchandise',
        icon: <ShoppingCart size={20} />
      },
      {
        title: 'Nutrition',
        href: '/shop/nutrition',
        icon: <Heart size={20} />
      }
    ]
  }
];
