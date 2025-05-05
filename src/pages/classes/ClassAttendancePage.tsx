
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { ChevronRight, ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from '@/hooks/use-branch';

interface ClassDetails {
  id: string;
  name: string;
  start_time: string;
  trainer_id: string;
  branch_id: string;
}

interface Attendee {
  id: string;
  member_id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  attended: boolean;
}

const ClassAttendancePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentBranch } = useBranch();
  
  const [classDetails, setClassDetails] = useState<ClassDetails | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const fetchClassAttendance = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        // Fetch class details
        const { data: classData, error: classError } = await supabase
          .from('classes')
          .select('*')
          .eq('id', id)
          .single();
          
        if (classError) throw classError;
        if (!classData) throw new Error('Class not found');
        
        setClassDetails(classData);
        
        // Fetch bookings and attendees
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('class_bookings')
          .select(`
            id, 
            member_id, 
            attended,
            members:member_id (
              id, 
              name, 
              email,
              phone
            )
          `)
          .eq('class_id', id);
          
        if (bookingsError) throw bookingsError;
        
        const formattedAttendees = bookingsData?.map(booking => ({
          id: booking.id,
          member_id: booking.member_id,
          name: booking.members?.name || 'Unknown Member',
          email: booking.members?.email || '',
          phone: booking.members?.phone || '',
          avatar: '',
          attended: booking.attended || false
        })) || [];
        
        setAttendees(formattedAttendees);
        
      } catch (error: any) {
        console.error('Error fetching class attendance:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to load attendance data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClassAttendance();
  }, [id, toast]);
  
  const handleToggleAttendance = (index: number) => {
    const newAttendees = [...attendees];
    newAttendees[index].attended = !newAttendees[index].attended;
    setAttendees(newAttendees);
  };
  
  const handleSaveAttendance = async () => {
    if (!id || !classDetails) return;
    
    try {
      setIsSaving(true);
      
      // Update each booking's attendance status
      const updatePromises = attendees.map(attendee => 
        supabase
          .from('class_bookings')
          .update({ attended: attendee.attended, updated_at: new Date().toISOString() })
          .eq('id', attendee.id)
      );
      
      await Promise.all(updatePromises);
      
      // Also update attendance records
      for (const attendee of attendees.filter(a => a.attended)) {
        // Check if attendance record already exists
        const { data: existingRecord } = await supabase
          .from('member_attendance')
          .select('id')
          .eq('member_id', attendee.member_id)
          .eq('branch_id', classDetails.branch_id)
          .gte('check_in', new Date(classDetails.start_time).toISOString().split('T')[0])
          .lte('check_in', new Date(new Date(classDetails.start_time).getTime() + 24*60*60*1000).toISOString().split('T')[0])
          .maybeSingle();
          
        if (!existingRecord) {
          // Create new attendance record if one doesn't exist
          await supabase
            .from('member_attendance')
            .insert({
              member_id: attendee.member_id,
              branch_id: classDetails.branch_id,
              check_in: new Date(classDetails.start_time).toISOString(),
              access_method: 'class',
              recorded_by: classDetails.trainer_id || null
            });
        }
      }
      
      toast({
        title: 'Attendance saved',
        description: 'Class attendance has been updated successfully',
      });
      
    } catch (error: any) {
      console.error('Error saving attendance:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save attendance data',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const filteredAttendees = attendees.filter(attendee => 
    attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (attendee.email && attendee.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (attendee.phone && attendee.phone.includes(searchQuery))
  );
  
  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Container>
    );
  }
  
  if (!classDetails) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-lg">Class not found</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/classes')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Classes
          </Button>
        </div>
      </Container>
    );
  }
  
  return (
    <Container>
      <div className="py-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/classes">Classes</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/classes/${id}`}>{classDetails.name}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/classes/attendance/${id}`} isCurrentPage>Attendance</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0 mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={() => navigate(`/classes/${id}`)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Class Attendance</h1>
              <p className="text-muted-foreground">
                {classDetails.name} - {classDetails.start_time && format(new Date(classDetails.start_time), 'MMMM d, yyyy h:mm a')}
              </p>
            </div>
          </div>
          
          <Button onClick={handleSaveAttendance} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Attendance
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Mark Attendance</CardTitle>
            <CardDescription>
              Check the box next to each member who attended the class
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            {filteredAttendees.length > 0 ? (
              <div className="space-y-4">
                {filteredAttendees.map((attendee, index) => {
                  const attendeeIndex = attendees.findIndex(a => a.id === attendee.id);
                  return (
                    <div key={attendee.id} className="flex items-center space-x-4">
                      <Checkbox 
                        id={`attendance-${attendee.id}`}
                        checked={attendee.attended}
                        onCheckedChange={() => handleToggleAttendance(attendeeIndex)}
                      />
                      <div className="flex flex-1 items-center space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{attendee.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <label 
                            htmlFor={`attendance-${attendee.id}`}
                            className="font-medium cursor-pointer"
                          >
                            {attendee.name}
                          </label>
                          <p className="text-sm text-muted-foreground">
                            {attendee.email || attendee.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  {searchQuery ? 'No members match your search' : 'No members booked this class'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default ClassAttendancePage;
