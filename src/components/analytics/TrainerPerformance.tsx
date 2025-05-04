
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const TrainerPerformance = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trainer Performance</CardTitle>
        <CardDescription>Trainer utilization and ratings</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground py-8 text-center">
          Trainer performance data will be displayed here once available
        </p>
      </CardContent>
    </Card>
  );
};

export default TrainerPerformance;
