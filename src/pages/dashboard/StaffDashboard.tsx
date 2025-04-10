import { useState, useEffect } from "react";
import { Users, DollarSign, UserCheck, CalendarCheck2, RefreshCcw } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import AttendanceChart from "@/components/dashboard/AttendanceChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import PendingPayments from "@/components/dashboard/PendingPayments";
import UpcomingRenewals from "@/components/dashboard/UpcomingRenewals";
import Announcements from "@/components/dashboard/Announcements";
import AdminTaskManagement from "@/components/dashboard/AdminTaskManagement";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockDashboardSummary, mockAnnouncements } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const StaffDashboard = () => {
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
        <h1 className="text-3xl font-bold tracking-tight">Staff Dashboard</h1>
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

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Task Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
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
                <UpcomingRenewals renewals={upcomingRenewals} />
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
        </TabsContent>
        
        <TabsContent value="tasks">
          <AdminTaskManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffDashboard;
