
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Filter } from 'lucide-react';

// Import necessary chart components and data - corrected imports
import RevenueChart from '@/components/analytics/RevenueChart';
import MembershipChart from '@/components/analytics/MembershipChart';
import AttendanceChart from '@/components/analytics/AttendanceChart';
import ClassPerformanceTable from '@/components/analytics/ClassPerformanceTable';
import TrainerPerformanceTable from '@/components/analytics/TrainerPerformanceTable';

const AnalyticsDashboardPage = () => {
  const [date, setDate] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [branch, setBranch] = useState('all');

  return (
    <Container>
      <div className="py-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Detailed insights and performance metrics</p>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <DatePickerWithRange date={date} setDate={setDate} />
            <Select value={branch} onValueChange={setBranch}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                <SelectItem value="branch1">Main Branch</SelectItem>
                <SelectItem value="branch2">Downtown</SelectItem>
                <SelectItem value="branch3">Westside</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 md:w-[600px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="trainers">Trainers</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹42,350</div>
                  <p className="text-xs text-muted-foreground">+18% from last month</p>
                  {/* Pass date as dateRange to RevenueChart */}
                  <RevenueChart dateRange={date} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Memberships</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+24</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                  <MembershipChart />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">68%</div>
                  <p className="text-xs text-muted-foreground">+5% from last month</p>
                  <AttendanceChart />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <Card className="col-span-2 md:col-span-1">
                <CardHeader>
                  <CardTitle>Top Performing Classes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ClassPerformanceTable />
                </CardContent>
              </Card>
              <Card className="col-span-2 md:col-span-1">
                <CardHeader>
                  <CardTitle>Trainer Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <TrainerPerformanceTable />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>Member Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Member analytics content coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classes">
            <Card>
              <CardHeader>
                <CardTitle>Class Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Class analytics content coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trainers">
            <Card>
              <CardHeader>
                <CardTitle>Trainer Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Trainer analytics content coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default AnalyticsDashboardPage;
