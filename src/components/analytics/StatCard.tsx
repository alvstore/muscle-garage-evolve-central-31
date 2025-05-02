
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

type StatCardVariant = 'default' | 'increase' | 'decrease' | 'neutral' | 'info' | 'warning';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  variant?: StatCardVariant;
  isLoading?: boolean;
  className?: string;
  trend?: number;
}

const cardVariants = cva(
  "relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-gray-200",
        increase: "border-l-4 border-l-green-500",
        decrease: "border-l-4 border-l-red-500",
        neutral: "border-l-4 border-l-blue-500",
        info: "border-l-4 border-l-indigo-500",
        warning: "border-l-4 border-l-amber-500",
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  variant = "default",
  isLoading = false,
  className,
  trend,
}) => {
  return (
    <Card className={cn(cardVariants({ variant }), className)}>
      {isLoading ? (
        <div className="p-6 space-y-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-8 w-[120px]" />
          {description && <Skeleton className="h-4 w-full" />}
        </div>
      ) : (
        <>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            {icon && <div className="text-muted-foreground">{icon}</div>}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
            {trend !== undefined && (
              <div className={cn(
                "flex items-center text-xs mt-2",
                trend > 0 ? "text-green-500" : trend < 0 ? "text-red-500" : "text-blue-500"
              )}>
                {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} 
                <span className="ml-1">
                  {Math.abs(trend)}% {trend > 0 ? 'increase' : trend < 0 ? 'decrease' : 'no change'} from previous period
                </span>
              </div>
            )}
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default StatCard;
