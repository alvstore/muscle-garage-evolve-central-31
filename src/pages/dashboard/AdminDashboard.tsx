
import React, { useState, useEffect } from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, Users, CreditCard, Calendar, CheckSquare, Activity, RefreshCcw, BarChart2, DollarSign, User, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useBranch } from '@/hooks/use-branch';
import { Payment, RenewalItem } from '@/types/dashboard';
import StatisticsCard from '@/components/dashboard/charts/StatisticsCard';
import RevenueChart from '@/components/dashboard/charts/RevenueChart';
import BarChart from '@/components/dashboard/charts/BarChart';
import RadialBarChart from '@/components/dashboard/charts/RadialBarChart';
import DailySalesOverview from '@/components/dashboard/analytics/DailySalesOverview';
import AnalyticsSummary from '@/components/dashboard/analytics/AnalyticsSummary';
import PendingPayments from '@/components/dashboard/PendingPayments';
import UpcomingRenewals from '@/components/dashboard/UpcomingRenewals';

// Mock dashboard data
const dashboardData = {
  totalMembers: 312,
  newMembersToday: 3,
  activeMembers: 286,
  attendanceToday: 78,
  revenue: {
    today: 2850,
    thisWeek: 12400,
    thisMonth: 48750,
    lastMonth: 42300
  },
  pendingPayments: {
    count: 14,
    total: 2850
  },
  upcomingRenewals: {
    today: 2,
    thisWeek: 8,
    thisMonth: 25
  },
  classAttendance: {
    today: 78,
    yesterday: 82,
    lastWeek: 432
  }
};

// Mock payments data with proper typing for the status field
const pendingPayments: Payment[] = [
  {
    id: "pay1",
    memberId: "mem1",
    memberName: "Alex Johnson",
    memberAvatar: "/placeholder.svg",
    membershipPlan: "Premium Monthly",
    amount: 59.99,
    dueDate: "2025-04-12T00:00:00Z",
    status: "pending",
    contactInfo: "alex.j@example.com"
  },
  {
    id: "pay2",
    memberId: "mem2",
    memberName: "Sarah Miller",
    memberAvatar: "/placeholder.svg",
    membershipPlan: "Annual Plan",
    amount: 499.99,
    dueDate: "2025-04-15T00:00:00Z",
    status: "pending",
    contactInfo: "sarahm@example.com"
  },
  {
    id: "pay3",
    memberId: "mem3",
    memberName: "Dave Wilson",
    memberAvatar: "/placeholder.svg",
    membershipPlan: "Basic Monthly",
    amount: 29.99,
    dueDate: "2025-04-05T00:00:00Z",
    status: "overdue",
    contactInfo: "dave.w@example.com"
  }
];

// Mock renewals data with proper typing for the status field
const upcomingRenewals: RenewalItem[] = [
  {
    id: "renew1",
    memberName: "Michael Chang",
    memberAvatar: "/placeholder.svg",
    membershipPlan: "Premium Monthly",
    expiryDate: "2025-04-11T00:00:00Z",
    status: "active",
    renewalAmount: 59.99
  },
  {
    id: "renew2",
    memberName: "Jennifer Lopez",
    memberAvatar: "/placeholder.svg",
    membershipPlan: "Basic Monthly",
    expiryDate: "2025-04-15T00:00:00Z",
    status: "active",
    renewalAmount: 29.99
  },
  {
    id: "renew3",
    memberName: "Robert Brown",
    memberAvatar: "/placeholder.svg",
    membershipPlan: "Premium Monthly",
    expiryDate: "2025-04-10T00:00:00Z",
    status: "active",
    renewalAmount: 59.99
  }
];

// Mock attendance data by branch
const attendanceByBranch = {
  "branch1": {
    todayCheckins: 78,
    yesterdayCheckins: 82,
    thisWeekCheckins: 312,
    peakHours: ["18:00", "19:00", "17:00"],
  },
  "branch2": {
    todayCheckins: 64,
    yesterdayCheckins: 72,
    thisWeekCheckins: 280,
    peakHours: ["17:00", "18:00", "12:00"],
  },
  "branch3": {
    todayCheckins: 53,
    yesterdayCheckins: 61,
    thisWeekCheckins: 245,
    peakHours: ["18:00", "19:00", "20:00"],
  }
};

// Mock revenue data
const revenueData = {
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  values: [28000, 32000, 36000, 29000, 38000, 42000, 48750, 45000, 49000, 52000, 55000, 60000]
};

