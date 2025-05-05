
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Calendar, Clock, Users, User, MapPin } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const ClassDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  // Mock data
  const classData = {
    id: id,
    name: 'Advanced Yoga',
    description: 'A challenging yoga session focusing on advanced postures and breathing techniques.',
    type: 'Yoga',
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    date: 'Monday, May 5, 2025',
    duration: '90 min',
    location: 'Main Studio - 2nd Floor',
    capacity: 20,
    enrolled: 14,
    status: 'active',
    trainer: {
      id: '123',
      name: 'Sarah Johnson',
      avatar: '/trainer-1.jpg',
      specialization: 'Certified Yoga Instructor'
    }
  };

  // Simulate loading data
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <Container>
        <div className="py-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Classes
          </Button>
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            {classData.status === 'active' ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3">
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle className="text-2xl">{classData.name}</CardTitle>
                    <CardDescription>{classData.type}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">Edit</Button>
                    <Button variant="default">Book Class</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-6">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="participants">Participants</TabsTrigger>
                    <TabsTrigger value="attendance">Attendance</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-2">Description</h3>
                          <p className="text-muted-foreground">{classData.description}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2">Class Details</h3>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{classData.date}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{classData.startTime} - {classData.endTime} ({classData.duration})</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{classData.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{classData.enrolled} / {classData.capacity} participants</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Instructor</h3>
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={classData.trainer.avatar} alt={classData.trainer.name} />
                            <AvatarFallback>{classData.trainer.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{classData.trainer.name}</h4>
                            <p className="text-sm text-muted-foreground">{classData.trainer.specialization}</p>
                            <Button variant="link" className="px-0 h-auto">View Profile</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="participants">
                    <p className="text-muted-foreground text-center py-8">
                      List of enrolled participants will appear here
                    </p>
                  </TabsContent>
                  
                  <TabsContent value="attendance">
                    <p className="text-muted-foreground text-center py-8">
                      Class attendance tracking will appear here
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:w-1/3">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full">Take Attendance</Button>
                  <Button variant="outline" className="w-full">Send Reminder</Button>
                  <Button variant="outline" className="w-full">Print Sheet</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Related Classes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-4">
                    Related classes will appear here
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ClassDetailsPage;
