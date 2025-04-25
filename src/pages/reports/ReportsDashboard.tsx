
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { useAttendanceStats, useMembershipStats, useRevenueStats } from '@/hooks/use-stats';
import { addDays, subDays } from 'date-fns';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const ReportsDashboard = () => {
  const [date, setDate] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  // Fetch stats using custom hooks
  const { data: attendanceData, isLoading: attendanceLoading } = useAttendanceStats(date);
  const { data: revenueData, isLoading: revenueLoading } = useRevenueStats(date);
  const { data: membershipData, isLoading: membershipLoading } = useMembershipStats(date);

  // Prepare data for charts
  const formatChartData = (stats: any) => {
    if (!stats?.labels || !stats?.data) return [];
    return stats.labels.map((label: string, index: number) => ({
      name: label,
      value: stats.data[index]
    }));
  };

  const attendanceChartData = formatChartData(attendanceData);
  const revenueChartData = formatChartData(revenueData);
  const membershipChartData = formatChartData(membershipData);

  // Show only last 7 days for attendance data to avoid crowding
  const recentAttendanceData = attendanceChartData?.length ? 
    attendanceChartData.slice(-7) : 
    [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Format currency
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <Container>
      <div className="space-y-6 py-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start">
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <DateRangePicker
            date={date}
            onDateChange={(newDate: any) => {
              if (newDate.to) {
                setDate(newDate);
              } else {
                // If only from date is set, default to is from + 30 days
                setDate({ 
                  from: newDate.from, 
                  to: addDays(newDate.from, 30) 
                });
              }
            }}
          />
        </div>

        <Tabs defaultValue="attendance">
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="memberships">Memberships</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Analytics</CardTitle>
                <CardDescription>Daily attendance for the selected period</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {attendanceLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : recentAttendanceData?.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={recentAttendanceData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Daily Check-ins" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">No attendance data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analysis</CardTitle>
                <CardDescription>Weekly revenue for the selected period</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {revenueLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : revenueChartData?.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueChartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                      <YAxis 
                        tickFormatter={(value) => formatter.format(value).replace(/\.00$/, '')}
                      />
                      <Tooltip formatter={(value) => formatter.format(value)} />
                      <Legend />
                      <Line type="monotone" dataKey="value" name="Revenue" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">No revenue data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="memberships">
            <Card>
              <CardHeader>
                <CardTitle>Membership Overview</CardTitle>
                <CardDescription>Membership activity for the selected period</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {membershipLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : membershipChartData?.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={membershipChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {membershipChartData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip formatter={(value) => value} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">No membership data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default ReportsDashboard;
