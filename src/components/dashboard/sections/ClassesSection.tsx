
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import ClassAttendanceWidget from '@/components/dashboard/ClassAttendanceWidget';
import UpcomingClasses from '@/components/dashboard/UpcomingClasses';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from '@/hooks/use-branch';

interface ClassBooking {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar?: string;
  status: "attended" | "confirmed" | "missed";
  classId: string;
  bookingDate: string;
  createdAt: string;
  updatedAt: string;
}

interface ClassItem {
  id: string;
  name: string;
  time: string;
  trainer: string;
}

const ClassesSection = () => {
  const { currentBranch } = useBranch();
  const [classBookings, setClassBookings] = useState<ClassBooking[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [classId, setClassId] = useState<string>('');
  const [className, setClassName] = useState('');
  const [classTime, setClassTime] = useState('');

  useEffect(() => {
    const fetchClassData = async () => {
      setLoading(true);
      try {
        // Get current date/time
        const now = new Date();
        
        // Get classes happening in the next 48 hours
        const upcoming = new Date();
        upcoming.setHours(upcoming.getHours() + 48);
        
        // Fetch upcoming classes
        let classQuery = supabase
          .from('class_schedules')
          .select(`
            id,
            name,
            start_time,
            end_time,
            profiles:trainer_id (full_name)
          `)
          .gte('start_time', now.toISOString())
          .lte('start_time', upcoming.toISOString())
          .order('start_time', { ascending: true })
          .limit(5);
        
        // Fetch class bookings for today's classes
        let bookingsQuery = supabase
          .from('class_bookings')
          .select(`
            id,
            member_id,
            class_id,
            status,
            attended,
            created_at,
            updated_at,
            members:member_id (name, id)
          `)
          .eq('status', 'confirmed')
          .order('created_at', { ascending: false })
          .limit(10);
        
        // Apply branch filter if available
        if (currentBranch?.id) {
          classQuery = classQuery.eq('branch_id', currentBranch.id);
        }
        
        // Execute queries in parallel
        const [classResult, bookingResult] = await Promise.all([
          classQuery,
          bookingsQuery
        ]);
        
        if (classResult.error) throw classResult.error;
        if (bookingResult.error) throw bookingResult.error;
        
        // Process upcoming classes
        if (classResult.data && classResult.data.length > 0) {
          const mappedClasses = classResult.data.map(cls => ({
            id: cls.id,
            name: cls.name,
            time: `${formatDate(cls.start_time)} - ${formatTime(cls.end_time)}`,
            trainer: cls.profiles?.full_name || 'Unassigned'
          }));
          
          setUpcomingClasses(mappedClasses);
          
          // Use the first class for the attendance widget
          if (classResult.data[0]) {
            setClassId(classResult.data[0].id);
            setClassName(classResult.data[0].name);
            setClassTime(`${formatDate(classResult.data[0].start_time)} - ${formatTime(classResult.data[0].end_time)}`);
          }
        }
        
        // Process bookings
        if (bookingResult.data && bookingResult.data.length > 0) {
          const mappedBookings = bookingResult.data.map(booking => ({
            id: booking.id,
            memberId: booking.member_id,
            memberName: booking.members?.name || 'Unknown Member',
            memberAvatar: '/placeholder.svg', // Use a placeholder or fetch member avatar
            status: booking.attended ? "attended" : "confirmed",
            classId: booking.class_id,
            bookingDate: booking.created_at,
            createdAt: booking.created_at,
            updatedAt: booking.updated_at
          }));
          
          setClassBookings(mappedBookings);
        }
      } catch (error) {
        console.error('Error fetching class data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClassData();
  }, [currentBranch?.id]);

  const handleMarkAttendance = async (bookingId: string, status: "attended" | "missed") => {
    try {
      const { error } = await supabase
        .from('class_bookings')
        .update({ 
          attended: status === 'attended',
          status: status === 'attended' ? 'confirmed' : 'missed'
        })
        .eq('id', bookingId);
      
      if (error) throw error;
      
      // Update local state
      setClassBookings(prevBookings => 
        prevBookings.map(booking => {
          if (booking.id === bookingId) {
            return {
              ...booking,
              status: status
            };
          }
          return booking;
        })
      );
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Class Attendance</CardTitle>
          <CardDescription>
            Attendance for upcoming classes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : classBookings.length > 0 && classId ? (
            <ClassAttendanceWidget 
              classId={classId}
              className={className}
              time={classTime}
              bookings={classBookings}
              onMarkAttendance={handleMarkAttendance}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No bookings found for upcoming classes.
            </div>
          )}
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
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <UpcomingClasses classes={upcomingClasses} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassesSection;
