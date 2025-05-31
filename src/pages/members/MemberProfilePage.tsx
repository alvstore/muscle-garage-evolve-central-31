import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { supabase } from '@/services/api/supabaseClient';
import MemberProfile from '@/components/members/MemberProfile';
import MembershipAssignmentDialog from '@/components/members/MembershipAssignmentDialog';
import { toast } from 'sonner';
import { format, parseISO, differenceInDays } from "date-fns";
import { CalendarIcon, User, Mail, Phone, MapPin, CreditCard, Calendar, Loader2, Activity, LineChart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useMemberProfileData } from '@/hooks/members/use-member-profile-data';
import { useMemberProfileAnalytics } from '@/hooks/members/use-member-profile-analytics';

// Component for Member Membership Table
const MembershipTable = ({ memberships }) => {
  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "membership_plan.name",
        header: "Plan",
        cell: ({ row }) => {
          const plan = row.original.membership_plan;
          return <div>{plan?.name || 'Unknown Plan'}</div>;
        }
      },
      {
        accessorKey: "start_date",
        header: "Start Date",
        cell: ({ row }) => {
          return <div>{format(parseISO(row.original.start_date), "PP")}</div>;
        }
      },
      {
        accessorKey: "end_date",
        header: "End Date",
        cell: ({ row }) => {
          return <div>{format(parseISO(row.original.end_date), "PP")}</div>;
        }
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          return (
            <Badge variant={row.original.status === 'active' ? 'default' : 'secondary'}>
              {row.original.status}
            </Badge>
          );
        }
      },
      {
        accessorKey: "total_amount",
        header: "Amount",
        cell: ({ row }) => {
          return <div>₹{row.original.total_amount.toLocaleString()}</div>;
        }
      },
      {
        accessorKey: "payment_status",
        header: "Payment",
        cell: ({ row }) => {
          return (
            <Badge variant={
              row.original.payment_status === 'paid' ? 'success' : 
              row.original.payment_status === 'partial' ? 'warning' : 'destructive'
            }>
              {row.original.payment_status}
            </Badge>
          );
        }
      }
    ],
    []
  );

  return <DataTable columns={columns} data={memberships || []} />;
};

// Component for Member Invoice Table
const InvoiceTable = ({ invoices }) => {
  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "description",
        header: "Description",
      },
      {
        accessorKey: "issued_date",
        header: "Issue Date",
        cell: ({ row }) => {
          return <div>{format(parseISO(row.original.issued_date), "PP")}</div>;
        }
      },
      {
        accessorKey: "due_date",
        header: "Due Date",
        cell: ({ row }) => {
          return <div>{format(parseISO(row.original.due_date), "PP")}</div>;
        }
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => {
          return <div>₹{row.original.amount.toLocaleString()}</div>;
        }
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          return (
            <Badge variant={
              row.original.status === 'paid' ? 'success' : 
              row.original.status === 'pending' ? 'warning' : 'destructive'
            }>
              {row.original.status}
            </Badge>
          );
        }
      },
      {
        accessorKey: "payment_method",
        header: "Method",
        cell: ({ row }) => {
          return row.original.payment_method || "—";
        }
      }
    ],
    []
  );

  return <DataTable columns={columns} data={invoices || []} />;
};

// Component for Member Measurements Table
const MeasurementsTable = ({ measurements }) => {
  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "measurement_date",
        header: "Date",
        cell: ({ row }) => {
          return <div>{format(parseISO(row.original.measurement_date), "PP")}</div>;
        }
      },
      {
        accessorKey: "weight",
        header: "Weight (kg)",
        cell: ({ row }) => row.original.weight ? `${row.original.weight} kg` : "—"
      },
      {
        accessorKey: "height",
        header: "Height (cm)",
        cell: ({ row }) => row.original.height ? `${row.original.height} cm` : "—"
      },
      {
        accessorKey: "bmi",
        header: "BMI",
        cell: ({ row }) => row.original.bmi ? row.original.bmi.toFixed(1) : "—"
      },
      {
        accessorKey: "body_fat_percentage",
        header: "Body Fat %",
        cell: ({ row }) => row.original.body_fat_percentage ? `${row.original.body_fat_percentage}%` : "—"
      },
      {
        accessorKey: "chest",
        header: "Chest (cm)",
        cell: ({ row }) => row.original.chest ? `${row.original.chest} cm` : "—"
      },
      {
        accessorKey: "waist",
        header: "Waist (cm)",
        cell: ({ row }) => row.original.waist ? `${row.original.waist} cm` : "—"
      }
    ],
    []
  );

  return <DataTable columns={columns} data={measurements || []} />;
};

