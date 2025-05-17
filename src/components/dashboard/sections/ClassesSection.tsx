
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from '@/hooks/use-branches';
import { format, parseISO } from 'date-fns';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type ClassSchedule = {
  id: string;
  name: string;
  type: string;
  start_time: string;
  end_time: string;
  capacity: number;
  enrolled: number;
  trainer_id: string;
  branch_id?: string;
  location?: string;
  status?: string;
  trainerName?: string;
  trainerAvatar?: string;
};

type Booking = {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar?: string;
  status: "attended" | "confirmed" | "missed";
  classId: string;
  bookingDate: string;
  createdAt: string;
  updatedAt: string;
};

interface ClassAttendanceWidgetProps {
  classId: string;
  className: string;
  time: string;
  bookings: Booking[];
  onMarkAttendance: (bookingId: string, status: "attended" | "missed") => void;
}

const ClassAttendanceWidget = ({
  classId,
  className,
  time,
  bookings,
  onMarkAttendance
}: ClassAttendanceWidgetProps) => {
  return (
    <div>
      <div className="mb-4">
        <h4 className="text-lg font-semibold">{className}</h4>
        <p className="text-sm text-gray-500">{time}</p>
      </div>
      
      {bookings.length === 0 ? (
        <p className="text-sm text-gray-500">No bookings for this class.</p>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={booking.memberAvatar} />
                  <AvatarFallback>{booking.memberName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{booking.memberName}</p>
                  {booking.status === "attended" ? (
                    <Badge variant="success">Attended</Badge>
                  ) : booking.status === "missed" ? (
                    <Badge variant="destructive">Missed</Badge>
                  ) : (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onMarkAttendance(booking.id, "attended")}
                        className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-md hover:bg-green-200"
                      >
                        Mark Present
                      </button>
                      <button 
                        onClick={() => onMarkAttendance(booking.id, "missed")}
                        className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-md hover:bg-red-200"
                      >
                        Mark Absent
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface UpcomingClassesProps {
  classes: ClassSchedule[];
}

const UpcomingClasses = ({ classes }: UpcomingClassesProps) => {
  const formatClassTime = (startTime: string, endTime: string) => {
    try {
      const formattedStart = format(parseISO(startTime), 'h:mm a');
      const formattedEnd = format(parseISO(endTime), 'h:mm a');
      return `${formattedStart} - ${formattedEnd}`;
    } catch (error) {
      return 'Invalid time';
    }
  };
  
  const formatClassDate = (startTime: string) => {
    try {
      return format(parseISO(startTime), 'EEE, MMM d');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  return (
    <div>
      {classes.length === 0 ? (
        <p className="text-sm text-gray-500">No upcoming classes scheduled.</p>
      ) : (
        <div className="space-y-3">
          {classes.map((classItem) => (
            <div key={classItem.id} className="border rounded-lg p-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{classItem.name}</h4>
                  <p className="text-sm text-gray-500">{formatClassDate(classItem.start_time)}</p>
                  <p className="text-sm">{formatClassTime(classItem.start_time, classItem.end_time)}</p>
                </div>
                <Badge>{classItem.type}</Badge>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>
                    {classItem.trainerName 
                      ? classItem.trainerName.substring(0, 2).toUpperCase()
                      : 'TR'}
                  </AvatarFallback>
                  <AvatarImage src={classItem.trainerAvatar} />
                </Avatar>
                <p className="text-xs text-gray-500">
                  {classItem.trainerName || `Trainer ID: ${classItem.trainer_id.substring(0, 8)}`}
                </p>
                <div className="ml-auto text-xs text-gray-500">
                  {classItem.enrolled}/{classItem.capacity} enrolled
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ClassesSection = () => {
  const [upcomingClasses, setUpcomingClasses] = useState<ClassSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentBranch } = useBranch();
  
  useEffect(() => {
    const fetchClasses = async () => {
      if (!currentBranch?.id) return;
      
      setIsLoading(true);
      try {
        // Fetch upcoming classes for the next 48 hours
        const now = new Date();
        const in48Hours = new Date(now);
        in48Hours.setHours(in48Hours.getHours() + 48);
        
        let query = supabase
          .from('class_schedules')
          .select(`
            *,
            profiles:trainer_id (full_name, avatar_url)
          `)
          .gte('start_time', now.toISOString())
          .lte('start_time', in48Hours.toISOString())
          .order('start_time', { ascending: true });
          
        if (currentBranch.id) {
          query = query.eq('branch_id', currentBranch.id);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching classes:', error);
          return;
        }
        
        if (data) {
          const formattedClasses: ClassSchedule[] = data.map(item => ({
            id: item.id,
            name: item.name,
            type: item.type,
            start_time: item.start_time,
            end_time: item.end_time,
            capacity: item.capacity,
            enrolled: item.enrolled || 0,
            trainer_id: item.trainer_id,
            branch_id: item.branch_id,
            location: item.location,
            status: item.status,
            trainerName: item.profiles?.full_name,
            trainerAvatar: item.profiles?.avatar_url
          }));
          
          setUpcomingClasses(formattedClasses);
        }
      } catch (err) {
        console.error('Error in fetchClasses:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClasses();
  }, [currentBranch?.id]);
  
  const handleMarkAttendance = (bookingId: string, status: "attended" | "missed") => {
    console.log(`Marking booking ${bookingId} as ${status}`);
    // Implement the logic to mark attendance
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
            bookings={[]}
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
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p>Loading classes...</p>
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
