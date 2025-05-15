
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, DollarSign, Calendar } from "lucide-react";
import { DashboardSummary } from '@/hooks/use-dashboard';
import { formatCurrency } from '@/utils/stringUtils';

interface StaffStatsOverviewProps {
  isLoading: boolean;
  dashboardData: DashboardSummary;
}

const StaffStatsOverview: React.FC<StaffStatsOverviewProps> = ({ isLoading, dashboardData }) => {
  
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Loading...</CardTitle>
              <div className="h-4 w-4 rounded-full bg-muted"></div>
            </CardHeader>
            <CardContent>
              <div className="h-6 w-24 bg-muted rounded"></div>
              <p className="text-xs text-muted-foreground mt-2">
                <span className="h-3 w-16 bg-muted rounded inline-block"></span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Active Members
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dashboardData.activeMembers}</div>
          <p className="text-xs text-muted-foreground">
            out of {dashboardData.totalMembers} total members
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Today's Check-ins
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dashboardData.todayCheckIns}</div>
          <p className="text-xs text-muted-foreground">
            visits recorded today
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Upcoming Renewals
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dashboardData.upcomingRenewals}</div>
          <p className="text-xs text-muted-foreground">
            memberships expiring soon
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Daily Revenue
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(dashboardData.revenue.daily)}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500">+{formatCurrency(dashboardData.revenue.daily - 1000)}</span> from yesterday
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffStatsOverview;