// Mock monthly attendance data
const attendanceData = {
  dates: ['Apr 1', 'Apr 2', 'Apr 3', 'Apr 4', 'Apr 5', 'Apr 6', 'Apr 7', 'Apr 8', 'Apr 9', 'Apr 10'],
  values: [65, 72, 78, 69, 82, 91, 78, 85, 79, 78]
};

// Mock membership plan data
const membershipPlans = [
  { name: 'Basic', count: 89 },
  { name: 'Standard', count: 125 },
  { name: 'Premium', count: 72 },
  { name: 'Annual', count: 26 }
];

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { currentBranch } = useBranch();
  const branchId = currentBranch?.id || "branch1";
  
  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-2">Loading dashboard data...</p>
          </div>
        </div>
      </Container>
    );
  }
  
  // Get branch-specific data
  const branchAttendance = attendanceByBranch[branchId] || attendanceByBranch.branch1;
  
  return (
    <Container>
      <div className="py-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Overview and analytics for {currentBranch?.name || "all branches"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-4 py-2">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Badge>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={() => {}}
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {/* Top Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatisticsCard
                title="Total Members"
                value={dashboardData.totalMembers}
                subtitle={`${dashboardData.newMembersToday} new today`}
                icon={Users}
                iconColor="text-blue-600"
                iconBgColor="bg-blue-100 dark:bg-blue-900/30"
                percentChange={1.2}
              />
              
              <StatisticsCard
                title="Today's Check-ins"
                value={dashboardData.attendanceToday}
                subtitle={`${((dashboardData.attendanceToday / dashboardData.activeMembers) * 100).toFixed(1)}% of active members`}
                icon={CheckSquare}
                iconColor="text-green-600"
                iconBgColor="bg-green-100 dark:bg-green-900/30"
                percentChange={-4.8}
              />
              
              <StatisticsCard
                title="Monthly Revenue"
                value={`₹${dashboardData.revenue.thisMonth.toLocaleString()}`}
                subtitle={`₹${dashboardData.revenue.thisWeek.toLocaleString()} this week`}
                icon={CreditCard}
                iconColor="text-purple-600"
                iconBgColor="bg-purple-100 dark:bg-purple-900/30"
                percentChange={15.3}
              />
              
              <StatisticsCard
                title="Upcoming Renewals"
                value={dashboardData.upcomingRenewals.thisWeek}
                subtitle={`${dashboardData.upcomingRenewals.today} due today`}
                icon={Calendar}
                iconColor="text-amber-600"
                iconBgColor="bg-amber-100 dark:bg-amber-900/30"
                percentChange={3.5}
              />
            </div>
            
            {/* Key Performance Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <DailySalesOverview 
                salesData={{
                  today: dashboardData.revenue.today,
                  yesterday: dashboardData.revenue.today * 0.92,
                  weekly: dashboardData.revenue.thisWeek,
                  monthly: dashboardData.revenue.thisMonth,
                  percentChange: 8.2
                }}
              />
              
              <Card className="lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">Monthly Revenue</CardTitle>
                  <CardDescription>Total revenue generated in 2023</CardDescription>
                </CardHeader>
                <CardContent>
                  <RevenueChart 
                    title="Monthly Revenue"
                    data={revenueData.values}
                    categories={revenueData.months}
                    percentChange={15.3}
                    total={revenueData.values.reduce((sum, val) => sum + val, 0).toLocaleString()}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <PendingPayments payments={pendingPayments} />
              <UpcomingRenewals renewals={upcomingRenewals} />
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="md:col-span-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">Membership Overview</CardTitle>
                  <CardDescription>Summary of all member statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <AnalyticsSummary data={{
                    totalMembers: dashboardData.totalMembers,
                    activeMembers: dashboardData.activeMembers,
                    newMembersToday: dashboardData.newMembersToday,
                    totalRevenue: dashboardData.revenue.thisMonth,
                    revenueGrowth: 15.3,
                    activeClasses: 8,
                    attendanceToday: dashboardData.attendanceToday,
                    attendanceGrowth: -4.8
                  }} />
                </CardContent>
              </Card>
              
              <Card className="md:col-span-3">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">Attendance Trend</CardTitle>
                  <CardDescription>Daily check-ins for April 2025</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <BarChart 
                      title="Daily Attendance"
                      data={attendanceData.values}
                      categories={attendanceData.dates}
                      colors={['#7367F0']}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">Membership Plans</CardTitle>
                  <CardDescription>Distribution by plan type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {membershipPlans.map((plan, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{plan.name}</span>
                          <span className="font-medium">{plan.count}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${(plan.count / dashboardData.totalMembers) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="md:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">Member Retention</CardTitle>
                  <CardDescription>Current retention rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadialBarChart
                    title="Retention Rate"
                    value={92}
                    color="#7367F0"
                    label="Retention"
                    additionalInfo="92% of members renewed their membership in the last month"
                  />
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">Top Performing Trainers</CardTitle>
                  <CardDescription>Based on member ratings and class attendance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Sarah Johnson', rating: 4.9, members: 42, growth: 5.2 },
                      { name: 'Michael Chang', rating: 4.8, members: 38, growth: 3.7 },
                      { name: 'Alicia Rodriguez', rating: 4.7, members: 35, growth: 4.1 }
                    ].map((trainer, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-md bg-accent/10">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{trainer.name}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <span className="text-amber-500">★</span>
                              <span className="ml-1">{trainer.rating}</span>
                              <span className="mx-2">•</span>
                              <span>{trainer.members} members</span>
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          +{trainer.growth}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="attendance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Dashboard</CardTitle>
                <CardDescription>Real-time attendance metrics for {currentBranch?.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="bg-primary/10 p-4 rounded-lg text-center">
                    <h3 className="text-lg font-medium">Today's Check-ins</h3>
                    <p className="text-3xl font-bold mt-2">{branchAttendance.todayCheckins}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {branchAttendance.todayCheckins > branchAttendance.yesterdayCheckins 
                        ? `↑ ${branchAttendance.todayCheckins - branchAttendance.yesterdayCheckins} from yesterday` 
                        : `↓ ${branchAttendance.yesterdayCheckins - branchAttendance.todayCheckins} from yesterday`}
                    </p>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <h3 className="text-lg font-medium">This Week</h3>
                    <p className="text-3xl font-bold mt-2">{branchAttendance.thisWeekCheckins}</p>
                    <p className="text-sm text-muted-foreground mt-1">Total check-ins</p>
                  </div>
                  
                  <div className="bg-secondary/10 p-4 rounded-lg text-center">
                    <h3 className="text-lg font-medium">Peak Hours</h3>
                    <div className="flex justify-center gap-2 mt-3">
                      {branchAttendance.peakHours.map((hour, i) => (
                        <Badge key={i} variant={i === 0 ? "default" : i === 1 ? "secondary" : "outline"}>
                          {hour}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">Based on last 7 days</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Attendance Trend</h3>
                  <div className="h-[300px]">
                    <BarChart 
                      title="Daily Attendance"
                      data={attendanceData.values}
                      categories={attendanceData.dates}
                      colors={['#7367F0']}
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button onClick={() => window.location.href = "/attendance"}>
                    View Detailed Attendance
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="financial" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg text-center md:col-span-1">
                <h3 className="text-lg font-medium">Monthly Revenue</h3>
                <p className="text-3xl font-bold mt-2">₹{dashboardData.revenue.thisMonth.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {Math.round((dashboardData.revenue.thisMonth - dashboardData.revenue.lastMonth) / dashboardData.revenue.lastMonth * 100)}% from last month
                </p>
                <div className="flex justify-center mt-4">
                  <TrendingUp className="h-12 w-12 text-green-600" />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">Revenue Breakdown</CardTitle>
                    <CardDescription>Revenue by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: 'Membership', amount: 38250, percentage: 78.5 },
                        { name: 'Personal Training', amount: 6800, percentage: 13.9 },
                        { name: 'Classes', amount: 2450, percentage: 5.0 },
                        { name: 'Store', amount: 1250, percentage: 2.6 }
                      ].map((category, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{category.name}</span>
                            <span className="font-medium">₹{category.amount.toLocaleString()}</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                index === 0 ? 'bg-primary' :
                                index === 1 ? 'bg-indigo-500' :
                                index === 2 ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${category.percentage}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-right text-muted-foreground">
                            {category.percentage}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">Pending Payments</CardTitle>
                  <CardDescription>
                    {pendingPayments.length} payments pending for a total of ₹{
                      pendingPayments.reduce((sum, item) => sum + item.amount, 0).toLocaleString()
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PendingPayments payments={pendingPayments} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">Monthly Expense Breakdown</CardTitle>
                  <CardDescription>Expenses by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <RadialBarChart
                      title="Expense to Revenue Ratio"
                      value={68}
                      color="#FF9F43"
                      label="Expense Ratio"
                      additionalInfo="68% of revenue spent on expenses"
                    />
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

export default AdminDashboard;
