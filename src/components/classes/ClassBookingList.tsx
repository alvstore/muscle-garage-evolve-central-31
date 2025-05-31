
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { 
  MoreVertical, 
  Calendar, 
  UserCheck, 
  X, 
  CheckCircle, 
  Search, 
  AlertCircle, 
  Clock, 
  Calendar as CalendarIcon 
} from "lucide-react";
import { toast } from "sonner";
import { ClassBooking, BookingStatus } from "@/types/class";
import { supabase } from "@/integrations/supabase/client";
import { useBranch } from "@/hooks/settings/use-branches";
import { useAuth } from "@/hooks/auth/use-auth";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const { branch } = useBranch();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Status badge styling
  const getStatusBadge = (status: BookingStatus) => {
    const baseStyles = "px-2 py-1 text-xs rounded-full";
    
    switch (status) {
      case 'booked':
        return `${baseStyles} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`;
      case 'attended':
        return `${baseStyles} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`;
      case 'cancelled':
        return `${baseStyles} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`;
      case 'no-show':
        return `${baseStyles} bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300`;
      default:
        return `${baseStyles} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300`;
    }
  };
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  // Filter bookings based on search and status
  const filterBookings = (bookings: ClassBooking[]) => {
    return bookings.filter(booking => {
      const matchesSearch = booking.memberName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };
  
  // Categorize bookings for tabs
  const categorizeBookings = (bookings: ClassBooking[]) => {
    const now = new Date();
    return {
      upcoming: bookings.filter(b => 
        b.status === 'booked' && 
        b.bookingDate && 
        new Date(b.bookingDate) > now
      ),
      past: bookings.filter(b => 
        (b.status === 'attended' || b.status === 'no-show' || 
         (b.bookingDate && new Date(b.bookingDate) <= now))
      ),
      cancelled: bookings.filter(b => b.status === 'cancelled')
    };
  };
  
  // Fetch bookings
  const { data: allBookings = [], isLoading, error } = useQuery({
    queryKey: ['classBookings', classId, branch?.id],
    queryFn: () => fetchBookings(classId, branch?.id)
  });
  
  // Categorize bookings
  const { upcoming, past, cancelled } = categorizeBookings(allBookings);
  
  // Get filtered bookings for current tab
  const getFilteredBookings = (tab: string) => {
    switch (tab) {
      case 'upcoming':
        return filterBookings(upcoming);
      case 'past':
        return filterBookings(past);
      case 'cancelled':
        return filterBookings(cancelled);
      default:
        return [];
    }
  };

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

  // Function to handle update status
  const handleUpdateStatus = (bookingId: string, status: BookingStatus) => {
    if (status === 'attended') {
      markAttendance(bookingId);
    } else if (status === 'cancelled') {
      cancelBooking(bookingId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Class Bookings</CardTitle>
            <CardDescription className="mt-1">
              Manage class bookings and attendance
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search members..."
                className="pl-8 w-[200px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="upcoming" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="upcoming" className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4 mr-1" />
                Upcoming
                {upcoming.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {upcoming.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="past" className="flex items-center gap-1">
                <Clock className="h-4 w-4 mr-1" />
                Past
                {past.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {past.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="flex items-center gap-1">
                <X className="h-4 w-4 mr-1" />
                Cancelled
                {cancelled.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {cancelled.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Select
                value={statusFilter}
                onValueChange={(value: BookingStatus | "all") => setStatusFilter(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                  <SelectItem value="attended">Attended</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="no-show">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <TabsContent value="upcoming" className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : error ? (
              <div className="text-red-500 text-center p-4">
                Error loading bookings. Please try again.
              </div>
            ) : getFilteredBookings('upcoming').length > 0 ? (
              getFilteredBookings('upcoming').map((booking) => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking} 
                  onUpdateStatus={handleUpdateStatus}
                  getStatusBadge={getStatusBadge}
                  getInitials={getInitials}
                />
              ))
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                No upcoming bookings found
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="space-y-4">
            {getFilteredBookings('past').length > 0 ? (
              getFilteredBookings('past').map((booking) => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking} 
                  onUpdateStatus={handleUpdateStatus}
                  getStatusBadge={getStatusBadge}
                  getInitials={getInitials}
                />
              ))
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                No past bookings found
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="cancelled" className="space-y-4">
            {getFilteredBookings('cancelled').length > 0 ? (
              getFilteredBookings('cancelled').map((booking) => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking} 
                  onUpdateStatus={handleUpdateStatus}
                  getStatusBadge={getStatusBadge}
                  getInitials={getInitials}
                />
              ))
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                No cancelled bookings found
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ClassBookingList;
