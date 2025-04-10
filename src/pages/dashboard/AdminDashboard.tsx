import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from 'lucide-react';
import { Feedback } from '@/types/notification';

import DashboardHeader from '@/components/dashboard/sections/DashboardHeader';
import OverviewStats from '@/components/dashboard/sections/OverviewStats';
import RevenueSection from '@/components/dashboard/sections/RevenueSection';
import MemberStatusSection from '@/components/dashboard/sections/MemberStatusSection';
import AttendanceSection from '@/components/dashboard/sections/AttendanceSection';
import RenewalsSection from '@/components/dashboard/sections/RenewalsSection';
import ActivitySection from '@/components/dashboard/sections/ActivitySection';
import MemberProgressSection from '@/components/dashboard/sections/MemberProgressSection';
import ChurnPredictionSection from '@/components/dashboard/sections/ChurnPredictionSection';
import FeedbackSection from '@/components/dashboard/sections/FeedbackSection';
import ClassesSection from '@/components/dashboard/sections/ClassesSection';

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
    { month: 'Jan', revenue: 15000, expenses: 4000, profit: 11000 },
    { month: 'Feb', revenue: 18000, expenses: 4200, profit: 13800 },
    { month: 'Mar', revenue: 16500, expenses: 4800, profit: 11700 },
    { month: 'Apr', revenue: 17800, expenses: 5100, profit: 12700 },
    { month: 'May', revenue: 19200, expenses: 5400, profit: 13800 },
    { month: 'Jun', revenue: 21000, expenses: 5600, profit: 15400 }
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
      <DashboardHeader />

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
          <OverviewStats data={dashboardData} />
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <RevenueSection data={revenueData} />
            <MemberStatusSection data={membersByStatus} />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <AttendanceSection data={attendanceTrend} />
            <RenewalsSection />
          </div>

          <ActivitySection />
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <MemberProgressSection />
            <ChurnPredictionSection />
          </div>
          
          <FeedbackSection data={recentFeedback} />
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <ClassesSection />
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
