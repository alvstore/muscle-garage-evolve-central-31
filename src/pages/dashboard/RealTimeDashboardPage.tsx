
import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Clock, DollarSign, RefreshCw, Users } from "lucide-react";
import AttendanceTracker from "@/components/attendance/AttendanceTracker";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { toast } from "sonner";

const RealTimeDashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Mock data for real-time attendance
  const todayAttendance = [
    {
      id: "mem1",
      name: "John Doe",
      membershipPlan: "Premium",
      checkInTime: new Date(new Date().setHours(8, 30)).toISOString(),
      status: "active",
      upcomingPayment: { amount: 1999, dueDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString() }
    },
    {
      id: "mem2",
      name: "Jane Smith",
      membershipPlan: "Standard",
      checkInTime: new Date(new Date().setHours(9, 15)).toISOString(),
      status: "expiring",
      expiryDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString()
    },
    {
      id: "mem3",
      name: "Alice Johnson",
      membershipPlan: "Basic",
      checkInTime: new Date(new Date().setHours(10, 0)).toISOString(),
      status: "active"
    },
    {
      id: "mem4",
      name: "Robert Williams",
      membershipPlan: "Premium",
      checkInTime: new Date(new Date().setHours(11, 45)).toISOString(),
      status: "overdue",
      upcomingPayment: { amount: 1999, dueDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString() }
    }
  ];

  const refreshData = () => {
    setIsLoading(true);
    toast.info("Refreshing real-time data...");
    
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Real-time data refreshed successfully!");
    }, 1000);
  };

  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Real-Time Dashboard</h1>
            <p className="text-muted-foreground">Live tracking of gym activity and member check-ins</p>
          </div>
          <Button onClick={refreshData} disabled={isLoading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Active Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : todayAttendance.length}
              </div>
              <p className="text-xs text-muted-foreground">members checked in today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Real-time Occupancy</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : Math.round(todayAttendance.length / 2)}
              </div>
              <p className="text-xs text-muted-foreground">currently in the gym</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Expiring Soon</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : todayAttendance.filter(m => m.status === "expiring").length}
              </div>
              <p className="text-xs text-muted-foreground">memberships in next 7 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payments</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : todayAttendance.filter(m => m.status === "overdue").length}
              </div>
              <p className="text-xs text-muted-foreground">overdue payments</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="attendance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="attendance">Live Attendance</TabsTrigger>
            <TabsTrigger value="payments">Payment Alerts</TabsTrigger>
            <TabsTrigger value="expiring">Expiring Memberships</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Real-Time Check-ins</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-96 flex items-center justify-center">
                    <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <AttendanceTracker />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead>Membership</TableHead>
                        <TableHead>Amount Due</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {todayAttendance
                        .filter(member => member.upcomingPayment)
                        .map(member => (
                          <TableRow key={member.id}>
                            <TableCell className="font-medium">{member.name}</TableCell>
                            <TableCell>{member.membershipPlan}</TableCell>
                            <TableCell>
                              {member.upcomingPayment ? 
                                `$${(member.upcomingPayment.amount / 100).toFixed(2)}` : 
                                'N/A'}
                            </TableCell>
                            <TableCell>
                              {member.upcomingPayment ? 
                                format(new Date(member.upcomingPayment.dueDate), 'MMM dd, yyyy') : 
                                'N/A'}
                            </TableCell>
                            <TableCell>
                              <Badge variant={member.status === "overdue" ? "destructive" : "default"}>
                                {member.status === "overdue" ? "Overdue" : "Upcoming"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => toast.info(`Payment reminder sent to ${member.name}`)}
                              >
                                Send Reminder
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expiring" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Expiring Memberships</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead>Membership</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {todayAttendance
                        .filter(member => member.status === "expiring")
                        .map(member => (
                          <TableRow key={member.id}>
                            <TableCell className="font-medium">{member.name}</TableCell>
                            <TableCell>{member.membershipPlan}</TableCell>
                            <TableCell>
                              {member.expiryDate ? 
                                format(new Date(member.expiryDate), 'MMM dd, yyyy') : 
                                'N/A'}
                            </TableCell>
                            <TableCell>
                              <Badge variant="warning">Expiring Soon</Badge>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => toast.info(`Renewal reminder sent to ${member.name}`)}
                              >
                                Send Renewal
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default RealTimeDashboardPage;
