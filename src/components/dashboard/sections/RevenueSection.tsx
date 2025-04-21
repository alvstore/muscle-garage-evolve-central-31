
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RevenueChart from '@/components/dashboard/RevenueChart';

interface RevenueSectionProps {
  data?: {
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }[];
}

const RevenueSection = ({ data }: RevenueSectionProps) => {
  const defaultData = [
    { month: 'Jan', revenue: 4000, expenses: 2400, profit: 1600 },
    { month: 'Feb', revenue: 5000, expenses: 2800, profit: 2200 },
    { month: 'Mar', revenue: 6000, expenses: 3200, profit: 2800 },
    { month: 'Apr', revenue: 7000, expenses: 3600, profit: 3400 },
    { month: 'May', revenue: 8000, expenses: 4000, profit: 4000 },
    { month: 'Jun', revenue: 9000, expenses: 4400, profit: 4600 },
  ];

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>
          Monthly revenue breakdown by category
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <RevenueChart data={data || defaultData} />
      </CardContent>
    </Card>
  );
};

export default RevenueSection;
