
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

const RevenueSection = ({ data = [] }: RevenueSectionProps) => {
  // Default data if none is provided
  const defaultData = data.length > 0 ? data : [
    { month: 'Jan', revenue: 12000, expenses: 8000, profit: 4000 },
    { month: 'Feb', revenue: 15000, expenses: 8500, profit: 6500 },
    { month: 'Mar', revenue: 18000, expenses: 9000, profit: 9000 },
    { month: 'Apr', revenue: 16000, expenses: 9500, profit: 6500 },
    { month: 'May', revenue: 21000, expenses: 10000, profit: 11000 },
    { month: 'Jun', revenue: 19000, expenses: 9800, profit: 9200 }
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
        <RevenueChart data={defaultData} />
      </CardContent>
    </Card>
  );
};

export default RevenueSection;
