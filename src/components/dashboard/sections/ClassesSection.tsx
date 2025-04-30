import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { CalendarIcon, Clock, Users } from 'lucide-react';
import { useClasses } from '@/hooks/data/use-classes';
import { formatDistanceToNow } from 'date-fns';
import { useBranch } from '@/hooks/use-branch';

interface ClassBooking {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar: string;
  status: "attended" | "confirmed" | "missed";
  classId: string;
  bookingDate: string;
  createdAt: string;
  updatedAt: string;
}

interface Class {
  id: string;
  name: string;
  description: string;
  trainerId: string;
  schedule: string;
  capacity: number;
  createdAt: string;
  updatedAt: string;
}

interface Trainer {
  id: string;
  name: string;
}

const ClassesSection = () => {
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [showAllClasses, setShowAllClasses] = useState(false);

  const { currentBranch } = useBranch();
  const { classes, isLoading, error } = useClasses();
  const [bookings, setBookings] = useState<ClassBooking[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  
  const toggleClassesVisibility = () => {
    setShowAllClasses(!showAllClasses);
  };

  useEffect(() => {
    const fetchClassData = async () => {
      if (!currentBranch?.id) return;

      try {
        // Fetch trainers
        const { data: trainerData, error: trainerError } = await supabase
          .from('profiles')
          .select('id, full_name')
          .eq('role', 'trainer');

        if (trainerError) throw trainerError;
        
        if (trainerData) {
          const formattedTrainers = trainerData.map(trainer => ({
            id: trainer.id,
            name: trainer.full_name || 'Unknown'
          }));
          setTrainers(formattedTrainers);
        }

        // Fetch class bookings
        const { data: bookingData, error: bookingError } = await supabase
          .from('class_bookings')
          .select(`
            id, 
            member_id,
            class_id,
            status,
            created_at,
            updated_at,
            members:member_id (
              id, name, email
            )
          `)
          .eq('branch_id', currentBranch.id)
          .limit(10);

        if (bookingError) throw bookingError;
        
        if (bookingData) {
          const formattedBookings = bookingData.map(booking => ({
            id: booking.id,
            memberId: booking.member_id,
            memberName: booking.members?.name || 'Unknown Member',
            memberAvatar: '',
            status: booking.status as "attended" | "confirmed" | "missed",
            classId: booking.class_id,
            bookingDate: booking.created_at,
            createdAt: booking.created_at,
            updatedAt: booking.updated_at
          }));
          
          setBookings(formattedBookings);
        }
      } catch (err) {
        console.error('Error fetching class data:', err);
      }
    };

    fetchClassData();
  }, [currentBranch]);

  const renderBookingStatus = (status: "attended" | "confirmed" | "missed") => {
    switch (status) {
      case "attended":
        return <Badge variant="outline">Attended</Badge>;
      case "confirmed":
        return <Badge>Confirmed</Badge>;
      case "missed":
        return <Badge variant="destructive">Missed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Classes & Bookings</CardTitle>
          <Button size="sm">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Schedule Class
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue={selectedTab} className="space-y-4" onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
            <TabsTrigger value="all">All Classes</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="space-y-2">
            {isLoading ? (
              <p>Loading upcoming classes...</p>
            ) : classes && classes.length > 0 ? (
              classes.slice(0, showAllClasses ? classes.length : 3).map((cls) => (
                <div key={cls.id} className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">{cls.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      <Clock className="mr-1 inline-block h-4 w-4" />
                      {cls.schedule}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    <Users className="mr-1 h-4 w-4" />
                    {cls.capacity}
                  </Badge>
                </div>
              ))
            ) : (
              <p>No upcoming classes scheduled.</p>
            )}
            {classes && classes.length > 3 && (
              <Button variant="link" onClick={toggleClassesVisibility}>
                {showAllClasses ? "Show Less" : "Show All"}
              </Button>
            )}
          </TabsContent>
          <TabsContent value="bookings" className="space-y-2">
            {isLoading ? (
              <p>Loading recent bookings...</p>
            ) : bookings && bookings.length > 0 ? (
              bookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={booking.memberAvatar} alt={booking.memberName} />
                      <AvatarFallback>{booking.memberName.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-sm font-medium">{booking.memberName}</h3>
                      <p className="text-xs text-muted-foreground">
                        Booked{" "}
                        {formatDistanceToNow(new Date(booking.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                  {renderBookingStatus(booking.status)}
                </div>
              ))
            ) : (
              <p>No recent bookings found.</p>
            )}
          </TabsContent>
          <TabsContent value="all">
            {isLoading ? (
              <p>Loading all classes...</p>
            ) : classes && classes.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {classes.map((cls) => {
                  const trainer = trainers.find(t => t.id === cls.trainerId);
                  return (
                    <Card key={cls.id}>
                      <CardHeader>
                        <CardTitle>{cls.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{cls.description}</p>
                        <p className="text-xs mt-2">
                          Trainer: {trainer?.name || 'N/A'}
                        </p>
                        <p className="text-xs">Schedule: {cls.schedule}</p>
                        <Badge variant="secondary" className="mt-2">
                          Capacity: {cls.capacity}
                        </Badge>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <p>No classes found.</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ClassesSection;
