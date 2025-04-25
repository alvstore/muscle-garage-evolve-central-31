
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, AreaChart, Area } from 'recharts';
import { useAttendanceStats, useRevenueStats, useMembershipStats } from '@/hooks/use-reports';
import { format } from 'date-fns';

// Define DateRangePickerProps interface to match the component's expected props
interface DateRangePickerProps {
  value: { from: Date | null; to: Date | null; };
  onChange: (value: { from: Date | null; to: Date | null; }) => void;
}

const ReportsDashboard = () => {
  const [dateRange, setDateRange] = useState<{
    from: Date | null;
    to: Date | null;
  }>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });

  const startDate = dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : '';
  const endDate = dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : '';

  // Updated to pass an empty string if the date is null
  const { data: attendanceData } = useAttendanceStats('daily', startDate, endDate);
  const { data: revenueData } = useRevenueStats('daily', startDate, endDate);
  const { data: membershipData } = useMembershipStats('daily', startDate, endDate);

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Reports Dashboard</h1>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Date Range</CardTitle>
          </CardHeader>
          <CardContent>
            <DateRangePicker 
              value={dateRange} 
              onChange={setDateRange} 
            />
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Attendance Chart</CardTitle>
          </CardHeader>
          <CardContent>
            {attendanceData && Array.isArray(attendanceData) && attendanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={attendanceData.slice(-7)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="members" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">No attendance data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Revenue Chart</CardTitle>
          </CardHeader>
          <CardContent>
            {revenueData && Array.isArray(revenueData) && revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData.slice(-7)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">No revenue data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Membership Chart</CardTitle>
          </CardHeader>
          <CardContent>
            {membershipData && Array.isArray(membershipData) && membershipData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={membershipData.slice(-7)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="members" stroke="#ffc658" fill="#ffc658" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">No membership data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default ReportsDashboard;
