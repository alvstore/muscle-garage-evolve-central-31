
import React, { useState, useEffect } from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Users, Activity, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AttendanceChart from "@/components/dashboard/AttendanceChart";
import { format } from "date-fns";

const RealTimeDashboardPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Mock data for demonstration
  const [attendanceData, setAttendanceData] = useState({
    currentUsers: 78,
    todayTotal: 152,
    peakTime: "18:00 - 19:00",
    occupancyRate: "65%",
    attendanceTrend: [
      { date: '2023-06-20', count: 120 },
      { date: '2023-06-21', count: 132 },
      { date: '2023-06-22', count: 125 },
      { date: '2023-06-23', count: 140 },
      { date: '2023-06-24', count: 147 },
      { date: '2023-06-25', count: 138 },
      { date: '2023-06-26', count: 152 }
    ],
    recentCheckins: [
      { id: "1", memberName: "John Doe", timestamp: "2023-06-26T14:32:00Z", memberType: "Premium" },
      { id: "2", memberName: "Sarah Smith", timestamp: "2023-06-26T14:28:00Z", memberType: "Standard" },
      { id: "3", memberName: "Mike Johnson", timestamp: "2023-06-26T14:15:00Z", memberType: "Premium" },
      { id: "4", memberName: "Emily Wilson", timestamp: "2023-06-26T14:05:00Z", memberType: "Standard" },
      { id: "5", memberName: "Robert Brown", timestamp: "2023-06-26T13:55:00Z", memberType: "Basic" }
    ]
  });
  
  const handleRefresh = () => {
    setIsLoading(true);
    toast({
      title: "Refreshing dashboard data",
      description: "Fetching latest attendance information."
    });
    
    // Simulate API call
    setTimeout(() => {
      // Update with random fluctuation in current users
      const newCount = Math.max(50, Math.min(120, attendanceData.currentUsers + Math.floor(Math.random() * 11) - 5));
      setAttendanceData(prev => ({
        ...prev,
        currentUsers: newCount,
      }));
      
      setLastUpdated(new Date());
      setIsLoading(false);
      
      toast({
        title: "Dashboard updated",
        description: `Data refreshed at ${format(new Date(), "HH:mm:ss")}`
      });
    }, 1500);
  };
  
  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Container>
      <div className="py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-1">Real-Time Dashboard</h1>
            <p className="text-muted-foreground">
              Live gym attendance and analytics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">
              Last updated: {format(lastUpdated, "HH:mm:ss")}
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-1"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Attendance Trends</TabsTrigger>
            <TabsTrigger value="recent">Recent Check-ins</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-muted-foreground text-sm">Current Members</p>
                      <h3 className="text-3xl font-bold">{attendanceData.currentUsers}</h3>
                    </div>
                    <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-muted-foreground text-sm">Today's Total</p>
                      <h3 className="text-3xl font-bold">{attendanceData.todayTotal}</h3>
                    </div>
                    <div className="h-10 w-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-muted-foreground text-sm">Peak Time</p>
                      <h3 className="text-xl font-bold">{attendanceData.peakTime}</h3>
                    </div>
                    <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-muted-foreground text-sm">Occupancy Rate</p>
                      <h3 className="text-3xl font-bold">{attendanceData.occupancyRate}</h3>
                    </div>
                    <div className="h-10 w-10 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Attendance</CardTitle>
                  <CardDescription>
                    Member check-ins over the past 7 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <AttendanceChart data={attendanceData.attendanceTrend} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="trends" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Patterns</CardTitle>
                <CardDescription>
                  Analyzing weekly and daily attendance patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <AttendanceChart data={attendanceData.attendanceTrend} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recent" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Check-ins</CardTitle>
                <CardDescription>
                  Live member entry records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attendanceData.recentCheckins.map(checkin => (
                    <div key={checkin.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                          <p className="font-medium">{checkin.memberName}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(checkin.timestamp), "HH:mm:ss")}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{checkin.memberType}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default RealTimeDashboardPage;
