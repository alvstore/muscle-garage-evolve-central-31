import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface FinanceStatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  subtitle?: string;
  className?: string;
  iconColor?: string;
}

const FinanceStatsCard: React.FC<FinanceStatsCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  subtitle,
  className,
  iconColor = 'text-primary'
}) => {
  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '→';
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h4 className="mt-2 text-2xl font-bold">
              {typeof value === 'number' ? `₹${value.toLocaleString()}` : value}
            </h4>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
            {change && (
              <p className={cn("text-xs font-medium mt-2", getTrendColor(change.trend))}>
                {getTrendIcon(change.trend)} {Math.abs(change.value)}%
                {change.trend === 'up' ? ' increase' : change.trend === 'down' ? ' decrease' : ''}
              </p>
            )}
          </div>
          <div className={cn("p-2 rounded-full bg-primary/10", iconColor)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinanceStatsCard;
