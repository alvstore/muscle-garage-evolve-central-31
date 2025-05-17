
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, parseISO } from "date-fns";
import { MoreVertical, Calendar, UserCheck, X, CheckCircle, Search, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { ClassBooking, BookingStatus } from "@/types/class";
import { supabase } from "@/integrations/supabase/client";
import { useBranch } from "@/hooks/use-branches";
import { useAuth } from "@/hooks/use-auth";

interface ClassBookingListProps {
  classId: string;
}

// Function to fetch bookings from Supabase
const fetchBookings = async (classId: string, branchId?: string): Promise<ClassBooking[]> => {
  try {
    let query = supabase
      .from('class_bookings')
      .select(`
        *,
        member:member_id(id, full_name, avatar_url),
        class:class_id(id, name, start_time, branch_id)
      `)
      .eq('class_id', classId);
    
    // If branch ID is provided, filter by branch
    if (branchId) {
      query = query.eq('class.branch_id', branchId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching bookings:', error);
      throw new Error(error.message);
    }
    
    return data.map((item: any) => ({
      id: item.id,
      classId: item.class_id,
      memberId: item.member_id,
      memberName: item.member?.full_name || 'Unknown Member',
      memberAvatar: item.member?.avatar_url,
      bookingDate: item.class?.start_time,
      status: item.status,
      attendanceTime: item.attendance_time,
      paidAmount: item.paid_amount,
      paymentStatus: item.payment_status,
      notes: item.notes,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    })) || [];
  } catch (error: any) {
    console.error('Error in fetchBookings:', error);
    toast.error(`Failed to fetch bookings: ${error.message}`);
    return [];
  }
};

// Function to update booking status in Supabase
const updateBookingStatus = async (bookingId: string, status: BookingStatus, attendanceTime?: string): Promise<void> => {
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

const ClassBookingList = ({ classId }: ClassBookingListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const { currentBranch } = useBranch();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const branchId = currentBranch?.id;
  
  // Fetch bookings for the class
  const { data: bookings = [], isLoading, error } = useQuery<ClassBooking[]>({
    queryKey: ['classBookings', classId, branchId],
    queryFn: () => fetchBookings(classId, branchId),
    enabled: !!classId && (!!branchId || user?.role === 'admin')
  });
  
  // Mutation for marking attendance
  const attendanceMutation = useMutation({
    mutationFn: ({ bookingId }: { bookingId: string }) => {
      const attendanceTime = new Date().toISOString();
      return updateBookingStatus(bookingId, 'attended', attendanceTime);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classBookings', classId] });
      toast.success('Attendance marked successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to mark attendance: ${error.message}`);
    }
  });
  
  // Mutation for cancelling booking
  const cancelMutation = useMutation({
    mutationFn: ({ bookingId }: { bookingId: string }) => {
      return updateBookingStatus(bookingId, 'cancelled');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classBookings', classId] });
      toast.success('Booking cancelled successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to cancel booking: ${error.message}`);
    }
  });
  
  // Function to mark attendance
  const markAttendance = (bookingId: string) => {
    attendanceMutation.mutate({ bookingId });
  };

  // Function to cancel booking
  const cancelBooking = (bookingId: string) => {
    cancelMutation.mutate({ bookingId });
  };

  const getStatusBadge = (status: BookingStatus) => {
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  // Filter bookings based on search term and status filter
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.memberName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Bookings</CardTitle>
        <CardDescription>Manage member bookings for this class</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search and filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
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
        
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-lg border mb-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
              <Skeleton className="h-6 w-24" />
            </div>
          ))
        ) : error ? (
          <div className="flex items-center justify-center text-destructive p-8">
            <AlertCircle className="h-5 w-5 mr-2" />
            Error loading bookings
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No bookings</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {bookings.length === 0 
                ? "There are no bookings for this class yet." 
                : "No bookings match your search criteria."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={booking.memberAvatar} alt={booking.memberName} />
                    <AvatarFallback>{getInitials(booking.memberName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{booking.memberName}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>
                        Booked for {format(parseISO(booking.bookingDate), "MMM dd, h:mm a")}
                      </span>
                    </div>
                    {booking.notes && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Note: {booking.notes}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(booking.status)}
                  
                  {booking.status === "confirmed" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => markAttendance(booking.id)}>
                          <UserCheck className="h-4 w-4 mr-2" />
                          Mark Attendance
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => cancelBooking(booking.id)}>
                          <X className="h-4 w-4 mr-2" />
                          Cancel Booking
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  
                  {booking.status === "attended" && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClassBookingList;
