
import { useState, useEffect } from "react";
import { Users, DollarSign, UserCheck, Calendar, Clock, RefreshCcw } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import AttendanceChart from "@/components/dashboard/AttendanceChart";
import MemberStatusChart from "@/components/dashboard/MemberStatusChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import UpcomingClasses from "@/components/dashboard/UpcomingClasses";
import PendingPayments from "@/components/dashboard/PendingPayments";
import Announcements from "@/components/dashboard/Announcements";
import { mockDashboardSummary, mockClasses, mockAnnouncements } from "@/data/mockData";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(mockDashboardSummary);
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDashboardData(mockDashboardSummary);
      setIsLoading(false);
    }, 1000);
  }, []);

  const memberStatusData = [
    { name: "Active", value: dashboardData.membersByStatus.active, color: "#38a169" },
    { name: "Inactive", value: dashboardData.membersByStatus.inactive, color: "#f6ad55" },
    { name: "Expired", value: dashboardData.membersByStatus.expired, color: "#e53e3e" },
  ];

  const recentActivities = [
    {
      id: "1",
      title: "New Member Registration",
      description: "Sarah Parker has registered as a new member",
      user: {
        name: "Sarah Parker",
        avatar: "/placeholder.svg",
      },
      time: "10 minutes ago",
      type: "membership" as const,
    },
    {
      id: "2",
      title: "Class Attendance",
      description: "Michael Wong checked in for HIIT Extreme class",
      user: {
        name: "Michael Wong",
        avatar: "/placeholder.svg",
      },
      time: "30 minutes ago",
      type: "check-in" as const,
    },
    {
      id: "3",
      title: "Payment Received",
      description: "Emily Davidson paid $99 for Standard Monthly membership",
      user: {
        name: "Emily Davidson",
        avatar: "/placeholder.svg",
      },
      time: "1 hour ago",
      type: "payment" as const,
    },
    {
      id: "4",
      title: "New Class Booking",
      description: "Jordan Lee booked a spot in Power Yoga class",
      user: {
        name: "Jordan Lee",
        avatar: "/placeholder.svg",
      },
      time: "2 hours ago",
      type: "class" as const,
    },
  ];

  const pendingPayments = [
    {
      id: "payment1",
      memberId: "member2",
      memberName: "Sarah Parker",
      memberAvatar: "/placeholder.svg",
      membershipPlan: "Standard Monthly",
      amount: 99,
      dueDate: "2023-07-25T00:00:00Z",
      status: "pending" as const,
      contactInfo: "+1234567894",
    },
    {
      id: "payment2",
      memberId: "member5",
      memberName: "David Miller",
      memberAvatar: "/placeholder.svg",
      membershipPlan: "Premium Annual",
      amount: 999,
      dueDate: "2023-07-15T00:00:00Z",
      status: "overdue" as const,
      contactInfo: "+1234567897",
    },
    {
      id: "payment3",
      memberId: "member3",
      memberName: "Michael Wong",
      memberAvatar: "/placeholder.svg",
      membershipPlan: "Basic Quarterly",
      amount: 249,
      dueDate: "2023-07-30T00:00:00Z",
      status: "pending" as const,
      contactInfo: "+1234567895",
    },
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button 
          size="sm" 
          variant="outline" 
          className="flex items-center gap-1"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          title="Total Members"
          value={isLoading ? "Loading..." : dashboardData.totalMembers}
          description="Total active and inactive members"
          trend={{ direction: "up", value: "+5% from last month" }}
          iconColor="text-blue-600"
        />
        <StatCard
          icon={UserCheck}
          title="Today's Check-ins"
          value={isLoading ? "Loading..." : dashboardData.todayCheckIns}
          description="Members visited today"
          trend={{ direction: "neutral", value: "Average daily: 85" }}
          iconColor="text-green-600"
        />
        <StatCard
          icon={DollarSign}
          title="Monthly Revenue"
          value={isLoading ? "Loading..." : `$${dashboardData.revenue.monthly.toLocaleString()}`}
          description="Total revenue this month"
          trend={{ direction: "up", value: "+12% from last month" }}
          iconColor="text-purple-600"
        />
        <StatCard
          icon={Calendar}
          title="Upcoming Renewals"
          value={isLoading ? "Loading..." : dashboardData.upcomingRenewals}
          description="Memberships expiring in 7 days"
          trend={{ direction: "down", value: "-2 from last week" }}
          iconColor="text-orange-600"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="h-80 animate-pulse rounded-lg bg-muted"></div>
          ) : (
            <AttendanceChart data={dashboardData.attendanceTrend} />
          )}
        </div>
        <div>
          {isLoading ? (
            <div className="h-80 animate-pulse rounded-lg bg-muted"></div>
          ) : (
            <MemberStatusChart data={memberStatusData} />
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          {isLoading ? (
            <div className="h-96 animate-pulse rounded-lg bg-muted"></div>
          ) : (
            <RecentActivity activities={recentActivities} />
          )}
        </div>
        <div>
          {isLoading ? (
            <div className="h-96 animate-pulse rounded-lg bg-muted"></div>
          ) : (
            <UpcomingClasses classes={mockClasses} />
          )}
        </div>
        <div>
          {isLoading ? (
            <div className="h-96 animate-pulse rounded-lg bg-muted"></div>
          ) : (
            <div className="space-y-4">
              <PendingPayments payments={pendingPayments} />
              <Announcements announcements={mockAnnouncements} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
