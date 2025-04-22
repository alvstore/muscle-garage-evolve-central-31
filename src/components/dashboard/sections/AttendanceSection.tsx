
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AttendanceChart from '@/components/dashboard/AttendanceChart';

interface AttendanceSectionProps {
  data: {
    date: string;
    count: number;
  }[];
}

const AttendanceSection = ({ data }: AttendanceSectionProps) => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Attendance Trend</CardTitle>
        <CardDescription>
          Daily attendance over the last 7 days
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <AttendanceChart data={data} />
      </CardContent>
    </Card>
  );
};

export default AttendanceSection;
