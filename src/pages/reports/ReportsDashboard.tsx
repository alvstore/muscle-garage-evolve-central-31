
import React, { useState } from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAttendanceStats, useRevenueStats, useMembershipStats, DateRange } from "@/hooks/use-stats";
import { format, subDays } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell as RechartsCell } from 'recharts';

interface DateRangePickerProps {
  date: DateRange;
  onDateChange: (date: DateRange) => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const RADIAN = Math.PI / 180;

const CustomTooltip = ({ active, payload, label }: { active?: boolean, payload?: any[], label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border shadow-sm rounded">
        <p className="font-medium">{`${label}`}</p>
        <p className="text-sm text-blue-600">{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
  value
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
  value: number;
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
    >
      {`${value} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};

const ReportsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('attendance');
  const [branchFilter, setBranchFilter] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  
  const { data: attendanceData, isLoading: attendanceLoading } = useAttendanceStats(dateRange);
  const { data: revenueData, isLoading: revenueLoading } = useRevenueStats(dateRange);
  const { data: membershipData, isLoading: membershipLoading } = useMembershipStats(dateRange);

  const handleDateChange = (date: DateRange) => {
    setDateRange(date);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-3xl font-bold mb-1">Reports & Analytics</h1>
        <p className="text-muted-foreground mb-6">
          View detailed analytics and reports for your gym
        </p>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-2/3">
            <DateRangePicker 
              date={dateRange} 
              onDateChange={handleDateChange}
            />
          </div>
          <div className="w-full md:w-1/3">
            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                <SelectItem value="main">Main Branch</SelectItem>
                <SelectItem value="east">East Branch</SelectItem>
                <SelectItem value="west">West Branch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="attendance" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="membership">Membership</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Overview</CardTitle>
                <CardDescription>
                  Daily check-ins over the selected period
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {attendanceLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <p>Loading attendance data...</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={attendanceData?.labels.map((label, index) => ({
                        date: label,
                        count: attendanceData.data[index]
                      }))}
                      margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis 
                        dataKey="date" 
                        angle={-45} 
                        textAnchor="end" 
                        height={70} 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" name="Check-ins" fill="#4f46e5" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Total check-ins: <span className="font-medium">{attendanceData?.data.reduce((a, b) => a + b, 0) || 0}</span>
                </p>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analysis</CardTitle>
                <CardDescription>
                  Financial performance over the selected period
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {revenueLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <p>Loading revenue data...</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={revenueData?.labels.map((label, index) => ({
                        date: label,
                        amount: revenueData.data[index]
                      }))}
                      margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis 
                        dataKey="date" 
                        angle={-45} 
                        textAnchor="end" 
                        height={70} 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis tickFormatter={(value) => formatCurrency(Number(value))} />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(Number(value)), "Revenue"]}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Bar dataKey="amount" name="Revenue" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Total revenue: <span className="font-medium">{formatCurrency(revenueData?.data.reduce((a, b) => a + b, 0) || 0)}</span>
                </p>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="membership" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Membership Distribution</CardTitle>
                  <CardDescription>
                    Breakdown of membership activity
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                  {membershipLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <p>Loading membership data...</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={membershipData?.labels.map((label, index) => ({
                            name: label,
                            value: membershipData.data[index]
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {membershipData?.data.map((entry, index) => (
                            <RechartsCell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend verticalAlign="bottom" />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Membership Summary</CardTitle>
                  <CardDescription>
                    Key statistics for the selected period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">New Memberships</p>
                        <p className="text-2xl font-bold">{membershipData?.data[0] || 0}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Renewals</p>
                        <p className="text-2xl font-bold">{membershipData?.data[1] || 0}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Expired</p>
                        <p className="text-2xl font-bold">{membershipData?.data[2] || 0}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Cancelled</p>
                        <p className="text-2xl font-bold">{membershipData?.data[3] || 0}</p>
                      </div>
                    </div>
                    <div className="pt-2">
                      <p className="text-sm font-medium">Total Growth</p>
                      <p className="text-2xl font-bold">
                        {membershipData ? membershipData.data[0] + membershipData.data[1] - membershipData.data[2] - membershipData.data[3] : 0}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        (New + Renewals - Expired - Cancelled)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default ReportsDashboard;
