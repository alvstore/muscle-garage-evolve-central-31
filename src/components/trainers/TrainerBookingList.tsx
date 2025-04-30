import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, isAfter, isBefore, parseISO } from 'date-fns';
import { useClasses } from '@/hooks/use-classes';
import { GymClass, ClassBooking } from '@/types/class';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarClock, Calendar, UserCheck, UserX } from 'lucide-react';

interface TrainerBookingListProps {
  trainerId: string;
}

const TrainerBookingList: React.FC<TrainerBookingListProps> = ({ trainerId }) => {
  const { classes, isLoading } = useClasses();
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map(j => (
                  <div key={j} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-24" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  // Filter classes for this trainer only
  const trainerClasses = classes?.filter(c => c.trainerId === trainerId) || [];
  
  // Get bookings for all the trainer's classes
  const allBookings: {
    booking: ClassBooking;
    classInfo: GymClass;
  }[] = [];
  
  // Mock data since we don't have real bookings
  trainerClasses.forEach(classItem => {
    const mockBookings = [
      {
        id: `booking-${classItem.id}-1`,
        classId: classItem.id,
        memberId: "member1",
        memberName: "John Doe",
        memberAvatar: "/placeholder.svg",
        status: Math.random() > 0.7 ? "cancelled" : "confirmed",
        bookingDate: classItem.startTime,
        createdAt: new Date(new Date(classItem.startTime).getTime() - Math.random() * 86400000 * 7).toISOString(),
        updatedAt: new Date(new Date(classItem.startTime).getTime() - Math.random() * 86400000 * 3).toISOString(),
        attendanceTime: Math.random() > 0.5 ? new Date(classItem.startTime).toISOString() : undefined
      },
      {
        id: `booking-${classItem.id}-2`,
        classId: classItem.id,
        memberId: "member2",
        memberName: "Jane Smith",
        memberAvatar: "/placeholder.svg",
        status: Math.random() > 0.8 ? "cancelled" : "confirmed",
        bookingDate: classItem.startTime,
        createdAt: new Date(new Date(classItem.startTime).getTime() - Math.random() * 86400000 * 5).toISOString(),
        updatedAt: new Date(new Date(classItem.startTime).getTime() - Math.random() * 86400000 * 2).toISOString(),
        attendanceTime: Math.random() > 0.5 ? new Date(classItem.startTime).toISOString() : undefined
      }
    ];
    
    mockBookings.forEach(booking => {
      allBookings.push({
        booking: booking as ClassBooking,
        classInfo: classItem
      });
    });
  });
  
  const now = new Date();
  
  // Filter bookings by status and time
  const upcomingBookings = allBookings.filter(({ booking, classInfo }) => 
    booking.status === "confirmed" && isAfter(parseISO(classInfo.startTime), now)
  );
  
  const pastBookings = allBookings.filter(({ booking, classInfo }) => 
    booking.status === "attended" || (booking.status === "confirmed" && isBefore(parseISO(classInfo.startTime), now))
  );
  
  const cancelledBookings = allBookings.filter(({ booking }) => 
    booking.status === "cancelled"
  );
  
  const getInitials = (name: string = '') => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Confirmed</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Cancelled</Badge>;
      case "attended":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Attended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const renderBookingList = (bookings: typeof allBookings, emptyMessage: string) => {
    if (bookings.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      );
    }
    
    return bookings.map(({ booking, classInfo }) => (
      <div key={booking.id} className="flex justify-between items-center p-3 border-b last:border-b-0">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={booking.memberAvatar} alt={booking.memberName} />
            <AvatarFallback>{getInitials(booking.memberName)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{booking.memberName}</p>
            <div className="flex items-center text-xs text-muted-foreground space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{format(parseISO(classInfo.startTime), "EEE, MMM d")}</span>
              <span>•</span>
              <span>{format(parseISO(classInfo.startTime), "h:mm a")}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{classInfo.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(booking.status)}
        </div>
      </div>
    ));
  };
  
  if (trainerClasses.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-3">
          <CalendarClock className="h-12 w-12 text-muted-foreground" />
          <CardTitle>No Classes Created</CardTitle>
          <p className="text-muted-foreground">
            You need to create classes before you can see bookings. Use the "Create New Class" button to add your first class.
          </p>
        </div>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="upcoming">
        <TabsList className="w-full">
          <TabsTrigger value="upcoming" className="flex-1">
            <div className="flex items-center gap-1">
              <CalendarClock className="h-4 w-4" />
              <span>Upcoming</span>
              <Badge variant="secondary" className="ml-1">{upcomingBookings.length}</Badge>
            </div>
          </TabsTrigger>
          <TabsTrigger value="past" className="flex-1">
            <div className="flex items-center gap-1">
              <UserCheck className="h-4 w-4" />
              <span>Past</span>
              <Badge variant="secondary" className="ml-1">{pastBookings.length}</Badge>
            </div>
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="flex-1">
            <div className="flex items-center gap-1">
              <UserX className="h-4 w-4" />
              <span>Cancelled</span>
              <Badge variant="secondary" className="ml-1">{cancelledBookings.length}</Badge>
            </div>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Bookings</CardTitle>
              <CardDescription>
                Bookings for your upcoming classes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderBookingList(upcomingBookings, "No upcoming bookings found.")}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="past" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Past Bookings</CardTitle>
              <CardDescription>
                Past classes and attendance records
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderBookingList(pastBookings, "No past bookings found.")}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cancelled" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cancelled Bookings</CardTitle>
              <CardDescription>
                Members who cancelled their booking
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderBookingList(cancelledBookings, "No cancelled bookings found.")}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainerBookingList;
