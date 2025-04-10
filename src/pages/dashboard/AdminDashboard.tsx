
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { MemberStatusChart } from '@/components/dashboard/MemberStatusChart';
import { AttendanceChart } from '@/components/dashboard/AttendanceChart';
import { StatCard } from '@/components/dashboard/StatCard';
import { UpcomingClasses } from '@/components/dashboard/UpcomingClasses';
import { UpcomingRenewals } from '@/components/dashboard/UpcomingRenewals';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { PendingPayments } from '@/components/dashboard/PendingPayments';
import { Announcements } from '@/components/dashboard/Announcements';
import { FeedbackSummaryChart } from '@/components/dashboard/FeedbackSummaryChart';
import { MemberProgressChart } from '@/components/dashboard/MemberProgressChart';
import { ClassAttendanceWidget } from '@/components/dashboard/ClassAttendanceWidget';
import { ChurnPredictionWidget } from '@/components/dashboard/ChurnPredictionWidget';
import { ArrowUpRight, Calendar, Clock, DollarSign, Heart, Users } from 'lucide-react';
import { Feedback } from '@/types/notification';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for dashboard
  const dashboardData = {
    totalMembers: 328,
    newMembersToday: 5,
    activeMembers: 287,
    attendanceToday: 152,
    revenue: {
      today: 2450,
      thisWeek: 12780,
      thisMonth: 45600,
      lastMonth: 39800
    },
    pendingPayments: {
      count: 23,
      total: 8750
    },
    upcomingRenewals: {
      today: 3,
      thisWeek: 18,
      thisMonth: 42
    },
    classAttendance: {
      today: 152,
      yesterday: 143,
      lastWeek: 982
    }
  };

  const membersByStatus = {
    active: 287,
    inactive: 24,
    expired: 17
  };

  const attendanceTrend = [
    { date: '2022-06-01', count: 120 },
    { date: '2022-06-02', count: 132 },
    { date: '2022-06-03', count: 125 },
    { date: '2022-06-04', count: 140 },
    { date: '2022-06-05', count: 147 },
    { date: '2022-06-06', count: 138 },
    { date: '2022-06-07', count: 152 }
  ];

  const revenueData = [
    { date: 'Jan', membership: 15000, supplements: 4000, classes: 2000 },
    { date: 'Feb', membership: 18000, supplements: 4200, classes: 2200 },
    { date: 'Mar', membership: 16500, supplements: 4800, classes: 2400 },
    { date: 'Apr', membership: 17800, supplements: 5100, classes: 2600 },
    { date: 'May', membership: 19200, supplements: 5400, classes: 2800 },
    { date: 'Jun', membership: 21000, supplements: 5600, classes: 3000 }
  ];

  const recentFeedback: Feedback[] = [
    {
      id: "feedback1",
      memberId: "member1",
      memberName: "David Miller",
      type: "class",
      relatedId: "class1",
      rating: 4,
      comments: "Great class, but the room was a bit crowded.",
      createdAt: "2023-06-15T10:30:00Z",
      anonymous: false,
      title: "HIIT Class Review"
    },
    {
      id: "feedback2",
      memberId: "member2",
      memberName: "Sarah Parker",
      type: "trainer",
      relatedId: "trainer1",
      rating: 5,
      comments: "Excellent trainer, very motivating!",
      createdAt: "2023-06-16T14:20:00Z",
      anonymous: false,
      title: "Trainer Review"
    },
    {
      id: "feedback3",
      memberId: "member3",
      type: "fitness-plan",
      relatedId: "plan1",
      rating: 3,
      comments: "Plan is good but too challenging for beginners.",
      createdAt: "2023-06-17T09:15:00Z",
      anonymous: true,
      title: "Fitness Plan Feedback"
    },
    {
      id: "feedback4",
      memberId: "member4",
      memberName: "Emily Davidson",
      type: "general",
      rating: 2,
      comments: "The gym needs better ventilation.",
      createdAt: "2023-06-18T16:45:00Z",
      anonymous: false,
      title: "Facility Feedback"
    },
    {
      id: "feedback5",
      memberId: "member5",
      memberName: "Michael Wong",
      type: "class",
      relatedId: "class2",
      rating: 5,
      comments: "Best HIIT class I've ever taken!",
      createdAt: "2023-06-19T11:30:00Z",
      anonymous: false,
      title: "Yoga Class Review"
    }
  ];

  return (
    <div className="space-y-6 p-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Date Range
          </Button>
          <Button variant="default" size="sm">
            Export Report
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="trainers">Trainers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Members"
              value={dashboardData.totalMembers}
              description={`+${dashboardData.newMembersToday} today`}
              trend="up"
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
            />
            <StatCard
              title="Today's Attendance"
              value={dashboardData.attendanceToday}
              description={`${Math.round((dashboardData.attendanceToday / dashboardData.activeMembers) * 100)}% of active members`}
              trend="up"
              icon={<Clock className="h-4 w-4 text-muted-foreground" />}
            />
            <StatCard
              title="Revenue (Month)"
              value={`₹${dashboardData.revenue.thisMonth}`}
              description={`+${Math.round(((dashboardData.revenue.thisMonth - dashboardData.revenue.lastMonth) / dashboardData.revenue.lastMonth) * 100)}% from last month`}
              trend="up"
              icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            />
            <StatCard
              title="Active Members"
              value={dashboardData.activeMembers}
              description={`${Math.round((dashboardData.activeMembers / dashboardData.totalMembers) * 100)}% of total members`}
              trend="up"
              icon={<Heart className="h-4 w-4 text-muted-foreground" />}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>
                  Monthly revenue breakdown by category
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <RevenueChart data={revenueData} />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Member Status</CardTitle>
                <CardDescription>
                  Current membership status breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MemberStatusChart data={membersByStatus} />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Attendance Trend</CardTitle>
                <CardDescription>
                  Daily attendance over the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <AttendanceChart data={attendanceTrend} />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Upcoming Renewals</CardTitle>
                <CardDescription>
                  Memberships up for renewal soon
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UpcomingRenewals />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest check-ins and transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivity />
              </CardContent>
            </Card>

            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Pending Payments</CardTitle>
                <CardDescription>
                  Unpaid invoices and due dates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PendingPayments />
              </CardContent>
            </Card>

            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Announcements</CardTitle>
                <CardDescription>
                  Latest news and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Announcements />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Member Progress</CardTitle>
                <CardDescription>
                  Average fitness metrics over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MemberProgressChart />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Churn Prediction</CardTitle>
                <CardDescription>
                  Members at risk of not renewing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChurnPredictionWidget />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Member Feedback</CardTitle>
              <CardDescription>
                Recent member reviews and ratings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FeedbackSummaryChart data={recentFeedback} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Class Attendance</CardTitle>
                <CardDescription>
                  Attendance by class type for this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClassAttendanceWidget />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Upcoming Classes</CardTitle>
                <CardDescription>
                  Classes scheduled in the next 48 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UpcomingClasses />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          {/* Similar content for payments tab */}
        </TabsContent>

        <TabsContent value="trainers" className="space-y-4">
          {/* Similar content for trainers tab */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
