
import React, { ReactNode } from "react";
import { 
  User,
  Calendar,
  CreditCard,
  Activity,
  DollarSign,
  ShoppingBag,
  FileText,
  Bell,
  Settings,
  Home,
  Utensils,
  TrendingUp,
  Dumbbell,
  Users,
  MessageCircle,
  UserCircle
} from "lucide-react";

// Map of icon names to their components
const iconMap = {
  Home,
  User,
  Users,
  Calendar,
  CreditCard, 
  Activity,
  DollarSign,
  ShoppingBag,
  FileText,
  Bell,
  Settings,
  Utensils,
  TrendingUp,
  Dumbbell,
  MessageCircle,
  UserCircle
};

export type IconName = keyof typeof iconMap;

// Function to create icon elements with consistent styling
export const createNavIcon = (name: IconName): ReactNode => {
  const IconComponent = iconMap[name];
  return <IconComponent className="h-5 w-5" />;
};