// Component for Member Attendance Table
const AttendanceTable = ({ attendance }) => {
  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => {
          return <div>{format(parseISO(row.original.date), "PP")}</div>;
        }
      },
      {
        accessorKey: "check_in_time",
        header: "Check In",
        cell: ({ row }) => {
          return <div>{format(parseISO(row.original.check_in_time), "p")}</div>;
        }
      },
      {
        accessorKey: "check_out_time",
        header: "Check Out",
        cell: ({ row }) => {
          return row.original.check_out_time ? 
            <div>{format(parseISO(row.original.check_out_time), "p")}</div> : "—";
        }
      },
      {
        accessorKey: "duration",
        header: "Duration",
        cell: ({ row }) => {
          if (!row.original.duration) return "—";
          const minutes = row.original.duration;
          const hours = Math.floor(minutes / 60);
          const mins = Math.floor(minutes % 60);
          return `${hours > 0 ? `${hours}h ` : ''}${mins}m`;
        }
      },
      {
        accessorKey: "activity_type",
        header: "Activity",
        cell: ({ row }) => row.original.activity_type || "General"
      }
    ],
    []
  );

  return <DataTable columns={columns} data={attendance || []} />;
};

// Enhanced Member Profile Page
const MemberProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  
  // Use the enhanced custom hooks for data fetching and analytics
  const { 
    data, 
    loading, 
    errors, 
    assignMembership, 
    addMeasurement,
    recordAttendance 
  } = useMemberProfileData(id as string);
  
  const { 
    weightTrend, 
    attendanceStats, 
    membershipValue 
  } = useMemberProfileAnalytics(
    data.measurements, 
    data.attendance,
    [...(data.memberships.active || []), ...(data.memberships.past || [])]
  );
  
  // Fetch the basic member profile data
  useEffect(() => {
    const fetchMember = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('members')
          .select('*, trainer:trainer_id(*)')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setMember(data);
      } catch (error: any) {
        toast.error(`Error fetching member: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMember();
  }, [id]);
  
  // Handle membership assignment
  const handleMembershipAssignment = async (membershipData) => {
    if (!id) return;
    
    const result = await assignMembership({
      ...membershipData,
      branch_id: member.branch_id
    });
    
    if (result.success) {
      setIsDialogOpen(false);
    }
  };
  
  // Error states
  if (!id) {
    return (
      <Container>
        <div className="py-10 text-center">
          <h2 className="text-2xl font-bold mb-2">Invalid Member ID</h2>
          <p>No member ID was provided in the URL.</p>
        </div>
      </Container>
    );
  }
  
  if (isLoading || loading.memberships || loading.invoices) {
    return (
      <Container>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Container>
    );
  }
  
  if (!member) {
    return (
      <Container>
        <div className="py-10 text-center">
          <h2 className="text-2xl font-bold mb-2">Member Not Found</h2>
          <p>The member you're looking for doesn't exist or has been removed.</p>
        </div>
      </Container>
    );
  }
  
  // Active membership - show the latest active membership or null if none exists
  const activeMembership = data.memberships.active[0];
  
  // Calculate days left in current membership, if any
  const daysLeft = activeMembership ? 
    differenceInDays(new Date(activeMembership.end_date), new Date()) : 0;
  
  return (
    <Container>
      <div className="space-y-6 py-6">
        {/* Member Profile Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h1 className="text-2xl font-bold">{member.name}'s Profile</h1>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
            >
              Back
            </Button>
            <Button 
              onClick={() => setIsDialogOpen(true)}
            >
              Assign Membership
            </Button>
          </div>
        </div>
        
        <MemberProfile member={member} onEdit={() => console.log('Edit')} />
        
        {/* Enhanced Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="memberships">Memberships</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="measurements">Measurements</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>
          
          {/* Memberships Tab */}
          <TabsContent value="memberships">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Membership History</CardTitle>
                <Button onClick={() => setIsDialogOpen(true)}>Assign New</Button>
              </CardHeader>
              <CardContent>
                {errors.memberships && (
                  <div className="p-4 mb-4 bg-destructive/10 text-destructive rounded-md">
                    {errors.memberships}
                  </div>
                )}
                
                {/* Active Memberships */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Active Membership</h3>
                  {data.memberships.active.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-sm text-muted-foreground">Current Plan</div>
                            <div className="text-2xl font-bold">
                              {activeMembership?.membership_plan?.name || 'Unknown'}
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-sm text-muted-foreground">Days Left</div>
                            <div className="text-2xl font-bold">
                              {daysLeft}
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-sm text-muted-foreground">End Date</div>
                            <div className="text-2xl font-bold">
                              {activeMembership ? format(parseISO(activeMembership.end_date), "PP") : 'N/A'}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <MembershipTable memberships={data.memberships.active} />
                    </>
                  ) : (
                    <div className="p-8 text-center bg-muted rounded-md">
                      <div className="text-lg font-medium">No Active Membership</div>
                      <div className="text-muted-foreground mt-1">This member doesn't have any active memberships.</div>
                      <Button onClick={() => setIsDialogOpen(true)} className="mt-4">Assign Membership</Button>
                    </div>
                  )}
                </div>
                
                {/* Past Memberships */}
                {data.memberships.past.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-4">Past Memberships</h3>
                    <MembershipTable memberships={data.memberships.past} />
                  </div>
                )}
                
                {/* Future Memberships */}
                {data.memberships.upcoming.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Upcoming Memberships</h3>
                    <MembershipTable memberships={data.memberships.upcoming} />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Invoices Tab */}
          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle>Invoice History</CardTitle>
              </CardHeader>
              <CardContent>
                {errors.invoices && (
                  <div className="p-4 mb-4 bg-destructive/10 text-destructive rounded-md">
                    {errors.invoices}
                  </div>
                )}
                
                {data.invoices.length > 0 ? (
                  <InvoiceTable invoices={data.invoices} />
                ) : (
                  <div className="p-8 text-center bg-muted rounded-md">
                    <div className="text-lg font-medium">No Invoices Found</div>
                    <div className="text-muted-foreground mt-1">This member doesn't have any invoices yet.</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Measurements Tab */}
          <TabsContent value="measurements">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Body Measurements</CardTitle>
                <Button>Add Measurement</Button>
              </CardHeader>
              <CardContent>
                {errors.measurements && (
                  <div className="p-4 mb-4 bg-destructive/10 text-destructive rounded-md">
                    {errors.measurements}
                  </div>
                )}
                
                {weightTrend.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-4">Weight Trend</h3>
                    <div className="h-60 bg-muted/20 rounded-md p-4 flex items-center justify-center">
                      <LineChart className="h-10 w-10 text-muted-foreground" />
                      <span className="ml-2 text-muted-foreground">Weight chart visualization would appear here</span>
                    </div>
                  </div>
                )}
                
                {data.measurements.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Measurement History</h3>
                    <MeasurementsTable measurements={data.measurements} />
                  </div>
                ) : (
                  <div className="p-8 text-center bg-muted rounded-md">
                    <div className="text-lg font-medium">No Measurements Recorded</div>
                    <div className="text-muted-foreground mt-1">This member doesn't have any body measurements recorded yet.</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Attendance Tab */}
          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle>Attendance History</CardTitle>
              </CardHeader>
              <CardContent>
                {errors.attendance && (
                  <div className="p-4 mb-4 bg-destructive/10 text-destructive rounded-md">
                    {errors.attendance}
                  </div>
                )}
                
                {/* Attendance Stats */}
                {data.attendance.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Attendance Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-muted-foreground">Weekly Visits</div>
                          <div className="text-2xl font-bold">
                            {attendanceStats.frequency.toFixed(1)}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-muted-foreground">Consistency</div>
                          <div className="text-2xl font-bold">
                            {attendanceStats.consistency.toFixed(0)}%
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-muted-foreground">Avg. Duration</div>
                          <div className="text-2xl font-bold">
                            {Math.floor(attendanceStats.averageDuration / 60)}h {Math.floor(attendanceStats.averageDuration % 60)}m
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
                
                {data.attendance.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                    <AttendanceTable attendance={data.attendance} />
                  </div>
                ) : (
                  <div className="p-8 text-center bg-muted rounded-md">
                    <div className="text-lg font-medium">No Attendance Records</div>
                    <div className="text-muted-foreground mt-1">This member doesn't have any attendance records yet.</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Membership Assignment Dialog */}
      {isDialogOpen && (
        <MembershipAssignmentDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          memberId={id}
          onAssign={handleMembershipAssignment}
        />
      )}
    </Container>
  );
};

export default MemberProfilePage;
