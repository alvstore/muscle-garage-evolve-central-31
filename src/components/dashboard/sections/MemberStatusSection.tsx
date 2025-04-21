
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MemberStatusChart from '@/components/dashboard/MemberStatusChart';

interface MemberStatusSectionProps {
  data?: {
    active: number;
    inactive: number;
    expired: number;
  };
}

const MemberStatusSection = ({ data }: MemberStatusSectionProps) => {
  // Default data if none is provided
  const defaultData = data || {
    active: 75,
    inactive: 15,
    expired: 10
  };

  // Transform data for the chart component
  const chartData = [
    { name: 'Active', value: defaultData.active, color: '#10b981' },
    { name: 'Inactive', value: defaultData.inactive, color: '#f59e0b' },
    { name: 'Expired', value: defaultData.expired, color: '#ef4444' }
  ];

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Member Status</CardTitle>
        <CardDescription>
          Current membership status breakdown
        </CardDescription>
      </CardHeader>
      <CardContent>
        <MemberStatusChart data={chartData} />
      </CardContent>
    </Card>
  );
};

export default MemberStatusSection;
