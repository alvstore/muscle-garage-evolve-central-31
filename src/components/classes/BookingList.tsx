
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { CheckCircle, XCircle, Clock, CalendarClock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClassBooking, BookingStatus } from "@/types/class";

// Mock data fetching function
const fetchBookings = async (): Promise<ClassBooking[]> => {
  // In a real app, this would be an API call
  return [
    {
      id: "1",
      classId: "1",
      memberId: "m1",
      memberName: "John Doe",
      memberAvatar: "/placeholder.svg",
      bookingDate: "2025-04-15T06:30:00",
      status: "booked",
      createdAt: "2025-04-10T15:30:00",
      updatedAt: "2025-04-10T15:30:00"
    },
    {
      id: "2",
      classId: "1",
      memberId: "m2",
      memberName: "Lisa Wong",
      bookingDate: "2025-04-15T06:30:00",
      status: "attended",
      attendanceTime: "2025-04-15T06:25:00",
      createdAt: "2025-04-09T10:15:00",
      updatedAt: "2025-04-15T06:25:00"
    },
    {
      id: "3",
      classId: "2",
      memberId: "m3",
      memberName: "David Miller",
      memberAvatar: "/placeholder.svg",
      bookingDate: "2025-04-15T09:00:00",
      status: "cancelled",
      notes: "Feeling unwell",
      createdAt: "2025-04-08T17:45:00",
      updatedAt: "2025-04-14T08:30:00"
    }
  ];
};

const BookingList = () => {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: fetchBookings,
  });

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "booked":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "attended":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "no-show":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (isLoading) {
    return <div>Loading bookings...</div>;
  }

  return (
    <Tabs defaultValue="upcoming">
      <TabsList className="mb-4">
        <TabsTrigger value="upcoming">Upcoming Bookings</TabsTrigger>
        <TabsTrigger value="past">Past Bookings</TabsTrigger>
        <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
      </TabsList>
      
      <TabsContent value="upcoming" className="space-y-4">
        {bookings?.filter(b => b.status === "booked").map(booking => (
          <Card key={booking.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage 
                      src={booking.memberAvatar || "/placeholder.svg"} 
                      alt={booking.memberName} 
                    />
                    <AvatarFallback>{getInitials(booking.memberName || '')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{booking.memberName}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarClock className="mr-1 h-3 w-3" />
                      <span>{format(parseISO(booking.bookingDate), "PPP")}</span>
                      <span className="mx-1">•</span>
                      <Clock className="mr-1 h-3 w-3" />
                      <span>{format(parseISO(booking.bookingDate), "h:mm a")}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline">
                      <CheckCircle className="mr-1 h-4 w-4 text-green-600" />
                      Check In
                    </Button>
                    <Button size="sm" variant="outline">
                      <XCircle className="mr-1 h-4 w-4 text-red-600" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {bookings?.filter(b => b.status === "booked").length === 0 && (
          <div className="text-center p-8 text-muted-foreground">
            No upcoming bookings found.
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="past" className="space-y-4">
        {bookings?.filter(b => b.status === "attended").map(booking => (
          <Card key={booking.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage 
                      src={booking.memberAvatar || "/placeholder.svg"} 
                      alt={booking.memberName} 
                    />
                    <AvatarFallback>{getInitials(booking.memberName || '')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{booking.memberName}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarClock className="mr-1 h-3 w-3" />
                      <span>{format(parseISO(booking.bookingDate), "PPP")}</span>
                      <span className="mx-1">•</span>
                      <Clock className="mr-1 h-3 w-3" />
                      <span>{format(parseISO(booking.bookingDate), "h:mm a")}</span>
                    </div>
                    {booking.attendanceTime && (
                      <div className="text-xs text-green-600 mt-1">
                        Checked in at {format(parseISO(booking.attendanceTime), "h:mm a")}
                      </div>
                    )}
                  </div>
                </div>
                <Badge className={getStatusColor(booking.status)}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {bookings?.filter(b => b.status === "attended").length === 0 && (
          <div className="text-center p-8 text-muted-foreground">
            No past bookings found.
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="cancelled" className="space-y-4">
        {bookings?.filter(b => b.status === "cancelled" || b.status === "no-show").map(booking => (
          <Card key={booking.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage 
                      src={booking.memberAvatar || "/placeholder.svg"} 
                      alt={booking.memberName} 
                    />
                    <AvatarFallback>{getInitials(booking.memberName || '')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{booking.memberName}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarClock className="mr-1 h-3 w-3" />
                      <span>{format(parseISO(booking.bookingDate), "PPP")}</span>
                      <span className="mx-1">•</span>
                      <Clock className="mr-1 h-3 w-3" />
                      <span>{format(parseISO(booking.bookingDate), "h:mm a")}</span>
                    </div>
                    {booking.notes && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Note: {booking.notes}
                      </div>
                    )}
                  </div>
                </div>
                <Badge className={getStatusColor(booking.status)}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {bookings?.filter(b => b.status === "cancelled" || b.status === "no-show").length === 0 && (
          <div className="text-center p-8 text-muted-foreground">
            No cancelled bookings found.
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default BookingList;

