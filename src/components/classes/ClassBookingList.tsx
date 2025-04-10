
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClassBooking } from "@/types/class";
import { CalendarIcon, CheckIcon, XIcon } from "lucide-react";
import { format } from "date-fns";

interface ClassBookingListProps {
  classId?: string;
}

const ClassBookingList = ({ classId }: ClassBookingListProps) => {
  const [bookings, setBookings] = useState<ClassBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch bookings
    setLoading(true);
    
    setTimeout(() => {
      // Mock data
      const mockBookings: ClassBooking[] = [
        {
          id: "booking-1",
          classId: "class-1",
          memberId: "member-1",
          memberName: "John Doe",
          memberAvatar: "",
          bookingDate: "2025-04-08T10:30:00.000Z",
          status: "booked",
          createdAt: "2025-04-05T10:30:00.000Z",
          updatedAt: "2025-04-05T10:30:00.000Z"
        },
        {
          id: "booking-2",
          classId: "class-2",
          memberId: "member-2",
          memberName: "Jane Smith",
          memberAvatar: "",
          bookingDate: "2025-04-09T15:00:00.000Z",
          status: "attended",
          attendanceTime: "2025-04-09T15:05:00.000Z",
          createdAt: "2025-04-07T09:30:00.000Z",
          updatedAt: "2025-04-09T15:05:00.000Z"
        },
        {
          id: "booking-3",
          classId: "class-1",
          memberId: "member-3",
          memberName: "Mike Johnson",
          memberAvatar: "",
          bookingDate: "2025-04-08T10:30:00.000Z",
          status: "cancelled",
          notes: "Family emergency",
          createdAt: "2025-04-06T14:20:00.000Z",
          updatedAt: "2025-04-07T08:15:00.000Z"
        },
        {
          id: "booking-4",
          classId: "class-3",
          memberId: "member-4",
          memberName: "Sarah Wilson",
          memberAvatar: "",
          bookingDate: "2025-04-10T17:00:00.000Z",
          status: "booked",
          createdAt: "2025-04-08T11:45:00.000Z",
          updatedAt: "2025-04-08T11:45:00.000Z"
        },
        {
          id: "booking-5",
          classId: "class-2",
          memberId: "member-5",
          memberName: "Alex Brown",
          memberAvatar: "",
          bookingDate: "2025-04-09T15:00:00.000Z",
          status: "no-show",
          createdAt: "2025-04-07T16:30:00.000Z",
          updatedAt: "2025-04-09T16:00:00.000Z"
        }
      ].filter(booking => classId ? booking.classId === classId : true);
      
      setBookings(mockBookings);
      setLoading(false);
    }, 1000);
  }, [classId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "booked":
        return <Badge variant="outline">Booked</Badge>;
      case "attended":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Attended</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "no-show":
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">No Show</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const markAttendance = (bookingId: string) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { 
              ...booking, 
              status: "attended", 
              attendanceTime: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            } 
          : booking
      )
    );
  };

  const cancelBooking = (bookingId: string) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { 
              ...booking, 
              status: "cancelled", 
              updatedAt: new Date().toISOString()
            } 
          : booking
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="h-8 w-8 rounded-full border-4 border-t-accent animate-spin"></div>
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map(booking => (
              <div key={booking.id} className="flex flex-col sm:flex-row justify-between border-b pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{booking.memberName}</h3>
                    {getStatusBadge(booking.status)}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <CalendarIcon className="h-3 w-3" />
                    <span>
                      {format(new Date(booking.bookingDate), "MMM dd, yyyy 'at' h:mm a")}
                    </span>
                  </div>
                  {booking.notes && (
                    <p className="text-sm mt-1 italic">{booking.notes}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  {booking.status === "booked" && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8"
                        onClick={() => markAttendance(booking.id)}
                      >
                        <CheckIcon className="h-3 w-3 mr-1" />
                        Mark Attended
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8"
                        onClick={() => cancelBooking(booking.id)}
                      >
                        <XIcon className="h-3 w-3 mr-1" />
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            No bookings found
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClassBookingList;
