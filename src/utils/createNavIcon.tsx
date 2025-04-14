
import React from 'react';
import { 
  Home, 
  User, 
  Calendar, 
  Activity, 
  TrendingUp, 
  Utensils,
  FileText, 
  CreditCard, 
  ShoppingBag, 
  MessageCircle, 
  Bell,
  ListTodo,
  UserCircle,
  Dumbbell,
  ChefHat
} from 'lucide-react';

// Map of icon names to Lucide icon components
const iconMap = {
  "Home": Home,
  "User": User,
  "Calendar": Calendar,
  "Activity": Activity,
  "TrendingUp": TrendingUp,
  "Utensils": Utensils,
  "FileText": FileText,
  "CreditCard": CreditCard,
  "ShoppingBag": ShoppingBag,
  "MessageCircle": MessageCircle,
  "Bell": Bell,
  "ListTodo": ListTodo,
  "UserCircle": UserCircle,
  "Dumbbell": Dumbbell,
  "ChefHat": ChefHat,
};

// Type for the iconName parameter based on keys in iconMap
type IconName = keyof typeof iconMap;

/**
 * Creates a React element with the specified icon
 * @param iconName Name of the icon to create
 * @returns React element with the icon
 */
export const createNavIcon = (iconName: IconName) => {
  const IconComponent = iconMap[iconName];
  return <IconComponent className="h-4 w-4" />;
};
