import React, { useState, useEffect } from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import OverviewStats from '@/components/dashboard/sections/OverviewStats';
import PendingPayments from '@/components/dashboard/PendingPayments';
import UpcomingRenewals from '@/components/dashboard/UpcomingRenewals';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useBranch } from '@/hooks/use-branch';
import { Payment, RenewalItem } from '@/types/dashboard';

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
          <Badge variant="outline" className="px-4 py-2">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Badge>
        </div>
        
        <OverviewStats data={dashboardData} />
        
        <Tabs defaultValue="daily" className="mt-8">
          <TabsList>
            <TabsTrigger value="daily">Daily Snapshot</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="membershipmetrics">Membership Metrics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <PendingPayments payments={pendingPayments} />
              <UpcomingRenewals renewals={upcomingRenewals} />
            </div>
          </TabsContent>
          
          <TabsContent value="attendance" className="space-y-4 mt-4">
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
                
                <div className="mt-6 flex justify-end">
                  <Button onClick={() => window.location.href = "/attendance"}>
                    View Detailed Attendance
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="financial" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Financial Dashboard</CardTitle>
                <CardDescription>Revenue and payment metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                    <h3 className="text-lg font-medium">Monthly Revenue</h3>
                    <p className="text-3xl font-bold mt-2">₹{dashboardData.revenue.thisMonth.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {Math.round((dashboardData.revenue.thisMonth - dashboardData.revenue.lastMonth) / dashboardData.revenue.lastMonth * 100)}% from last month
                    </p>
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg text-center">
                    <h3 className="text-lg font-medium">Pending Payments</h3>
                    <p className="text-3xl font-bold mt-2">₹{dashboardData.pendingPayments.total.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      From {dashboardData.pendingPayments.count} members
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                    <h3 className="text-lg font-medium">Weekly Revenue</h3>
                    <p className="text-3xl font-bold mt-2">₹{dashboardData.revenue.thisWeek.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground mt-1">Current week</p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button onClick={() => window.location.href = "/finance/reports"}>
                    View Financial Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="membershipmetrics" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Membership Metrics</CardTitle>
                <CardDescription>Member growth and retention statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg text-center">
                    <h3 className="text-lg font-medium">Total Members</h3>
                    <p className="text-3xl font-bold mt-2">{dashboardData.totalMembers}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {dashboardData.activeMembers} active ({Math.round(dashboardData.activeMembers/dashboardData.totalMembers*100)}%)
                    </p>
                  </div>
                  
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg text-center">
                    <h3 className="text-lg font-medium">New Members</h3>
                    <p className="text-3xl font-bold mt-2">{dashboardData.newMembersToday}</p>
                    <p className="text-sm text-muted-foreground mt-1">Joined today</p>
                  </div>
                  
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg text-center">
                    <h3 className="text-lg font-medium">Upcoming Renewals</h3>
                    <p className="text-3xl font-bold mt-2">{dashboardData.upcomingRenewals.thisWeek}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {dashboardData.upcomingRenewals.today} due today
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button onClick={() => window.location.href = "/reports"}>
                    View Member Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default AdminDashboard;
