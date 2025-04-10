
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
          <OverviewStats />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueSection />
            <MemberStatusSection />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AttendanceSection />
            <ActivitySection />
          </div>
        </TabsContent>
        
        <TabsContent value="members" className="space-y-6 w-full overflow-x-visible">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MemberStatusSection />
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
