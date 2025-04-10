
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { CheckCircle, XCircle, Clock, CalendarClock, CalendarCheck, History, CalendarX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClassBooking, BookingStatus } from "@/types/class";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/use-permissions";

const fetchBookings = async (): Promise<ClassBooking[]> => {
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
  
  const { userRole } = usePermissions();
  const isMember = userRole === "member";

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "booked":
      case "confirmed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "attended":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "no-show":
      case "missed":
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
  
  const handleCancelBooking = (bookingId: string) => {
    toast.success("Booking cancelled successfully");
  };
  
  const handleCheckIn = (bookingId: string) => {
    toast.success("Check-in successful");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Tabs defaultValue="upcoming" className="w-full">
      <TabsList className="mb-6 w-full justify-start sm:w-auto">
        <TabsTrigger value="upcoming" className="flex items-center gap-1">
          <CalendarCheck className="h-4 w-4" />
          Upcoming Classes
        </TabsTrigger>
        <TabsTrigger value="past" className="flex items-center gap-1">
          <History className="h-4 w-4" />
          Past Classes
        </TabsTrigger>
        <TabsTrigger value="cancelled" className="flex items-center gap-1">
          <CalendarX className="h-4 w-4" />
          Cancelled
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="upcoming" className="space-y-4">
        {bookings?.filter(b => b.status === "booked" || b.status === "confirmed").map(booking => (
          <Card key={booking.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="p-4 border-l-4 border-blue-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 border-2 border-blue-100">
                      <AvatarImage src={booking.memberAvatar} alt={booking.memberName} />
                      <AvatarFallback className="bg-blue-100 text-blue-700">{getInitials(booking.memberName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{booking.memberName}</p>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <CalendarClock className="mr-1 h-3 w-3" />
                        <span>{format(parseISO(booking.bookingDate), "EEEE, MMMM d")}</span>
                        <span className="mx-1">•</span>
                        <Clock className="mr-1 h-3 w-3" />
                        <span>{format(parseISO(booking.bookingDate), "h:mm a")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                    <div className="flex space-x-1">
                      {isMember ? (
                        <Button size="sm" variant="outline" onClick={() => handleCancelBooking(booking.id)}>
                          <XCircle className="mr-1 h-4 w-4 text-red-600" />
                          Cancel
                        </Button>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleCheckIn(booking.id)}>
                            <CheckCircle className="mr-1 h-4 w-4 text-green-600" />
                            Check In
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleCancelBooking(booking.id)}>
                            <XCircle className="mr-1 h-4 w-4 text-red-600" />
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {bookings?.filter(b => b.status === "booked" || b.status === "confirmed").length === 0 && (
          <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-lg border dark:border-slate-800 text-muted-foreground">
            <CalendarCheck className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No upcoming bookings</h3>
            <p>You don't have any upcoming class bookings.</p>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="past" className="space-y-4">
        {bookings?.filter(b => b.status === "attended").map(booking => (
          <Card key={booking.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="p-4 border-l-4 border-green-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 border-2 border-green-100">
                      <AvatarImage src={booking.memberAvatar} alt={booking.memberName} />
                      <AvatarFallback className="bg-green-100 text-green-700">{getInitials(booking.memberName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{booking.memberName}</p>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <CalendarClock className="mr-1 h-3 w-3" />
                        <span>{format(parseISO(booking.bookingDate), "EEEE, MMMM d")}</span>
                        <span className="mx-1">•</span>
                        <Clock className="mr-1 h-3 w-3" />
                        <span>{format(parseISO(booking.bookingDate), "h:mm a")}</span>
                      </div>
                      {booking.attendanceTime && (
                        <div className="text-xs text-green-600 mt-1 flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Checked in at {format(parseISO(booking.attendanceTime), "h:mm a")}
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge className={getStatusColor(booking.status)} className="mt-2 sm:mt-0">
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {bookings?.filter(b => b.status === "attended").length === 0 && (
          <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-lg border dark:border-slate-800 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No past bookings</h3>
            <p>You haven't attended any classes yet.</p>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="cancelled" className="space-y-4">
        {bookings?.filter(b => b.status === "cancelled" || b.status === "no-show").map(booking => (
          <Card key={booking.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="p-4 border-l-4 border-red-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 border-2 border-red-100">
                      <AvatarImage src={booking.memberAvatar} alt={booking.memberName} />
                      <AvatarFallback className="bg-red-100 text-red-700">{getInitials(booking.memberName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{booking.memberName}</p>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <CalendarClock className="mr-1 h-3 w-3" />
                        <span>{format(parseISO(booking.bookingDate), "EEEE, MMMM d")}</span>
                        <span className="mx-1">•</span>
                        <Clock className="mr-1 h-3 w-3" />
                        <span>{format(parseISO(booking.bookingDate), "h:mm a")}</span>
                      </div>
                      {booking.notes && (
                        <div className="text-xs text-muted-foreground mt-1 flex items-center">
                          <span className="font-medium">Note:</span>
                          <span className="ml-1">{booking.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge className={getStatusColor(booking.status)} className="mt-2 sm:mt-0">
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {bookings?.filter(b => b.status === "cancelled" || b.status === "no-show").length === 0 && (
          <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-lg border dark:border-slate-800 text-muted-foreground">
            <CalendarX className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No cancelled bookings</h3>
            <p>You don't have any cancelled class bookings.</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default BookingList;
