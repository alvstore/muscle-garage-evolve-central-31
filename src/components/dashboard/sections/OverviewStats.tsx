
import React from 'react';
import StatCard from '@/components/dashboard/StatCard';
import { Users, CreditCard, Calendar, CheckSquare } from 'lucide-react';

interface OverviewStatsProps {
  totalMembers: number;
  activeMembers: number;
  todayAttendance: number;
  monthlyRevenue: number;
}

const OverviewStats = ({ 
  totalMembers, 
  activeMembers, 
  todayAttendance, 
  monthlyRevenue 
}: OverviewStatsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Members"
        value={totalMembers}
        change={{
          direction: "up",
          value: `${activeMembers} active`
        }}
        icon={Users}
      />
      
      <StatCard
        title="Revenue This Month"
        value={`₹${monthlyRevenue.toLocaleString()}`}
        change={{
          direction: "up",
          value: `10% increase`
        }}
        icon={CreditCard}
      />
      
      <StatCard
        title="Today's Check-ins"
        value={todayAttendance}
        change={{
          direction: "up",
          value: `15% more than yesterday`
        }}
        icon={CheckSquare}
      />
      
      <StatCard
        title="Renewals This Week"
        value={5}
        change={{
          direction: "neutral",
          value: `2 today`
        }}
        icon={Calendar}
      />
    </div>
  );
};

export default OverviewStats;
