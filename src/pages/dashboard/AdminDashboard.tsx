
import React, { useState } from "react";
import { Container } from "@/components/ui/container";
import DashboardHeader from "@/components/dashboard/sections/DashboardHeader";
import OverviewStats from "@/components/dashboard/sections/OverviewStats";
import RevenueSection from "@/components/dashboard/sections/RevenueSection";
import MemberStatusSection from "@/components/dashboard/sections/MemberStatusSection";
import AttendanceSection from "@/components/dashboard/sections/AttendanceSection";
import ActivitySection from "@/components/dashboard/sections/ActivitySection";
import RenewalsSection from "@/components/dashboard/sections/RenewalsSection";
import ClassesSection from "@/components/dashboard/sections/ClassesSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, BarChart, Calendar, Users } from "lucide-react";
import { usePermissions } from "@/hooks/use-permissions";
import BranchSelector from "@/components/branch/BranchSelector";
import { useBranch } from "@/hooks/use-branch";

// Mock data for dashboard components
const mockData = {
  stats: {
    totalMembers: 250,
    activeMembers: 210, 
    newMembers: 15,
    revenue: 12500,
    attendance: 85,
    classes: 24,
    retentionRate: 92,
    leadConversion: 28
  },
  revenueData: {
    monthly: [
      { month: 'Jan', revenue: 8000 },
      { month: 'Feb', revenue: 9200 },
      { month: 'Mar', revenue: 8800 },
      { month: 'Apr', revenue: 10000 },
      { month: 'May', revenue: 11500 },
      { month: 'Jun', revenue: 12500 }
    ],
    forecast: 15000,
    lastMonth: 11500,
    growth: 8.7
  },
  memberData: {
    active: 210,
    inactive: 40,
    trial: 15,
    expired: 25,
    distribution: [
      { name: 'Premium', value: 90 },
      { name: 'Standard', value: 120 },
      { name: 'Basic', value: 40 }
    ]
  },
  attendanceData: {
    weeklyData: [
      { day: 'Mon', attendance: 45 },
      { day: 'Tue', attendance: 52 },
      { day: 'Wed', attendance: 49 },
      { day: 'Thu', attendance: 63 },
      { day: 'Fri', attendance: 55 },
      { day: 'Sat', attendance: 70 },
      { day: 'Sun', attendance: 40 }
    ],
    peak: 'Saturday, 9am-11am',
    average: 53.4
  }
};

const AdminDashboard = () => {
  const { can } = usePermissions();
  const { currentBranch } = useBranch();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Container className="max-w-7xl py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your admin dashboard</p>
        </div>

        {currentBranch && (
          <div className="flex items-center">
            <BranchSelector />
          </div>
        )}
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="space-y-6"
      >
        <div className="flex overflow-x-auto pb-2">
          <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground mb-2">
            <TabsTrigger 
              value="overview" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
            >
              <BarChart className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="members" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
            >
              <Users className="mr-2 h-4 w-4" />
              Members
            </TabsTrigger>
            <TabsTrigger 
              value="activity" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
            >
              <Activity className="mr-2 h-4 w-4" />
              Activity
            </TabsTrigger>
            <TabsTrigger 
              value="schedule" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Schedule
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6 w-full overflow-x-visible">
          <OverviewStats data={mockData.stats} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueSection data={mockData.revenueData} />
            <MemberStatusSection data={mockData.memberData} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AttendanceSection data={mockData.attendanceData} />
            <ActivitySection />
          </div>
        </TabsContent>
        
        <TabsContent value="members" className="space-y-6 w-full overflow-x-visible">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MemberStatusSection data={mockData.memberData} />
            </div>
            <div>
              <RenewalsSection />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-6 w-full overflow-x-visible">
          <ActivitySection fullWidth />
        </TabsContent>
        
        <TabsContent value="schedule" className="space-y-6 w-full overflow-x-visible">
          <ClassesSection />
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default AdminDashboard;
