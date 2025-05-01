
import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ClassDetailsProps {
  classId: string;
  onBack?: () => void;
}

// Helper function to get initials from a name
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const TrainerClassDetails: React.FC<ClassDetailsProps> = ({ classId, onBack }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [classDetails, setClassDetails] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  
  // Fetch class details and bookings
  useEffect(() => {
    const fetchClassDetails = async () => {
      setIsLoading(true);
      try {
        // Fetch class details
        const { data: classData, error: classError } = await supabase
          .from('class_schedules')
          .select(`
            *,
            profiles:trainer_id (full_name, avatar_url)
          `)
          .eq('id', classId)
          .single();
          
        if (classError) throw classError;
        
        // Fetch bookings for this class
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('class_bookings')
          .select(`
            *,
            profiles:member_id (full_name, avatar_url)
          `)
          .eq('class_id', classId);
          
        if (bookingsError) throw bookingsError;
        
        setClassDetails(classData);
        setBookings(bookingsData || []);
      } catch (error) {
        console.error('Error fetching class details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (classId) {
      fetchClassDetails();
    }
  }, [classId]);

  const handleMarkAttendance = async (bookingId: string, attended: boolean) => {
    try {
      const { error } = await supabase
        .from('class_bookings')
        .update({
          attended: attended
        })
        .eq('id', bookingId);
        
      if (error) throw error;
      
      // Update local state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId ? { ...booking, attended } : booking
        )
      );
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="animate-pulse bg-muted h-6 w-1/3 rounded"></CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="animate-pulse bg-muted h-4 w-1/4 rounded"></div>
          <div className="animate-pulse bg-muted h-4 w-1/2 rounded"></div>
          <div className="animate-pulse bg-muted h-20 w-full rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (!classDetails) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Class Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The class you're looking for could not be found.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={onBack}>Go Back</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{classDetails.name}</CardTitle>
          <Badge>{classDetails.type}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            {classDetails.start_time && (
              <span>{format(parseISO(classDetails.start_time), 'EEEE, MMMM d, yyyy')}</span>
            )}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            {classDetails.start_time && classDetails.end_time && (
              <span>
                {format(parseISO(classDetails.start_time), 'h:mm a')} - 
                {format(parseISO(classDetails.end_time), 'h:mm a')}
              </span>
            )}
          </div>
          {classDetails.location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{classDetails.location}</span>
            </div>
          )}
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-2" />
            <span>{bookings.length}/{classDetails.capacity} enrolled</span>
          </div>
        </div>

        {classDetails.description && (
          <div>
            <h3 className="text-sm font-medium mb-1">Description</h3>
            <p className="text-sm text-muted-foreground">{classDetails.description}</p>
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium mb-2">Bookings</h3>
          {bookings.length === 0 ? (
            <p className="text-sm text-muted-foreground">No bookings for this class.</p>
          ) : (
            <div className="space-y-2">
              {bookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-2 rounded bg-muted/40">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={booking.profiles?.avatar_url} />
                      <AvatarFallback>
                        {booking.profiles?.full_name ? getInitials(booking.profiles.full_name) : 'NA'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{booking.profiles?.full_name || 'Unknown Member'}</span>
                  </div>
                  <div>
                    {booking.attended === true ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800">Present</Badge>
                    ) : booking.attended === false ? (
                      <Badge variant="outline" className="bg-red-100 text-red-800">Absent</Badge>
                    ) : (
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-7 text-xs bg-green-100 text-green-800 hover:bg-green-200"
                          onClick={() => handleMarkAttendance(booking.id, true)}
                        >
                          Present
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs bg-red-100 text-red-800 hover:bg-red-200"
                          onClick={() => handleMarkAttendance(booking.id, false)}
                        >
                          Absent
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Back to Classes
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TrainerClassDetails;
