
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DateRange } from '@/hooks/use-stats';

interface MembershipTrendChartProps {
  dateRange: DateRange;
}

const MembershipTrendChart = ({ dateRange }: MembershipTrendChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Membership Trend</CardTitle>
        <CardDescription>New and cancelled memberships over time</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground py-8 text-center">
          Membership trend data will be displayed here once available
        </p>
      </CardContent>
    </Card>
  );
};

export default MembershipTrendChart;
