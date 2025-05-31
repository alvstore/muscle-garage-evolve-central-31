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
import { Loader2, LineChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
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
          const date = row.original.date || row.original.check_in_time;
          return <div>{format(parseISO(date), "PP")}</div>;
        }
      },
      {
        accessorKey: "check_in_time",
        header: "Check In",
        cell: ({ row }) => {
          return row.original.check_in_time ? format(parseISO(row.original.check_in_time), "p") : "—";
        }
      },
      {
        accessorKey: "check_out_time",
        header: "Check Out",
        cell: ({ row }) => {
          return row.original.check_out_time ? format(parseISO(row.original.check_out_time), "p") : "—";
        }
      },
      {
        accessorKey: "duration",
        header: "Duration",
        cell: ({ row }) => {
          if (row.original.duration) {
            const hours = Math.floor(row.original.duration / 60);
            const minutes = row.original.duration % 60;
            return `${hours}h ${minutes}m`;
          }
          return "—";
        }
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
          return <Badge variant="outline">{row.original.type || 'manual'}</Badge>;
        }
      }
    ],
    []
  );

  return <DataTable columns={columns} data={attendance || []} />;
};

export default function MemberProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Use the enhanced data fetching hooks
  const {
    member,
    memberships,
    invoices,
    measurements, 
    attendance,
    isLoading,
    error,
    refetch
  } = useMemberProfileData(id);

  const {
    weightTrend,
    attendanceStats,
    membershipValue,
    timeframe,
    setTimeframe
  } = useMemberProfileAnalytics(measurements, attendance, memberships);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    refetch();
  };

  const handleMembershipAssigned = () => {
    toast.success('Membership assigned successfully');
    handleRefresh();
  };

  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Container>
    );
  }

  if (error || !member) {
    return (
      <Container>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-destructive">Member not found</h2>
          <p className="text-muted-foreground mt-2">
            The member you're looking for doesn't exist or you don't have permission to view it.
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{member.name}</h1>
            <p className="text-muted-foreground">{member.email}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleRefresh} variant="outline">
              Refresh Data
            </Button>
            <MembershipAssignmentDialog 
              memberId={id!}
              onSuccess={handleMembershipAssigned}
              trigger={<Button>Assign Membership</Button>}
            />
          </div>
        </div>

        {/* Analytics Overview */}
        {(weightTrend.length > 0 || attendanceStats.frequency > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Latest Weight</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {weightTrend.length > 0 ? `${weightTrend[weightTrend.length - 1].weight} kg` : 'No data'}
                </div>
                {weightTrend.length > 1 && (
                  <p className="text-xs text-muted-foreground">
                    {weightTrend[weightTrend.length - 1].change > 0 ? '+' : ''}
                    {weightTrend[weightTrend.length - 1].change.toFixed(1)} kg from last measurement
                  </p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Attendance Frequency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {attendanceStats.frequency.toFixed(1)} visits/week
                </div>
                <p className="text-xs text-muted-foreground">
                  {attendanceStats.consistency.toFixed(0)}% consistency
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{membershipValue.totalSpent.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  ₹{membershipValue.averageMonthly.toFixed(0)}/month average
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="memberships">Memberships</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="measurements">Measurements</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <MemberProfile member={member} />
          </TabsContent>

          <TabsContent value="memberships">
            <Card>
              <CardHeader>
                <CardTitle>Membership History</CardTitle>
              </CardHeader>
              <CardContent>
                {memberships.length > 0 ? (
                  <MembershipTable memberships={memberships} />
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No membership records found
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle>Invoice History</CardTitle>
              </CardHeader>
              <CardContent>
                {invoices.length > 0 ? (
                  <InvoiceTable invoices={invoices} />
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No invoice records found
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="measurements">
            <Card>
              <CardHeader>
                <CardTitle>Body Measurements</CardTitle>
              </CardHeader>
              <CardContent>
                {measurements.length > 0 ? (
                  <MeasurementsTable measurements={measurements} />
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No measurement records found
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle>Attendance History</CardTitle>
              </CardHeader>
              <CardContent>
                {attendance.length > 0 ? (
                  <AttendanceTable attendance={attendance} />
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No attendance records found
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
}
