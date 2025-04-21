
import { useState } from "react";
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { format, parseISO } from "date-fns";
import { MoreVertical, Calendar, UserCheck, X, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { ClassBooking, BookingStatus } from "@/types/class";

interface ClassBookingListProps {
  classId: string;
}

// Mock data for class bookings
const mockBookings: ClassBooking[] = [
  {
    id: "booking1",
    classId: "class1",
    memberId: "member1",
    memberName: "John Smith",
    memberAvatar: "/placeholder.svg",
    bookingDate: "2023-07-20T10:00:00Z",
    status: "confirmed",
    createdAt: "2023-07-15T14:30:00Z",
    updatedAt: "2023-07-15T14:30:00Z"
  },
  {
    id: "booking2",
    classId: "class1",
    memberId: "member2",
    memberName: "Emily Davis",
    memberAvatar: "/placeholder.svg",
    bookingDate: "2023-07-20T10:00:00Z",
    status: "attended",
    attendanceTime: "2023-07-20T09:55:00Z",
    createdAt: "2023-07-14T11:20:00Z",
    updatedAt: "2023-07-20T09:55:00Z"
  },
  {
    id: "booking3",
    classId: "class1",
    memberId: "member3",
    memberName: "Michael Brown",
    memberAvatar: "/placeholder.svg",
    bookingDate: "2023-07-20T10:00:00Z",
    status: "cancelled",
    createdAt: "2023-07-16T09:45:00Z",
    updatedAt: "2023-07-18T16:30:00Z",
    notes: "Schedule conflict"
  }
];

const ClassBookingList = ({ classId }: ClassBookingListProps) => {
  const [bookings, setBookings] = useState<ClassBooking[]>(mockBookings);

  // Function to mark attendance
  const markAttendance = (bookingId: string) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === bookingId 
        ? { 
            ...booking, 
            status: "attended" as BookingStatus, 
            attendanceTime: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          } 
        : booking
    );
    
    setBookings(updatedBookings);
    toast.success("Attendance marked successfully");
  };

  // Function to cancel booking
  const cancelBooking = (bookingId: string) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === bookingId 
        ? { 
            ...booking, 
            status: "cancelled" as BookingStatus,
            updatedAt: new Date().toISOString()
          } 
        : booking
    );
    
    setBookings(updatedBookings);
    toast.success("Booking cancelled successfully");
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "confirmed":
      case "booked":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Confirmed</Badge>;
      case "attended":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Attended</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      case "no-show":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Missed</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Pending</Badge>;
      case "waitlisted":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Waitlisted</Badge>;
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings</CardTitle>
        <CardDescription>Manage member bookings for this class</CardDescription>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No bookings</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              There are no bookings for this class yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={booking.memberAvatar} alt={booking.memberName} />
                    <AvatarFallback>{getInitials(booking.memberName || '')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{booking.memberName}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>
                        Booked for {format(parseISO(booking.bookingDate), "MMM dd, h:mm a")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(booking.status)}
                  
                  {(booking.status === "confirmed" || booking.status === "booked") && (
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
