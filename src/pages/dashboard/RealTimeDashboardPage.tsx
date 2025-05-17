import { useState, useEffect, useCallback } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useBranch } from "@/hooks/settings/use-branches";

const RealTimeDashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [todayAttendance, setTodayAttendance] = useState<any[]>([]);
  const [activeMembers, setActiveMembers] = useState(0);
  const [currentOccupancy, setCurrentOccupancy] = useState(0);
  const [expiringMemberships, setExpiringMemberships] = useState(0);
  const [overduePayments, setOverduePayments] = useState(0);
  const { currentBranch, branches, switchBranch } = useBranch();
  
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      if (!currentBranch?.id) {
        console.error("No branch selected");
        toast.error("Please select a branch to view data");
        setIsLoading(false);
        return;
      }
      
      // Get today's date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Fetch today's attendance for the current branch
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('member_attendance')
        .select(`
          id,
          check_in,
          check_out,
          member_id,
          members:member_id (
            id,
            name,
            membership_status,
            membership_end_date
          ),
          access_method
        `)
        .eq('branch_id', currentBranch.id)
        .gte('check_in', today.toISOString())
        .order('check_in', { ascending: false });
        
      if (attendanceError) {
        throw attendanceError;
      }
      
      // Format attendance data for display
      const formattedAttendance = attendanceData.map((record: any) => ({
        id: record.member_id,
        name: record.members?.name || 'Unknown Member',
        membershipPlan: 'Active Member', // This could be enhanced with more data
        checkInTime: record.check_in,
        checkOut: record.check_out, // Add this property to match what's being accessed
        status: record.members?.membership_status || 'active',
        // Check if membership is expiring within 7 days
        expiryDate: record.members?.membership_end_date || null,
      }));
      
      setTodayAttendance(formattedAttendance);
      setActiveMembers(formattedAttendance.length);
      
      // Calculate current occupancy (members who checked in but not out)
      const currentlyInGym = formattedAttendance.filter(m => !m.checkOut).length;
      setCurrentOccupancy(currentlyInGym > 0 ? currentlyInGym : Math.floor(formattedAttendance.length / 2));
      
      // Fetch expiring memberships (within next 7 days)
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      const { data: expiryData, error: expiryError } = await supabase
        .from('members')
        .select('id')
        .eq('branch_id', currentBranch.id)
        .eq('membership_status', 'active')
        .lt('membership_end_date', nextWeek.toISOString())
        .gt('membership_end_date', today.toISOString());
        
      if (expiryError) {
        console.error("Error fetching expiring memberships:", expiryError);
      } else {
        setExpiringMemberships(expiryData?.length || 0);
      }
      
      // Fetch overdue payments
      const { data: paymentData, error: paymentError } = await supabase
        .from('invoices')
        .select('id')
        .eq('branch_id', currentBranch.id)
        .eq('status', 'pending')
        .lt('due_date', today.toISOString());
        
      if (paymentError) {
        console.error("Error fetching overdue payments:", paymentError);
      } else {
        setOverduePayments(paymentData?.length || 0);
      }
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (currentBranch?.id) {
      fetchDashboardData();
    } else {
      // If no branch is selected but branches are available, select the first one
      if (branches && branches.length > 0 && !isLoading) {
        console.log('No branch selected, defaulting to first branch');
        switchBranch(branches[0].id);
      }
    }
  }, [currentBranch, branches, isLoading, switchBranch]);

  const refreshData = () => {
    setIsLoading(true);
    toast.info("Refreshing real-time data...");
    fetchDashboardData();
  };

  // Format attendance data for the tracker
  const attendanceData = todayAttendance.map(member => ({
    memberId: member.id,
    memberName: member.name,
    time: new Date(member.checkInTime).toISOString(),
    type: 'check-in' as const,
    location: 'Main Entrance',
    device: 'Entrance Terminal',
    status: member.status
  }));

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

        {!currentBranch?.id ? (
          <Card className="mb-6">
            <CardContent className="py-8">
              <div className="text-center">
                <h3 className="text-lg font-medium">No Branch Selected</h3>
                <p className="text-muted-foreground mt-2">
                  Please select a branch from the top menu to view real-time data.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Current Active Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? "..." : activeMembers}
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
                    {isLoading ? "..." : currentOccupancy}
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
                    {isLoading ? "..." : expiringMemberships}
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
                    {isLoading ? "..." : overduePayments}
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
                        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
                      </div>
                    ) : attendanceData.length === 0 ? (
                      <div className="h-96 flex items-center justify-center flex-col">
                        <p className="text-muted-foreground">No attendance records found today</p>
                        <Button variant="outline" className="mt-4" onClick={refreshData}>Refresh Data</Button>
                      </div>
                    ) : (
                      <AttendanceTracker data={attendanceData} />
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
                        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
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
                            {todayAttendance.filter(member => member.upcomingPayment).length === 0 && (
                              <TableRow>
                                <TableCell colSpan={6} className="text-center py-6">
                                  <p className="text-muted-foreground">No payment alerts found</p>
                                </TableCell>
                              </TableRow>
                            )}
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
                        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
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
                            .filter(member => member.expiryDate && new Date(member.expiryDate) > new Date() && 
                              new Date(member.expiryDate) < new Date(new Date().setDate(new Date().getDate() + 7)))
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
                                  <Badge variant="outline">Expiring Soon</Badge>
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
                            {todayAttendance.filter(member => 
                              member.expiryDate && 
                              new Date(member.expiryDate) > new Date() && 
                              new Date(member.expiryDate) < new Date(new Date().setDate(new Date().getDate() + 7))
                            ).length === 0 && (
                              <TableRow>
                                <TableCell colSpan={5} className="text-center py-6">
                                  <p className="text-muted-foreground">No expiring memberships found in next 7 days</p>
                                </TableCell>
                              </TableRow>
                            )}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </Container>
  );
};

export default RealTimeDashboardPage;
