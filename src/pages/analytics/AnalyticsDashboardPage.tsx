import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboard } from '@/hooks/use-dashboard';
import { Container } from '@/components/ui/container';
import { Skeleton } from '@/components/ui/skeleton';

interface ChartData {
  name: string;
  total: number;
  members: number;
}

interface RevenueData {
  name: string;
  total: number;
  expenses: number;
  profit: number;
}

interface GrowthData {
  name: string;
  growth: number;
}

const AnalyticsDashboardPage = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState<RevenueData[]>([]);
  const [membershipGrowthData, setMembershipGrowthData] = useState<GrowthData[]>([]);
  const { data, isLoading } = useDashboard();

  useEffect(() => {
    // Convert chart data to the new format with 3 parameters
    setChartData([
      { name: 'Jan', total: 1200, members: 32 },
      { name: 'Feb', total: 1500, members: 40 },
      { name: 'Mar', total: 1800, members: 45 },
      { name: 'Apr', total: 2000, members: 55 },
      { name: 'May', total: 2400, members: 70 },
      { name: 'Jun', total: 2800, members: 85 },
      { name: 'Jul', total: 3200, members: 90 },
    ]);

    setMonthlyRevenueData([
      { name: 'Jan', total: 15000, expenses: 5000, profit: 10000 },
      { name: 'Feb', total: 18000, expenses: 5500, profit: 12500 },
      { name: 'Mar', total: 21000, expenses: 6000, profit: 15000 },
      { name: 'Apr', total: 24000, expenses: 6500, profit: 17500 },
      { name: 'May', total: 28000, expenses: 7000, profit: 21000 },
      { name: 'Jun', total: 32000, expenses: 7500, profit: 24500 },
      { name: 'Jul', total: 36000, expenses: 8000, profit: 28000 },
    ]);

    setMembershipGrowthData([
      { name: 'Jan', growth: 10 },
      { name: 'Feb', growth: 15 },
      { name: 'Mar', growth: 20 },
      { name: 'Apr', growth: 25 },
      { name: 'May', growth: 30 },
      { name: 'Jun', growth: 35 },
      { name: 'Jul', growth: 40 },
    ]);
  }, []);

  // Calculate statistics
  const totalRevenue = monthlyRevenueData.reduce((sum, month) => sum + month.total, 0);
  const averageRevenue = totalRevenue / monthlyRevenueData.length;
  const totalGrowth = membershipGrowthData.reduce((sum, month) => sum + month.growth, 0);
  const averageGrowth = totalGrowth / membershipGrowthData.length;

  // Type-safe access to data arrays
  const activeMembers = Array.isArray(data.members) ? data.members.length : 0;
  const activeTrainers = Array.isArray(data.trainers) ? data.trainers.length : 0;
  const activeClasses = Array.isArray(data.classes) ? data.classes.length : 0;

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive insights into your gym's performance
        </p>

        <div className="grid gap-4 mt-8 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
              <CardDescription>Over the past 7 months</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-4 w-[100px]" />
              ) : (
                <div className="text-2xl font-bold">${totalRevenue}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average Revenue</CardTitle>
              <CardDescription>Per month</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-4 w-[100px]" />
              ) : (
                <div className="text-2xl font-bold">${averageRevenue.toFixed(2)}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Members</CardTitle>
              <CardDescription>Currently subscribed</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-4 w-[100px]" />
              ) : (
                <div className="text-2xl font-bold">{activeMembers}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Membership Growth</CardTitle>
              <CardDescription>Average monthly growth</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-4 w-[100px]" />
              ) : (
                <div className="text-2xl font-bold">{averageGrowth.toFixed(2)}%</div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 mt-8 md:grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Revenue and Members</CardTitle>
              <CardDescription>Monthly revenue and new members</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="total" stroke="#8884d8" fill="#8884d8" name="Revenue" />
                  <Area type="monotone" dataKey="members" stroke="#82ca9d" fill="#82ca9d" name="Members" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <CardDescription>Revenue, expenses, and profit over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="total" stroke="#8884d8" fill="#8884d8" name="Revenue" />
                  <Area type="monotone" dataKey="expenses" stroke="#ffc658" fill="#ffc658" name="Expenses" />
                  <Area type="monotone" dataKey="profit" stroke="#82ca9d" fill="#82ca9d" name="Profit" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 mt-8 md:grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Membership Growth</CardTitle>
              <CardDescription>New members added each month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={membershipGrowthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="growth" stroke="#82ca9d" fill="#82ca9d" name="Growth" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gym Statistics</CardTitle>
              <CardDescription>Key metrics about your gym</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <>
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span>Active Members:</span>
                    <span className="font-bold">{activeMembers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Active Trainers:</span>
                    <span className="font-bold">{activeTrainers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Active Classes:</span>
                    <span className="font-bold">{activeClasses}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default AnalyticsDashboardPage;
