
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface AttendanceSectionProps {
  data: any[];
  isLoading?: boolean;
}

const AttendanceSection = ({ data, isLoading = false }: AttendanceSectionProps) => {
  if (isLoading) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Weekly Attendance</CardTitle>
          <CardDescription>Check-ins over the past 7 days</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <div className="w-full h-full animate-pulse flex items-center justify-center bg-muted rounded-md">
            <p className="text-muted-foreground">Loading attendance data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Weekly Attendance</CardTitle>
        <CardDescription>Check-ins over the past 7 days</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Morning" fill="#8884d8" />
            <Bar dataKey="Afternoon" fill="#82ca9d" />
            <Bar dataKey="Evening" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AttendanceSection;
