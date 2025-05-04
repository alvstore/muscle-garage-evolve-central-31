
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ClassPerformanceTable = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Performance</CardTitle>
        <CardDescription>Attendance and popularity of classes</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground py-8 text-center">
          Class performance data will be displayed here once available
        </p>
      </CardContent>
    </Card>
  );
};

export default ClassPerformanceTable;
