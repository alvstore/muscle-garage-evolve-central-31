
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardSummary } from '@/hooks/use-dashboard';
import { Users, CreditCard, Calendar, TrendingUp, Loader2 } from 'lucide-react';

interface StaffStatsOverviewProps {
  isLoading: boolean;
  dashboardData: DashboardSummary;
}

const StaffStatsOverview: React.FC<StaffStatsOverviewProps> = ({
  isLoading,
  dashboardData
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
              </CardTitle>
              <div className="h-6 w-6 bg-muted rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-20 animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-32 mt-2 animate-pulse"></div>
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
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dashboardData.totalMembers}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {dashboardData.activeMembers} active ({Math.round((dashboardData.activeMembers / dashboardData.totalMembers) * 100) || 0}%)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(dashboardData.revenue?.daily || 0)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Monthly: {formatCurrency(dashboardData.revenue?.monthly || 0)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Check-ins</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dashboardData.todayCheckIns || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Active classes: {dashboardData.activeClasses || 0}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Renewals</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dashboardData.upcomingRenewals || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Next 7 days
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffStatsOverview;
