
import React from 'react';
import StatCard from '@/components/dashboard/StatCard';
import { Users, CreditCard, Calendar, CheckSquare } from 'lucide-react';

interface OverviewStatsProps {
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
      today: number;
      thisWeek: number;
      thisMonth: number;
    };
    classAttendance: {
      today: number;
      yesterday: number;
      lastWeek: number;
    }
  }
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
          value: `+${data.newMembersToday} today`
        }}
        icon={Users}
      />
      
      <StatCard
        title="Revenue This Month"
        value={`₹${data.revenue.thisMonth.toLocaleString()}`}
        change={calculatePercentChange(data.revenue.thisMonth, data.revenue.lastMonth)}
        icon={CreditCard}
      />
      
      <StatCard
        title="Today's Check-ins"
        value={data.attendanceToday}
        change={calculatePercentChange(data.classAttendance.today, data.classAttendance.yesterday)}
        icon={CheckSquare}
      />
      
      <StatCard
        title="Renewals This Week"
        value={data.upcomingRenewals.thisWeek}
        change={{
          direction: "neutral",
          value: `${data.upcomingRenewals.today} today`
        }}
        icon={Calendar}
      />
    </div>
  );
};

export default OverviewStats;
