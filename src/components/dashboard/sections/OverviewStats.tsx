
import React from 'react';
import { Clock, DollarSign, Heart, Users } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';

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
  };
}

const OverviewStats = ({ data }: OverviewStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Members"
        value={data.totalMembers}
        description={`+${data.newMembersToday} today`}
        trend="up"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Today's Attendance"
        value={data.attendanceToday}
        description={`${Math.round((data.attendanceToday / data.activeMembers) * 100)}% of active members`}
        trend="up"
        icon={<Clock className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Revenue (Month)"
        value={`₹${data.revenue.thisMonth}`}
        description={`+${Math.round(((data.revenue.thisMonth - data.revenue.lastMonth) / data.revenue.lastMonth) * 100)}% from last month`}
        trend="up"
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Active Members"
        value={data.activeMembers}
        description={`${Math.round((data.activeMembers / data.totalMembers) * 100)}% of total members`}
        trend="up"
        icon={<Heart className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  );
};

export default OverviewStats;
