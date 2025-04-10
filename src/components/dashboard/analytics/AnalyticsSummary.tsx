
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Users, DollarSign, TrendingUp } from 'lucide-react';
import StatisticsCard from '../charts/StatisticsCard';

interface AnalyticsSummaryProps {
  data: {
    totalMembers: number;
    activeMembers: number;
    newMembersToday: number;
    totalRevenue: number;
    revenueGrowth: number;
    activeClasses: number;
    attendanceToday: number;
    attendanceGrowth: number;
  };
}

const AnalyticsSummary: React.FC<AnalyticsSummaryProps> = ({ data }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Analytics Summary</CardTitle>
        <CardDescription>Overview of key metrics</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="membership" className="w-full">
          <TabsList className="mx-6 mb-4 justify-start border-b-0">
            <TabsTrigger value="membership">Membership</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>
          <TabsContent value="membership" className="px-6 pb-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatisticsCard
                title="Total Members"
                value={data.totalMembers}
                icon={Users}
                iconColor="text-blue-500"
                iconBgColor="bg-blue-100 dark:bg-blue-900/30"
                percentChange={3.2}
              />
              <StatisticsCard
                title="Active Members"
                value={data.activeMembers}
                subtitle={`${((data.activeMembers / data.totalMembers) * 100).toFixed(1)}% of total members`}
                icon={Activity}
                iconColor="text-green-500"
                iconBgColor="bg-green-100 dark:bg-green-900/30"
                percentChange={1.8}
              />
            </div>
          </TabsContent>
          <TabsContent value="revenue" className="px-6 pb-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatisticsCard
                title="Total Revenue"
                value={`₹${data.totalRevenue.toLocaleString()}`}
                icon={DollarSign}
                iconColor="text-purple-500"
                iconBgColor="bg-purple-100 dark:bg-purple-900/30"
                percentChange={data.revenueGrowth}
              />
              <StatisticsCard
                title="Average Revenue"
                value={`₹${Math.round(data.totalRevenue / data.activeMembers).toLocaleString()}`}
                subtitle="Per active member"
                icon={TrendingUp}
                iconColor="text-amber-500"
                iconBgColor="bg-amber-100 dark:bg-amber-900/30"
                percentChange={2.5}
              />
            </div>
          </TabsContent>
          <TabsContent value="attendance" className="px-6 pb-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatisticsCard
                title="Today's Attendance"
                value={data.attendanceToday}
                subtitle={`${((data.attendanceToday / data.activeMembers) * 100).toFixed(1)}% of active members`}
                icon={Activity}
                iconColor="text-indigo-500"
                iconBgColor="bg-indigo-100 dark:bg-indigo-900/30"
                percentChange={data.attendanceGrowth}
              />
              <StatisticsCard
                title="Active Classes"
                value={data.activeClasses}
                subtitle="Running today"
                icon={Users}
                iconColor="text-teal-500"
                iconBgColor="bg-teal-100 dark:bg-teal-900/30"
                percentChange={5.2}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AnalyticsSummary;
