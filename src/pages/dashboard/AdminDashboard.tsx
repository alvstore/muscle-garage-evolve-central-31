
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  CreditCard, 
  Users, 
  CalendarCheck, 
  DollarSign, 
  TrendingUp, 
  Gift, 
  Activity 
} from 'lucide-react';

import OverviewStats from '@/components/dashboard/sections/OverviewStats';
import RevenueSection from '@/components/dashboard/sections/RevenueSection';
import MemberStatusSection from '@/components/dashboard/sections/MemberStatusSection';
import AttendanceSection from '@/components/dashboard/sections/AttendanceSection';
import MemberProgressSection from '@/components/dashboard/sections/MemberProgressSection';
import ChurnPredictionSection from '@/components/dashboard/sections/ChurnPredictionSection';

const AdminDashboard = () => {
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

  const featuredActions = [
    {
      title: "Member Registration",
      description: "Quickly register new members with form validation",
      icon: <Users className="h-10 w-10 text-indigo-500" />,
      url: "/members/new"
    },
    {
      title: "Add New Class",
      description: "Create and schedule new fitness classes",
      icon: <CalendarCheck className="h-10 w-10 text-indigo-500" />,
      url: "/classes"
    },
    {
      title: "Process Payment",
      description: "Process membership payments and invoices",
      icon: <CreditCard className="h-10 w-10 text-indigo-500" />,
      url: "/finance/transactions"
    },
    {
      title: "Attendance Tracking",
      description: "Track member check-ins and attendance",
      icon: <Activity className="h-10 w-10 text-indigo-500" />,
      url: "/attendance"
    },
    {
      title: "Create Promotion",
      description: "Set up referral programs and special offers",
      icon: <Gift className="h-10 w-10 text-indigo-500" />,
      url: "/marketing/promo"
    },
    {
      title: "Financial Reports",
      description: "View revenue and financial analytics",
      icon: <DollarSign className="h-10 w-10 text-indigo-500" />,
      url: "/finance/dashboard"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to Muscle Garage management system</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-8">
            Date Range
          </Button>
          <Button variant="default" className="h-8 bg-indigo-600 hover:bg-indigo-700">
            Export
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Overview Stats */}
        <OverviewStats data={dashboardData} />
        
        {/* New Smart Dashboard Components */}
        <div className="grid gap-6 md:grid-cols-2">
          <MemberProgressSection />
          <ChurnPredictionSection />
        </div>
        
        {/* Featured Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredActions.map((action, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{action.description}</p>
                    <Button variant="ghost" className="mt-3 px-0 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 hover:bg-transparent" asChild>
                      <a href={action.url}>Show</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Analytics Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <RevenueSection data={revenueData} />
          <MemberStatusSection data={membersByStatus} />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <AttendanceSection data={attendanceTrend} />
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Commonly used gym management tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20" asChild>
                  <a href="/inventory">
                    <FileText className="h-5 w-5 text-indigo-500" />
                    <span>Inventory</span>
                  </a>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20" asChild>
                  <a href="/communication/announcements">
                    <TrendingUp className="h-5 w-5 text-indigo-500" />
                    <span>Announcements</span>
                  </a>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20" asChild>
                  <a href="/store">
                    <CreditCard className="h-5 w-5 text-indigo-500" />
                    <span>Store</span>
                  </a>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20" asChild>
                  <a href="/settings">
                    <DollarSign className="h-5 w-5 text-indigo-500" />
                    <span>Settings</span>
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
