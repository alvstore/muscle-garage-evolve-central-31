
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DateRange } from '@/hooks/analytics/use-stats';

interface RevenueBreakdownChartProps {
  dateRange: DateRange;
}

const RevenueBreakdownChart = ({ dateRange }: RevenueBreakdownChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Breakdown</CardTitle>
        <CardDescription>Distribution of revenue by source</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground py-8 text-center">
          Revenue breakdown data will be displayed here once available
        </p>
      </CardContent>
    </Card>
  );
};

export default RevenueBreakdownChart;
