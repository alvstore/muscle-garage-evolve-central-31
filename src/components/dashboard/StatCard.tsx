
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    direction: "up" | "down" | "neutral";
    value: string;
  };
  className?: string;
  iconColor?: string;
}

const StatCard = ({
  icon: Icon,
  title,
  value,
  description,
  trend,
  className,
  iconColor = "text-primary",
}: StatCardProps) => {
  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-500",
  };

  return (
    <Card 
      className={cn(
        "stat-card transition-all duration-200 hover:shadow-md", 
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span className={cn("text-xs font-medium", trendColors[trend.direction])}>
                {trend.direction === "up" && "↑ "}
                {trend.direction === "down" && "↓ "}
                {trend.value}
              </span>
            </div>
          )}
        </div>
        <div className={cn("p-2 rounded-full bg-primary/10", iconColor.replace("text-", "bg-") + "/10")}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
