
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, CalendarClock } from "lucide-react";
import { ClassBooking } from "@/types/class";

interface ClassAttendanceWidgetProps {
  classId: string;
  className: string;
  time: string;
  bookings: ClassBooking[];
  onMarkAttendance: (bookingId: string, status: "attended" | "missed") => void;
}

const ClassAttendanceWidget = ({
  classId,
  className,
  time,
  bookings,
  onMarkAttendance
}: ClassAttendanceWidgetProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "attended":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "missed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "confirmed":
      case "booked":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "confirmed" || booking.status === "booked"
  );
  const attendedBookings = bookings.filter((booking) => booking.status === "attended");
  const missedBookings = bookings.filter((booking) => booking.status === "missed");

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{className}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <CalendarClock className="h-4 w-4 mr-1" />
              {time}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Badge variant="outline" className="flex items-center">
              <CheckCircle className="h-3.5 w-3.5 mr-1 text-green-500" />
              {attendedBookings.length}
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <XCircle className="h-3.5 w-3.5 mr-1 text-red-500" />
              {missedBookings.length}
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1 text-blue-500" />
              {confirmedBookings.length}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-2 bg-accent/10 rounded-md">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={booking.memberAvatar} alt={booking.memberName} />
                  <AvatarFallback>{getInitials(booking.memberName)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{booking.memberName}</p>
                  <Badge className={`text-xs mt-1 ${getStatusColor(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                </div>
              </div>

              {(booking.status === "confirmed" || booking.status === "booked") && (
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-green-600"
                    onClick={() => onMarkAttendance(booking.id, "attended")}
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span className="sr-only">Mark as Attended</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-red-600"
                    onClick={() => onMarkAttendance(booking.id, "missed")}
                  >
                    <XCircle className="h-4 w-4" />
                    <span className="sr-only">Mark as Missed</span>
                  </Button>
                </div>
              )}
            </div>
          ))}

          {bookings.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              No bookings for this class
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassAttendanceWidget;
