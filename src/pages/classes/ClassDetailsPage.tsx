import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, ChevronRight, Users, User, Calendar, Clock, MapPin, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from '@/hooks/settings/use-branches';
import { isUUID } from '@/lib/utils';

interface ClassDetails {
  id: string;
  name: string;
  description: string;
  type: string;
  capacity: number;
  enrolled: number;
  start_time: string;
  end_time: string;
  location: string;
  trainer_id: string;
  status: string;
  branch_id: string;
}

interface Trainer {
  id: string;
  full_name: string;
  avatar_url?: string;
}

const ClassDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentBranch } = useBranch();
  
  const [classDetails, setClassDetails] = useState<ClassDetails | null>(null);
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [attendees, setAttendees] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    
    const fetchClassDetails = async () => {
      try {
        if (!id) {
          console.error('No class ID provided in URL');
          toast({
            title: 'Class Not Found',
            description: 'No class ID was provided. Redirecting to class list...',
            variant: 'destructive',
          });
          navigate('/classes');
          return;
        }

        // Validate that the ID is a valid UUID
        if (!isUUID(id)) {
          console.error('Invalid class ID format:', id);
          toast({
            title: 'Invalid Class',
            description: 'The class ID format is not valid. Redirecting to class list...',
            variant: 'destructive',
          });
          // Add a small delay before navigation to show the toast
          setTimeout(() => {
            navigate('/classes');
          }, 1500);
          return;
        }
        
        if (isMounted) setIsLoading(true);
        
        // Fetch class details
        const { data: classData, error: classError } = await supabase
          .from('classes')
          .select('*')
          .eq('id', id)
          .single();
          
        if (classError) throw classError;
        
        // Fetch trainer details if trainer_id exists
        let trainerData = null;
        if (classData.trainer_id) {
          const { data: trainer, error: trainerError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', classData.trainer_id)
            .single();
            
          if (!trainerError) {
            trainerData = trainer;
          }
        }
        
        // Fetch bookings for this class
        const { data: bookings, error: bookingsError } = await supabase
          .from('class_bookings')
          .select('*')
          .eq('class_id', id);
          
        if (bookingsError) throw bookingsError;
        
        if (isMounted) {
          setClassDetails({
            ...classData,
            trainer: trainerData,
            bookings: bookings || [],
          });
        }
      } catch (error) {
        console.error('Error fetching class details:', error);
        if (isMounted) {
          toast({
            title: 'Error',
            description: 'Failed to load class details',
            variant: 'destructive',
          });
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    
    fetchClassDetails();
    
    return () => {
      isMounted = false;
    };
  }, [id, navigate]);
  
  const handleEdit = () => {
    if (id) navigate(`/classes/edit/${id}`);
  };
  
  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading class details...</span>
        </div>
      </Container>
    );
  }

  if (!classDetails) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
            <span className="text-yellow-600 text-2xl">!</span>
          </div>
          <h2 className="text-xl font-semibold">Class Not Found</h2>
          <p className="text-muted-foreground">The requested class could not be found.</p>
          <Button onClick={() => navigate('/classes')}>
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
            <BreadcrumbLink href={`/classes/${id}`} isCurrentPage>{classDetails.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0 mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={() => navigate('/classes')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{classDetails.name}</h1>
              <div className="flex items-center space-x-2">
                <Badge variant={classDetails.status === 'scheduled' ? 'default' : 'secondary'}>
                  {classDetails.status === 'scheduled' ? 'Scheduled' : classDetails.status}
                </Badge>
                <span className="text-muted-foreground">
                  {classDetails.type}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Class
            </Button>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Cancel Class
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Class Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">
                  {classDetails.description || 'No description provided.'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Date & Time</h4>
                    <p className="text-sm text-muted-foreground">
                      {classDetails.start_time && format(new Date(classDetails.start_time), 'MMMM d, yyyy')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {classDetails.start_time && format(new Date(classDetails.start_time), 'h:mm a')} - 
                      {classDetails.end_time && format(new Date(classDetails.end_time), 'h:mm a')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Location</h4>
                    <p className="text-sm text-muted-foreground">
                      {classDetails.location || 'Main Studio'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Capacity & Enrollment</h4>
                    <p className="text-sm text-muted-foreground">
                      {classDetails.enrolled || 0} / {classDetails.capacity} spots filled
                    </p>
                    <div className="w-full bg-secondary h-2 rounded-full mt-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(classDetails.enrolled / classDetails.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Trainer</h4>
                    {trainer ? (
                      <div className="flex items-center space-x-2 mt-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={trainer.avatar_url || ''} />
                          <AvatarFallback>{trainer.full_name?.[0] || 'T'}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{trainer.full_name}</span>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Not assigned</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Members Registered</p>
                  <p className="text-2xl font-bold">{attendees.length}</p>
                </div>
                
                <Separator />
                
                {attendees.length > 0 ? (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {attendees.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{booking.profiles?.name?.[0] || 'M'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{booking.profiles?.name || 'Member'}</p>
                            <p className="text-xs text-muted-foreground">{booking.profiles?.email || ''}</p>
                          </div>
                        </div>
                        {booking.attended && (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground text-sm">No members registered yet</p>
                  </div>
                )}
                
                <div className="flex justify-center">
                  <Button variant="outline" className="w-full" onClick={() => navigate(`/classes/attendance/${id}`)}>
                    Manage Attendance
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default ClassDetailsPage;
