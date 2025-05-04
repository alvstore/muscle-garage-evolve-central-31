
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, Loader2 } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: number;
  icon?: React.ReactNode;
  variant?: "neutral" | "increase" | "decrease" | "warning" | "info";
  isLoading?: boolean;
}

const StatCard = ({ 
  title, 
  value, 
  description, 
  trend, 
  icon, 
  variant = "neutral",
  isLoading = false
}: StatCardProps) => {
  
  // Determine color based on variant
  const getColorClasses = () => {
    switch(variant) {
      case "increase":
        return "text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400";
      case "decrease":
        return "text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400";
      case "warning":
        return "text-amber-600 bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400";
      case "info":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {isLoading ? (
              <div className="h-8 flex items-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <p className="text-2xl font-bold">{value}</p>
            )}
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          {icon && (
            <div className={`p-2 rounded-full ${getColorClasses()}`}>
              {icon}
            </div>
          )}
        </div>
        
        {trend !== undefined && !isLoading && (
          <div className="flex items-center mt-2">
            {trend > 0 ? (
              <ArrowUpIcon className="h-4 w-4 text-green-600 mr-1" />
            ) : trend < 0 ? (
              <ArrowDownIcon className="h-4 w-4 text-red-600 mr-1" />
            ) : null}
            <span className={`text-xs font-medium ${trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : ''}`}>
              {Math.abs(trend)}% from last period
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
