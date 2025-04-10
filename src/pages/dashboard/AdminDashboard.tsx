import { useState, useEffect } from "react";
import { Users, DollarSign, UserCheck, Calendar, Clock, RefreshCcw, FileBarChart, TrendingDown } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import AttendanceChart from "@/components/dashboard/AttendanceChart";
import MemberStatusChart from "@/components/dashboard/MemberStatusChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import UpcomingClasses from "@/components/dashboard/UpcomingClasses";
import PendingPayments from "@/components/dashboard/PendingPayments";
import UpcomingRenewals from "@/components/dashboard/UpcomingRenewals";
import Announcements from "@/components/dashboard/Announcements";
import ChurnPredictionWidget from "@/components/dashboard/ChurnPredictionWidget";
import RevenueChart from "@/components/dashboard/RevenueChart";
import FeedbackSummaryChart from "@/components/dashboard/FeedbackSummaryChart";
import { mockDashboardSummary, mockClasses, mockAnnouncements } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(mockDashboardSummary);
  const { toast } = useToast();
  
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

  const upcomingRenewals = [
    {
      id: "renewal1",
      memberName: "Emily Davidson",
      memberAvatar: "/placeholder.svg",
      membershipPlan: "Premium Annual",
      expiryDate: "2023-07-28T00:00:00Z",
      status: "active" as const,
      renewalAmount: 999
    },
    {
      id: "renewal2",
      memberName: "Michael Wong",
      memberAvatar: "/placeholder.svg",
      membershipPlan: "Basic Quarterly",
      expiryDate: "2023-07-30T00:00:00Z",
      status: "active" as const,
      renewalAmount: 249
    },
    {
      id: "renewal3",
      memberName: "Jordan Lee",
      memberAvatar: "/placeholder.svg",
      membershipPlan: "Standard Monthly",
      expiryDate: "2023-07-26T00:00:00Z",
      status: "active" as const,
      renewalAmount: 99
    }
  ];

  const churnMembers = [
    {
      id: "member1",
      name: "David Miller",
      avatar: "/placeholder.svg",
      churnRisk: 85,
      lastVisit: "15 days ago",
      missedClasses: 4,
      subscriptionEnd: "in 5 days",
      contactInfo: {
        phone: "+1234567890",
        email: "david@example.com"
      },
      factors: [
        { name: "Low Attendance", impact: "high" as const },
        { name: "Expiring Soon", impact: "high" as const },
        { name: "Ignored Messages", impact: "medium" as const }
      ]
    },
    {
      id: "member2",
      name: "Lisa Johnson",
      avatar: "/placeholder.svg",
      churnRisk: 62,
      lastVisit: "9 days ago",
      missedClasses: 2,
      subscriptionEnd: "in 12 days",
      contactInfo: {
        email: "lisa@example.com"
      },
      factors: [
        { name: "Declining Usage", impact: "medium" as const },
        { name: "Negative Feedback", impact: "high" as const }
      ]
    }
  ];

  const revenueData = [
    { month: "Jan", revenue: 15000, expenses: 10000, profit: 5000 },
    { month: "Feb", revenue: 18000, expenses: 11000, profit: 7000 },
    { month: "Mar", revenue: 17000, expenses: 10500, profit: 6500 },
    { month: "Apr", revenue: 20000, expenses: 12000, profit: 8000 },
    { month: "May", revenue: 22000, expenses: 13000, profit: 9000 },
    { month: "Jun", revenue: 25000, expenses: 14000, profit: 11000 },
  ];

  const feedbackData = [
    {
      id: "feedback1",
      memberId: "member1",
      memberName: "David Miller",
      type: "class",
      relatedId: "class1",
      rating: 4,
      comments: "Great class, but the room was a bit crowded.",
      createdAt: "2023-06-15T10:30:00Z",
      anonymous: false
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
      anonymous: false
    },
    {
      id: "feedback3",
      memberId: "member3",
      type: "fitness-plan",
      relatedId: "plan1",
      rating: 3,
      comments: "Plan is good but too challenging for beginners.",
      createdAt: "2023-06-17T09:15:00Z",
      anonymous: true
    },
    {
      id: "feedback4",
      memberId: "member4",
      memberName: "Emily Davidson",
      type: "general",
      rating: 2,
      comments: "The gym needs better ventilation.",
      createdAt: "2023-06-18T16:45:00Z",
      anonymous: false
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
      anonymous: false
    }
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    toast({
      title: "Refreshing dashboard data",
      description: "Please wait while we fetch the latest information."
    });
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Dashboard updated",
        description: "All data has been refreshed with the latest information."
      });
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
          icon={TrendingDown}
          title="Churn Risk"
          value={isLoading ? "Loading..." : churnMembers.length}
          description="Members likely to cancel"
          trend={{ direction: "down", value: "-2 from last week" }}
          iconColor="text-red-600"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
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
                <div className="space-y-4">
                  <UpcomingClasses classes={mockClasses} />
                  <UpcomingRenewals renewals={upcomingRenewals} />
                </div>
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
        </TabsContent>
        
        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="col-span-3 md:col-span-2">
              {isLoading ? (
                <div className="h-96 animate-pulse rounded-lg bg-muted"></div>
              ) : (
                <RevenueChart data={revenueData} />
              )}
            </div>
            <div>
              {isLoading ? (
                <div className="h-96 animate-pulse rounded-lg bg-muted"></div>
              ) : (
                <PendingPayments payments={pendingPayments} />
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="members" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="col-span-3 md:col-span-2">
              {isLoading ? (
                <div className="h-96 animate-pulse rounded-lg bg-muted"></div>
              ) : (
                <MemberStatusChart data={memberStatusData} />
              )}
            </div>
            <div>
              {isLoading ? (
                <div className="h-96 animate-pulse rounded-lg bg-muted"></div>
              ) : (
                <ChurnPredictionWidget members={churnMembers} />
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="feedback" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="col-span-3 md:col-span-2">
              {isLoading ? (
                <div className="h-96 animate-pulse rounded-lg bg-muted"></div>
              ) : (
                <FeedbackSummaryChart feedback={feedbackData} />
              )}
            </div>
            <div>
              {isLoading ? (
                <div className="h-96 animate-pulse rounded-lg bg-muted"></div>
              ) : (
                <Announcements announcements={mockAnnouncements} />
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
