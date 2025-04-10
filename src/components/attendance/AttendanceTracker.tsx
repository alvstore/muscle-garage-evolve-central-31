
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Clock, CalendarClock, UserCheck, XCircle } from "lucide-react";
import { User } from '@/types';
import { useAuth } from '@/hooks/use-auth';
import { usePermissions } from '@/hooks/use-permissions';
import { toast } from 'sonner';

interface AttendanceTrackerProps {
  date: Date;
}

interface AttendanceEntry {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  checkInTime: string;
  checkOutTime?: string;
  status: 'checked-in' | 'checked-out';
}

const AttendanceTracker = ({ date }: AttendanceTrackerProps) => {
  const { user } = useAuth();
  const { userRole, can } = usePermissions();
  const [attendanceEntries, setAttendanceEntries] = useState<AttendanceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [myAttendance, setMyAttendance] = useState<AttendanceEntry | null>(null);
  
  const isMember = userRole === "member";
  const canManageAttendance = can('log_attendance');
  
  // Mock data for demonstration
  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        // Generate mock attendance data
        const mockData: AttendanceEntry[] = [
          {
            id: '1',
            userId: 'user1',
            userName: 'John Doe',
            userAvatar: '/placeholder.svg',
            checkInTime: '2025-04-10T08:15:00',
            checkOutTime: '2025-04-10T10:45:00',
            status: 'checked-out'
          },
          {
            id: '2',
            userId: 'user2',
            userName: 'Sarah Johnson',
            checkInTime: '2025-04-10T09:30:00',
            status: 'checked-in'
          },
          {
            id: '3',
            userId: 'user3',
            userName: 'Michael Brown',
            userAvatar: '/placeholder.svg',
            checkInTime: '2025-04-10T06:45:00',
            checkOutTime: '2025-04-10T08:30:00',
            status: 'checked-out'
          }
        ];
        
        // If user is logged in, add their mock attendance
        if (user) {
          const userAttendance = {
            id: '4',
            userId: user.id,
            userName: user.name,
            userAvatar: user.avatar,
            checkInTime: '2025-04-10T07:30:00',
            status: 'checked-in' as const
          };
          
          setMyAttendance(userAttendance);
          
          if (!isMember) {
            mockData.push(userAttendance);
          }
        }
        
        setAttendanceEntries(mockData);
        setLoading(false);
      }, 1000);
    };
    
    fetchAttendance();
  }, [user, date, isMember]);
  
  const handleCheckIn = () => {
    // In a real application, this would make an API call
    const checkInTime = new Date().toISOString();
    
    if (!user) return;
    
    const newAttendance: AttendanceEntry = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      checkInTime,
      status: 'checked-in'
    };
    
    setMyAttendance(newAttendance);
    
    if (!isMember) {
      setAttendanceEntries(prev => [...prev, newAttendance]);
    }
    
    toast.success("Successfully checked in!");
  };
  
  const handleCheckOut = () => {
    // In a real application, this would make an API call
    const checkOutTime = new Date().toISOString();
    
    if (!myAttendance) return;
    
    const updatedAttendance = {
      ...myAttendance,
      checkOutTime,
      status: 'checked-out' as const
    };
    
    setMyAttendance(updatedAttendance);
    
    if (!isMember) {
      setAttendanceEntries(prev => 
        prev.map(entry => 
          entry.id === myAttendance.id ? updatedAttendance : entry
        )
      );
    }
    
    toast.success("Successfully checked out!");
  };
  
  // Format time from ISO string
  const formatTime = (isoTime: string) => {
    return format(new Date(isoTime), 'h:mm a');
  };
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  const renderMemberView = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">My Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="bg-muted p-3 rounded-full">
                  <CalendarClock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{format(date, 'EEEE, MMMM d, yyyy')}</h3>
                  <p className="text-sm text-muted-foreground">Today's attendance</p>
                </div>
              </div>
              
              <Badge 
                className={
                  myAttendance?.status === 'checked-in' 
                    ? "bg-green-500" 
                    : myAttendance?.status === 'checked-out'
                    ? "bg-blue-500"
                    : "bg-gray-400"
                }
              >
                {myAttendance?.status === 'checked-in' 
                  ? "Checked In" 
                  : myAttendance?.status === 'checked-out'
                  ? "Checked Out"
                  : "Not Checked In"}
              </Badge>
            </div>
            
            {myAttendance ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-t pt-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Check-in time:</span>
                  </div>
                  <span className="font-medium">{formatTime(myAttendance.checkInTime)}</span>
                </div>
                
                {myAttendance.checkOutTime && (
                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Check-out time:</span>
                    </div>
                    <span className="font-medium">{formatTime(myAttendance.checkOutTime)}</span>
                  </div>
                )}
                
                <div className="pt-2">
                  {myAttendance.status === 'checked-in' ? (
                    <Button onClick={handleCheckOut} className="w-full">
                      <Clock className="mr-2 h-4 w-4" />
                      Check Out
                    </Button>
                  ) : (
                    <div className="text-center py-2 px-4 bg-muted rounded-md">
                      <p className="text-sm text-muted-foreground">You've completed your session for today</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6 pt-4">
                <div className="text-center py-8">
                  <UserCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Not checked in yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Record your attendance for today
                  </p>
                  <Button onClick={handleCheckIn}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Check In Now
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };
  
  const renderStaffView = () => {
    return (
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Attendance</TabsTrigger>
          <TabsTrigger value="active">Currently Active</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>
                Attendance for {format(date, 'EEEE, MMMM d, yyyy')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-16 bg-muted animate-pulse rounded-md" />
                  ))}
                </div>
              ) : attendanceEntries.length > 0 ? (
                <div className="space-y-4">
                  {attendanceEntries.map(entry => (
                    <div key={entry.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={entry.userAvatar} alt={entry.userName} />
                          <AvatarFallback>{getInitials(entry.userName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{entry.userName}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            <span>In: {formatTime(entry.checkInTime)}</span>
                            {entry.checkOutTime && (
                              <>
                                <span className="mx-1">•</span>
                                <span>Out: {formatTime(entry.checkOutTime)}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge 
                        className={
                          entry.status === 'checked-in' 
                            ? "bg-green-500" 
                            : "bg-blue-500"
                        }
                      >
                        {entry.status === 'checked-in' ? "Active" : "Completed"}
                      </Badge>
                    </div>
                  ))}
                  
                  {canManageAttendance && (
                    <Button variant="outline" className="w-full mt-4">
                      <UserCheck className="mr-2 h-4 w-4" />
                      Add Manual Entry
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <XCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No attendance records</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    There are no attendance records for this date
                  </p>
                  {canManageAttendance && (
                    <Button>
                      <UserCheck className="mr-2 h-4 w-4" />
                      Add Manual Entry
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>
                Currently Active Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="h-16 bg-muted animate-pulse rounded-md" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {attendanceEntries
                    .filter(entry => entry.status === 'checked-in')
                    .map(entry => (
                    <div key={entry.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={entry.userAvatar} alt={entry.userName} />
                          <AvatarFallback>{getInitials(entry.userName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{entry.userName}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            <span>Checked in at {formatTime(entry.checkInTime)}</span>
                          </div>
                        </div>
                      </div>
                      
                      {canManageAttendance && (
                        <Button size="sm" variant="outline">
                          <CheckCircle className="mr-1 h-4 w-4 text-green-600" />
                          Check Out
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  {attendanceEntries.filter(entry => entry.status === 'checked-in').length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No members are currently active</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  };
  
  return isMember ? renderMemberView() : renderStaffView();
};

export default AttendanceTracker;
