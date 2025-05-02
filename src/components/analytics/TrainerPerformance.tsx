
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useTrainerUtilization } from '@/hooks/use-stats';
import { Check, Clock, User2 } from 'lucide-react';

const TrainerPerformance: React.FC = () => {
  const { trainers, isLoading, error } = useTrainerUtilization();

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 85) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-1">
          <CardTitle className="text-lg font-medium">Trainer Utilization</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-[150px]" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-4 w-[80%]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-1">
          <CardTitle className="text-lg font-medium">Trainer Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Error loading trainer data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-1">
        <CardTitle className="text-lg font-medium">Trainer Utilization</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        {trainers.length === 0 ? (
          <p className="text-muted-foreground">No trainer data available</p>
        ) : (
          <div className="space-y-5">
            {trainers.map((trainer) => (
              <div key={trainer.trainer_id} className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium">{trainer.trainer_name}</h3>
                  <span className="text-sm">{trainer.utilization_percentage}%</span>
                </div>
                
                <Progress 
                  value={trainer.utilization_percentage} 
                  className="h-2"
                  indicatorClassName={getUtilizationColor(trainer.utilization_percentage)}
                />
                
                <div className="flex text-xs text-muted-foreground space-x-4 pt-1">
                  <div className="flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                    <span>{trainer.sessions_conducted} sessions</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{Math.round(trainer.minutes_utilized / 60)} hours</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrainerPerformance;
