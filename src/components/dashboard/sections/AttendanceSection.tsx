
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AttendanceChart from '@/components/dashboard/AttendanceChart';
import { useAuth } from '@/hooks/use-auth';
import { useMemberSpecificData } from '@/hooks/use-member-specific-data';

interface AttendanceData {
  date: string;
  count: number;
  memberId?: string;
}

interface AttendanceSectionProps {
  data: AttendanceData[];
}

const AttendanceSection = ({ data }: AttendanceSectionProps) => {
  const { user } = useAuth();
  const { data: filteredData } = useMemberSpecificData<AttendanceData[], AttendanceData[]>(
    data,
    (items, userId) => items.filter(item => item.memberId === userId)
  );

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Attendance Trend</CardTitle>
        <CardDescription>
          Your daily attendance over the last 7 days
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <AttendanceChart data={filteredData || []} />
      </CardContent>
    </Card>
  );
};

export default AttendanceSection;
