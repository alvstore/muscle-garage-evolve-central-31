
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RevenueChart from '@/components/dashboard/RevenueChart';

interface RevenueSectionProps {
  data: {
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }[];
}

const RevenueSection = ({ data }: RevenueSectionProps) => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>
          Monthly revenue breakdown by category
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <RevenueChart data={data} />
      </CardContent>
    </Card>
  );
};

export default RevenueSection;
