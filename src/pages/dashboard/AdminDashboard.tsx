import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DollarSign, Users, UserPlus, Activity, TrendingUp, AlertTriangle, CalendarCheck, BarChart } from 'lucide-react';
import { formatCurrency } from "@/lib/utils";

interface DashboardData {
  totalMembers: number;
  newMembersToday: number;
  activeMembers: number;
  attendanceToday: number;
  revenue: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    lastMonth: number;
  };
  pendingPayments: {
    count: number;
    total: number;
  };
  upcomingRenewals: {
    count: number;
    total: number;
  };
  classAttendance: {
    total: number;
    average: number;
  };
}

const AdminDashboard = () => {
  const mockData: DashboardData = {
    totalMembers: 500,
    newMembersToday: 5,
    activeMembers: 450,
    attendanceToday: 120,
    revenue: {
      today: 25000,
      thisWeek: 150000,
      thisMonth: 600000,
      lastMonth: 580000
    },
    pendingPayments: {
      count: 25,
      total: 75000
    },
    upcomingRenewals: {
      count: 15,
      total: 45000
    },
    classAttendance: {
      total: 1200,
      average: 85
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.totalMembers}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <UserPlus className="h-3 w-3 inline-block mr-1" />
              {mockData.newMembersToday} new members today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Activity className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.activeMembers}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Members with active subscriptions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <CalendarCheck className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.attendanceToday}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Members who checked in today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockData.revenue.today)}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <TrendingUp className="h-3 w-3 inline-block mr-1" />
              {formatCurrency(mockData.revenue.thisMonth)} this month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pending Payments</CardTitle>
            <CardDescription>Outstanding payments from members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{mockData.pendingPayments.count}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total amount pending: {formatCurrency(mockData.pendingPayments.total)}
              </p>
              <Progress value={(mockData.pendingPayments.total / 100000) * 100} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Renewals</CardTitle>
            <CardDescription>Memberships expiring soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{mockData.upcomingRenewals.count}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total value at risk: {formatCurrency(mockData.upcomingRenewals.total)}
              </p>
              <Progress value={(mockData.upcomingRenewals.count / 50) * 100} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Class Attendance</CardTitle>
          <CardDescription>Overview of class participation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">{mockData.classAttendance.total}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Average attendance per class: {mockData.classAttendance.average}
            </p>
            <BarChart className="h-6 w-6 text-gray-500 dark:text-gray-400 mt-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
