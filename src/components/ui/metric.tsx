
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

export interface MetricProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: number;
  trendPeriod?: string;
  indicator?: "positive" | "negative" | "neutral";
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function Metric({
  title,
  value,
  description,
  trend,
  trendPeriod = "from previous period",
  indicator = "neutral",
  prefix,
  suffix,
  className,
}: MetricProps) {
  const renderTrendIcon = () => {
    if (indicator === "positive") {
      return <ArrowUp className="h-4 w-4 text-emerald-500" />;
    }
    
    if (indicator === "negative") {
      return <ArrowDown className="h-4 w-4 text-red-500" />;
    }
    
    return <Minus className="h-4 w-4 text-gray-500" />;
  };
  
  const getTrendColor = () => {
    if (indicator === "positive") {
      return "text-emerald-500";
    }
    
    if (indicator === "negative") {
      return "text-red-500";
    }
    
    return "text-gray-500";
  };

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="text-3xl font-bold">
        {prefix}{value}{suffix}
      </p>
      
      {(description || trend !== undefined) && (
        <div className="text-xs text-muted-foreground">
          {trend !== undefined && (
            <div className="flex items-center gap-1">
              {renderTrendIcon()}
              <span className={cn("font-medium", getTrendColor())}>
                {trend > 0 ? "+" : ""}{trend}%
              </span>
              {trendPeriod && <span className="text-muted-foreground">{trendPeriod}</span>}
            </div>
          )}
          
          {description && <p>{description}</p>}
        </div>
      )}
    </div>
  );
}
