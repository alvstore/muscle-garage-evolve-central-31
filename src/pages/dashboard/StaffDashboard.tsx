
import { useState, useEffect } from "react";
import { Users, DollarSign, UserCheck, CalendarCheck2, RefreshCcw } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import AttendanceChart from "@/components/dashboard/AttendanceChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import PendingPayments from "@/components/dashboard/PendingPayments";
import UpcomingRenewals from "@/components/dashboard/UpcomingRenewals";
import Announcements from "@/components/dashboard/Announcements";
import { Button } from "@/components/ui/button";
import { mockDashboardSummary } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Announcement } from "@/types/notification";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RenewalsSection from "@/components/dashboard/sections/RenewalsSection";
import RevenueSection from "@/components/dashboard/sections/RevenueSection";
import { useBranch } from "@/hooks/use-branch";

const StaffDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(mockDashboardSummary);
  const { toast } = useToast();
  const { currentBranch } = useBranch();
  
  useEffect(() => {
    // Simulate API call with branch-specific filter
    setTimeout(() => {
      // In a real implementation, you would fetch data filtered by branch ID
      console.log(`Loading branch-specific data for branch: ${currentBranch?.id}`);
      setDashboardData(mockDashboardSummary);
      setIsLoading(false);
    }, 1000);
  }, [currentBranch]);

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
    }
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
    }
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
    }
  ];

  const mockAnnouncements: Announcement[] = [
    {
      id: "announcement1",
      title: "Gym Closure for Maintenance",
      content: "The gym will be closed on July 15th for routine maintenance. We apologize for any inconvenience.",
      authorId: "admin1",
      authorName: "Admin User",
      createdAt: "2023-07-10T10:00:00Z",
      priority: "high",
      targetRoles: ["member", "trainer", "staff"],
      channels: ["in-app", "email"],
      sentCount: 120,
      forRoles: ["member", "trainer", "staff"],
      createdBy: "admin1"
    },
    {
      id: "announcement2",
      title: "New Fitness Classes Added",
      content: "We're excited to announce new Zumba and Pilates classes starting next week!",
      authorId: "admin1",
      authorName: "Admin User",
      createdAt: "2023-07-12T14:30:00Z",
      priority: "medium",
      targetRoles: ["member", "trainer"],
      channels: ["in-app", "email"],
      sentCount: 98,
      forRoles: ["member", "trainer"],
      createdBy: "admin1"
    }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 8500, expenses: 2500, profit: 6000 },
    { month: 'Feb', revenue: 9200, expenses: 2800, profit: 6400 },
    { month: 'Mar', revenue: 8800, expenses: 2600, profit: 6200 },
    { month: 'Apr', revenue: 9500, expenses: 2700, profit: 6800 },
    { month: 'May', revenue: 10200, expenses: 2900, profit: 7300 },
    { month: 'Jun', revenue: 11500, expenses: 3100, profit: 8400 }
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Dashboard</h1>
          <p className="text-muted-foreground">
            Branch: {currentBranch?.name || 'Unknown Branch'}
          </p>
        </div>
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
          description="Active and inactive members"
          iconColor="text-blue-600"
        />
        <StatCard
          icon={UserCheck}
          title="Today's Check-ins"
          value={isLoading ? "Loading..." : dashboardData.todayCheckIns}
          description="Members visited today"
          iconColor="text-green-600"
        />
        <StatCard
          icon={DollarSign}
          title="Pending Payments"
          value={isLoading ? "Loading..." : `$${dashboardData.pendingPayments.total}`}
          description={`${dashboardData.pendingPayments.count} invoices pending`}
          iconColor="text-purple-600"
        />
        <StatCard
          icon={CalendarCheck2}
          title="Upcoming Renewals"
          value={isLoading ? "Loading..." : dashboardData.upcomingRenewals}
          description="Expiring in the next 7 days"
          iconColor="text-amber-600"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
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
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <RevenueSection data={revenueData} />
              </CardContent>
            </Card>
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
            <PendingPayments payments={pendingPayments} />
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
    </div>
  );
};

export default StaffDashboard;
