
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { GymClass, ClassBooking } from '@/types/class';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useClassBookings } from '@/hooks/use-classes';
import { toast } from 'sonner';

interface TrainerClassDetailsProps {
  gymClass: GymClass;
  isOpen: boolean;
  onClose: () => void;
}

const TrainerClassDetails: React.FC<TrainerClassDetailsProps> = ({
  gymClass,
  isOpen,
  onClose,
}) => {
  const { data: bookings, isLoading } = useClassBookings(gymClass.id);
  
  const confirmedBookings = bookings?.filter(booking => booking.status === 'confirmed') || [];
  const cancelledBookings = bookings?.filter(booking => booking.status === 'cancelled') || [];
  const attendedBookings = bookings?.filter(booking => booking.status === 'attended') || [];
  
  const getInitials = (name: string = '') => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    }
  };
  
  const handleMarkAttendance = (bookingId: string) => {
    toast.success('Attendance marked successfully');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{gymClass.name}</DialogTitle>
          <DialogDescription className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className={getDifficultyColor(gymClass.difficulty)}>
              {gymClass.difficulty === "all" ? "All Levels" : gymClass.difficulty}
            </Badge>
            
            <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              {gymClass.type}
            </Badge>
            
            {gymClass.recurring && (
              <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                Recurring
              </Badge>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="text-muted-foreground">
            {gymClass.description || "No description provided for this class."}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
              <span>{format(parseISO(gymClass.startTime), "EEEE, MMMM d, yyyy")}</span>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
              <span>
                {format(parseISO(gymClass.startTime), "h:mm a")} - 
                {format(parseISO(gymClass.endTime), "h:mm a")}
              </span>
            </div>
            
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-muted-foreground" />
              <span className={gymClass.enrolled >= gymClass.capacity ? "text-red-500 font-medium" : ""}>
                {gymClass.enrolled}/{gymClass.capacity} enrolled
              </span>
            </div>
            
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
              <span>{gymClass.location}</span>
            </div>
          </div>
          
          <div className="border rounded-md">
            <Tabs defaultValue="enrolled">
              <TabsList className="w-full">
                <TabsTrigger value="enrolled" className="flex-1">
                  Enrolled ({confirmedBookings.length})
                </TabsTrigger>
                <TabsTrigger value="attended" className="flex-1">
                  Attended ({attendedBookings.length})
                </TabsTrigger>
                <TabsTrigger value="cancelled" className="flex-1">
                  Cancelled ({cancelledBookings.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="enrolled" className="p-4">
                {isLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center gap-2">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : confirmedBookings.length > 0 ? (
                  <div className="space-y-2">
                    {confirmedBookings.map(booking => (
                      <div key={booking.id} className="flex justify-between items-center p-2 hover:bg-accent rounded-md">
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src={booking.memberAvatar} alt={booking.memberName} />
                            <AvatarFallback>{getInitials(booking.memberName)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{booking.memberName}</p>
                            <p className="text-xs text-muted-foreground">
                              Booked on {format(new Date(booking.createdAt), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleMarkAttendance(booking.id)}
                        >
                          Mark Attendance
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-6">No members enrolled for this class yet.</p>
                )}
              </TabsContent>
              
              <TabsContent value="attended" className="p-4">
                {isLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center gap-2">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : attendedBookings.length > 0 ? (
                  <div className="space-y-2">
                    {attendedBookings.map(booking => (
                      <div key={booking.id} className="flex justify-between items-center p-2 hover:bg-accent rounded-md">
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src={booking.memberAvatar} alt={booking.memberName} />
                            <AvatarFallback>{getInitials(booking.memberName)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{booking.memberName}</p>
                            <p className="text-xs text-muted-foreground">
                              Attended on {booking.attendanceTime ? format(new Date(booking.attendanceTime), "MMM d, yyyy h:mm a") : 'unknown'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-6">No attendance recorded for this class yet.</p>
                )}
              </TabsContent>
              
              <TabsContent value="cancelled" className="p-4">
                {isLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center gap-2">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : cancelledBookings.length > 0 ? (
                  <div className="space-y-2">
                    {cancelledBookings.map(booking => (
                      <div key={booking.id} className="flex justify-between items-center p-2 hover:bg-accent rounded-md">
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src={booking.memberAvatar} alt={booking.memberName} />
                            <AvatarFallback>{getInitials(booking.memberName)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{booking.memberName}</p>
                            <p className="text-xs text-muted-foreground">
                              Cancelled on {format(new Date(booking.updatedAt), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-6">No cancellations for this class.</p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TrainerClassDetails;
