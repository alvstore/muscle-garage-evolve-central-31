import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar,
  ChevronDown, 
  Download,
  Filter, 
  MoreVertical,
  RefreshCw, 
  Search,
  UserCheck,
  X
} from "lucide-react";
import { usePermissions } from "@/hooks/auth/use-permissions";
import { useBranch } from "@/hooks/settings/use-branches";
import PageHeader from "@/components/layout/PageHeader";
import { ClassBooking } from "@/types/class";
import { format, parseISO } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Function to fetch all bookings from Supabase
const fetchAllBookings = async (branchId?: string): Promise<ClassBooking[]> => {
  try {
    // Fetch bookings without relationships
    let query = supabase
      .from('class_bookings')
      .select('*')
      .order('created_at', { ascending: false });
    
    const { data: bookings, error } = await query;
    
    if (error) {
      console.error('Error fetching bookings:', error);
      throw new Error(error.message);
    }
    
    if (!bookings || bookings.length === 0) {
      return [];
    }
    
    // Extract member IDs and class IDs
    const memberIds = bookings.map(booking => booking.member_id).filter(Boolean);
    const classIds = bookings.map(booking => booking.class_id).filter(Boolean);
    
    // Fetch members data
    const { data: members, error: membersError } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, email, phone')
      .in('id', memberIds);
    
    if (membersError) {
      console.error('Error fetching members:', membersError);
    }
    
    // Fetch classes data
    const { data: classes, error: classesError } = await supabase
      .from('classes')
      .select('id, name, start_time, end_time, branch_id')
      .in('id', classIds);
    
    if (classesError) {
      console.error('Error fetching classes:', classesError);
    }
    
    // Create lookup maps
    const membersMap = (members || []).reduce((acc, member) => {
      acc[member.id] = member;
      return acc;
    }, {} as Record<string, any>);
    
    const classesMap = (classes || []).reduce((acc, cls) => {
      acc[cls.id] = cls;
      return acc;
    }, {} as Record<string, any>);
    
    // Filter by branch if provided
    const filteredBookings = branchId
      ? bookings.filter(booking => {
          const cls = classesMap[booking.class_id];
          return cls && cls.branch_id === branchId;
        })
      : bookings;
    
    // Map booking data with member and class information
    return filteredBookings.map((item: any) => {
      const member = membersMap[item.member_id] || {};
      const cls = classesMap[item.class_id] || {};
      
      return {
        id: item.id,
        classId: item.class_id,
        className: cls.name || 'Unknown Class',
        classStartTime: cls.start_time,
        classEndTime: cls.end_time,
        memberId: item.member_id,
        memberName: member.full_name || 'Unknown Member',
        memberEmail: member.email,
        memberPhone: member.phone,
        memberAvatar: member.avatar_url,
        bookingDate: item.created_at,
        status: item.status,
        attendanceTime: item.attendance_time,
        paidAmount: item.paid_amount,
        paymentStatus: item.payment_status,
        notes: item.notes,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      };
    }) || [];
  } catch (error: any) {
    console.error('Error in fetchAllBookings:', error);
    toast.error(`Failed to fetch bookings: ${error.message}`);
    return [];
  }
};

// Function to update booking status
const updateBookingStatus = async (bookingId: string, status: string, attendanceTime?: string): Promise<void> => {
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };
    
    if (attendanceTime) {
      updateData.attendance_time = attendanceTime;
    }
    
    const { error } = await supabase
      .from('class_bookings')
      .update(updateData)
      .eq('id', bookingId);
    
    if (error) {
      console.error('Error updating booking:', error);
      throw new Error(error.message);
    }
  } catch (error: any) {
    console.error('Error in updateBookingStatus:', error);
    throw new Error(`Failed to update booking: ${error.message}`);
  }
};

interface ClassBookingsPageProps {
  hideHeader?: boolean;
}

const ClassBookingsPage: React.FC<ClassBookingsPageProps> = ({ hideHeader = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { can } = usePermissions();
  const { currentBranch } = useBranch();
  const branchId = currentBranch?.id;
  
  // Fetch all bookings
  const { data: bookings = [], isLoading, error, refetch } = useQuery<ClassBooking[]>({
    queryKey: ['allClassBookings', branchId],
    queryFn: () => fetchAllBookings(branchId),
    enabled: !!branchId || can('view_all_branches')
  });
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    refetch().finally(() => {
      setIsRefreshing(false);
    });
  };
  
  const handleMarkAttendance = async (bookingId: string) => {
    try {
      await updateBookingStatus(bookingId, 'attended', new Date().toISOString());
      toast.success('Attendance marked successfully');
      refetch();
    } catch (error: any) {
      toast.error(`Failed to mark attendance: ${error.message}`);
    }
  };
  
  const handleCancelBooking = async (bookingId: string) => {
    try {
      await updateBookingStatus(bookingId, 'cancelled');
      toast.success('Booking cancelled successfully');
      refetch();
    } catch (error: any) {
      toast.error(`Failed to cancel booking: ${error.message}`);
    }
  };
  
  // Filter bookings based on search term and status filter
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.className.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Confirmed</Badge>;
      case "attended":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Attended</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      case "missed":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Missed</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      {!hideHeader && (
        <PageHeader 
          title="Class Bookings" 
          description="Manage all class bookings across your gym" 
          actions={
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            {can('manage_reports') && (
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            )}
          </div>
        }/>
      )}
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>
                View and manage bookings for all classes
              </CardDescription>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="attended">Attended</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="missed">Missed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="all">All Bookings</TabsTrigger>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-8 text-destructive">
                  Error loading bookings. Please try again.
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No bookings found matching your criteria.
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Booked On</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={booking.memberAvatar} alt={booking.memberName} />
                                <AvatarFallback>{getInitials(booking.memberName)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{booking.memberName}</div>
                                <div className="text-xs text-muted-foreground">{booking.memberEmail}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{booking.className}</TableCell>
                          <TableCell>
                            {booking.classStartTime && (
                              <div className="flex flex-col">
                                <span>{format(parseISO(booking.classStartTime), 'MMM d, yyyy')}</span>
                                <span className="text-xs text-muted-foreground">
                                  {format(parseISO(booking.classStartTime), 'h:mm a')}
                                </span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{getStatusBadge(booking.status)}</TableCell>
                          <TableCell>
                            {booking.createdAt && (
                              <div className="text-sm">
                                {format(parseISO(booking.createdAt), 'MMM d, yyyy')}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {booking.status === 'confirmed' && (
                                  <>
                                    <DropdownMenuItem onClick={() => handleMarkAttendance(booking.id)}>
                                      <UserCheck className="mr-2 h-4 w-4" />
                                      Mark Attendance
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleCancelBooking(booking.id)}>
                                      <X className="mr-2 h-4 w-4" />
                                      Cancel Booking
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                  </>
                                )}
                                <DropdownMenuItem>
                                  <Calendar className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="today">
              {/* Similar content but filtered for today's bookings */}
              <div className="text-center py-8 text-muted-foreground">
                Today's bookings will be shown here.
              </div>
            </TabsContent>
            
            <TabsContent value="upcoming">
              {/* Similar content but filtered for upcoming bookings */}
              <div className="text-center py-8 text-muted-foreground">
                Upcoming bookings will be shown here.
              </div>
            </TabsContent>
            
            <TabsContent value="past">
              {/* Similar content but filtered for past bookings */}
              <div className="text-center py-8 text-muted-foreground">
                Past bookings will be shown here.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassBookingsPage;
