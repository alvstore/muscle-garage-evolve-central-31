
import { useState, useEffect } from "react";
import { Users, DollarSign, UserCheck, CalendarCheck2 } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import AttendanceChart from "@/components/dashboard/AttendanceChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import PendingPayments from "@/components/dashboard/PendingPayments";
import Announcements from "@/components/dashboard/Announcements";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { mockDashboardSummary, mockAnnouncements } from "@/data/mockData";

const StaffDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(mockDashboardSummary);
  
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
      type: "membership",
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
      type: "check-in",
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
      type: "payment",
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
      status: "pending",
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
      status: "overdue",
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
      status: "active",
      renewalAmount: 999
    },
    {
      id: "renewal2",
      memberName: "Michael Wong",
      memberAvatar: "/placeholder.svg",
      membershipPlan: "Basic Quarterly",
      expiryDate: "2023-07-30T00:00:00Z",
      status: "active",
      renewalAmount: 249
    }
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Staff Dashboard</h1>

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
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Membership Renewals</CardTitle>
              <CardDescription>Memberships expiring in the next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingRenewals.length === 0 ? (
                <p className="text-center text-muted-foreground py-6">No upcoming renewals</p>
              ) : (
                <div className="space-y-4">
                  {upcomingRenewals.map((renewal) => (
                    <div key={renewal.id} className="flex items-center justify-between space-x-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={renewal.memberAvatar} alt={renewal.memberName} />
                          <AvatarFallback>{getInitials(renewal.memberName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-none">{renewal.memberName}</p>
                          <div className="flex items-center pt-1">
                            <span className="text-xs text-muted-foreground">{renewal.membershipPlan}</span>
                            <span className="mx-1 text-xs text-muted-foreground">・</span>
                            <span className="text-xs text-muted-foreground">
                              Expires: {new Date(renewal.expiryDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">${renewal.renewalAmount}</span>
                        <Button variant="secondary" size="sm">
                          Send Reminder
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {upcomingRenewals.length > 5 && (
                    <Button variant="outline" className="w-full mt-2">
                      View All Renewals
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
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
