
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface StatisticsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  percentChange?: number;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  animated?: boolean;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  subtitle,
  percentChange,
  icon: Icon,
  iconColor = "text-primary",
  iconBgColor = "bg-primary/10",
  animated = false
}) => {
  return (
    <Card className="overflow-hidden border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h4 className={`text-2xl font-bold mt-1 ${animated ? "animate-counter" : ""}`}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </h4>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
            {percentChange !== undefined && (
              <Badge className={`mt-2 px-2 py-0.5 text-xs ${percentChange >= 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                {percentChange >= 0 ? '↑' : '↓'} {Math.abs(percentChange)}%
              </Badge>
            )}
          </div>
          <div className={`${iconBgColor} p-3 rounded-lg ${iconColor}`}>
            <Icon size={22} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
