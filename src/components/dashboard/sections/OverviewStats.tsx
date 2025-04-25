
import React from 'react';
import StatCard from '@/components/dashboard/StatCard';
import { Users, CreditCard, Calendar, CheckSquare } from 'lucide-react';
import { DashboardSummary } from '@/hooks/use-dashboard';

interface OverviewStatsProps {
  data: DashboardSummary;
}

const OverviewStats = ({ data }: OverviewStatsProps) => {
  const calculatePercentChange = (current: number, previous: number): { direction: "up" | "down" | "neutral", value: string } => {
    if (previous === 0) return { direction: "neutral", value: "0%" };
    const change = ((current - previous) / previous) * 100;
    return {
      direction: change > 0 ? "up" : change < 0 ? "down" : "neutral",
      value: `${Math.abs(change).toFixed(1)}%`
    };
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Members"
        value={data.totalMembers}
        change={{
          direction: "up",
          value: `${data.newMembers || 0} new`
        }}
        icon={Users}
      />
      
      <StatCard
        title="Revenue This Month"
        value={`₹${data.revenue.monthly.toLocaleString()}`}
        change={calculatePercentChange(data.revenue.monthly, data.revenue.monthly * 0.85)} // Estimate previous month at 85% of current
        icon={CreditCard}
      />
      
      <StatCard
        title="Today's Check-ins"
        value={data.todayCheckIns}
        change={{
          direction: "neutral",
          value: `${data.todayCheckIns} visits`
        }}
        icon={CheckSquare}
      />
      
      <StatCard
        title="Upcoming Renewals"
        value={data.upcomingRenewals}
        change={{
          direction: "neutral",
          value: `${data.expiringMemberships || 0} expiring`
        }}
        icon={Calendar}
      />
    </div>
  );
};

export default OverviewStats;
