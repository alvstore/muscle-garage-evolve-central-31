
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ClassAttendanceWidget from '@/components/dashboard/ClassAttendanceWidget';
import UpcomingClasses from '@/components/dashboard/UpcomingClasses';
import { ClassBooking } from '@/types/class';

const ClassesSection = () => {
  // Mock data for class attendance
  const classBookings: ClassBooking[] = [
    {
      id: "booking1",
      memberId: "member1",
      memberName: "John Doe",
      memberAvatar: "/avatars/01.png",
      status: "attended",
      classId: "class1",
      bookingDate: "2023-07-20T10:00:00Z",
      createdAt: "2023-07-15T14:30:00Z",
      updatedAt: "2023-07-15T14:30:00Z"
    },
    {
      id: "booking2",
      memberId: "member2",
      memberName: "Jane Smith",
      memberAvatar: "/avatars/02.png",
      status: "confirmed",
      classId: "class1",
      bookingDate: "2023-07-20T10:00:00Z",
      createdAt: "2023-07-15T14:30:00Z",
      updatedAt: "2023-07-15T14:30:00Z"
    },
    {
      id: "booking3",
      memberId: "member3",
      memberName: "Alex Johnson",
      memberAvatar: "/avatars/03.png",
      status: "missed",
      classId: "class1",
      bookingDate: "2023-07-20T10:00:00Z",
      createdAt: "2023-07-15T14:30:00Z",
      updatedAt: "2023-07-15T14:30:00Z"
    }
  ];

  const handleMarkAttendance = (bookingId: string, status: BookingStatus) => {
    console.log(`Marking booking ${bookingId} as ${status}`);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Class Attendance</CardTitle>
          <CardDescription>
            Attendance by class type for this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClassAttendanceWidget 
            classId="class1"
            className="HIIT Workout"
            time="10:00 AM - 11:00 AM"
            bookings={classBookings}
            onMarkAttendance={handleMarkAttendance}
          />
        </CardContent>
      </Card>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Upcoming Classes</CardTitle>
          <CardDescription>
            Classes scheduled in the next 48 hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UpcomingClasses classes={[]} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassesSection;
