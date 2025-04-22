
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export interface MemberStatusSectionProps {
  data: {
    active: number;
    inactive: number;
    expired: number;
  };
  isLoading?: boolean;
}

const MemberStatusSection = ({ data, isLoading = false }: MemberStatusSectionProps) => {
  const chartData = [
    { name: 'Active', value: data.active, color: '#16a34a' },
    { name: 'Inactive', value: data.inactive, color: '#f59e0b' },
    { name: 'Expired', value: data.expired, color: '#dc2626' },
  ];

  if (isLoading) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Member Status</CardTitle>
          <CardDescription>Distribution of member statuses</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="w-full h-full animate-pulse flex items-center justify-center bg-muted rounded-md">
            <p className="text-muted-foreground">Loading chart data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Member Status</CardTitle>
        <CardDescription>Distribution of member statuses</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value} members`, 'Count']}
              labelFormatter={() => ''}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MemberStatusSection;
