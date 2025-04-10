
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  description?: string;
  iconColor?: string;
  change?: {
    direction: "up" | "down" | "neutral";
    value: string;
  };
}

const StatCard = ({ icon: Icon, title, value, description, iconColor, change }: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-4 w-4 text-muted-foreground", iconColor)} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className={cn(
            "text-xs font-medium mt-1",
            change.direction === "up" ? "text-green-500" : 
            change.direction === "down" ? "text-red-500" : "text-gray-500"
          )}>
            {change.direction === "up" && "↑ "}
            {change.direction === "down" && "↓ "}
            {change.value}
          </div>
        )}
        {description && <CardDescription className="text-xs text-muted-foreground">{description}</CardDescription>}
      </CardContent>
    </Card>
  );
};

export default StatCard;
