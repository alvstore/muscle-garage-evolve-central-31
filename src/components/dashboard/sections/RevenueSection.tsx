
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
  isLoading?: boolean;
}

const RevenueSection = ({ data, isLoading = false }: RevenueSectionProps) => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>
          Monthly revenue breakdown by category
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        {isLoading ? (
          <div className="h-80 w-full animate-pulse bg-muted rounded-md"></div>
        ) : (
          <RevenueChart data={data} />
        )}
      </CardContent>
    </Card>
  );
};

export default RevenueSection;
