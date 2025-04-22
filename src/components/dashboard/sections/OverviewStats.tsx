
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderHeart, Briefcase, User, UserCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

export interface OverviewStatsProps {
  data: {
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
      today: number;
      thisWeek: number;
    };
  };
  isLoading?: boolean;
}

const OverviewStats = ({ data, isLoading = false }: OverviewStatsProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="p-4">
              <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalMembers}</div>
          <p className="text-xs text-muted-foreground">
            +{data.newMembersToday} new today
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Members</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.activeMembers}</div>
          <p className="text-xs text-muted-foreground">
            {data.attendanceToday} check-ins today
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(data.revenue.thisMonth)}</div>
          <p className="text-xs text-muted-foreground">
            {data.revenue.thisMonth > data.revenue.lastMonth
              ? `+${formatCurrency(data.revenue.thisMonth - data.revenue.lastMonth)} from last month`
              : `${formatCurrency(data.revenue.lastMonth - data.revenue.thisMonth)} less than last month`}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
          <FolderHeart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.pendingPayments.count}</div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-muted-foreground">
              {formatCurrency(data.pendingPayments.total)} due
            </p>
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              View <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewStats;
