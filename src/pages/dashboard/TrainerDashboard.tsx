import React, { useState, useEffect } from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth/use-auth";
import { useBranch } from "@/hooks/settings/use-branches";
import { supabase } from "@/services/api/supabaseClient";
import { PlusIcon } from "lucide-react";

// Mock announcements that would be used for trainers
const trainerAnnouncements = [
  {
    id: '1',
    title: 'New Training Protocols',
    content: 'All trainers must follow the updated training protocols starting next week.',
    authorName: 'Management',
    createdAt: new Date().toISOString(),
    priority: 'high',
    targetRoles: ['trainer'],
    channels: ['app'],
  },
  {
    id: '2',
    title: 'Trainer Meeting',
    content: 'Monthly trainer meeting scheduled for Friday at 3pm.',
    authorName: 'Management',
    createdAt: new Date().toISOString(),
    priority: 'medium',
    targetRoles: ['trainer'],
    channels: ['app', 'email'],
  },
];

// Types would go here
type TrainerMember = {
  id: string;
  name: string;
  lastCheckIn?: string;
  nextSession?: string;
  progress?: number;
};

const TrainerDashboard = () => {
  const { user } = useAuth();
  const { currentBranch } = useBranch();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [assignedMembers, setAssignedMembers] = useState<TrainerMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssignedMembers = async () => {
      try {
        setIsLoading(true);
        if (!user?.id) return;
        
        // Fetch trainer assignments
        const { data: assignments, error: assignmentsError } = await supabase
          .from('trainer_assignments')
          .select(`
            id, 
            member_id,
            members:member_id (
              id, name, email, phone
            )
          `)
          .eq('trainer_id', user.id)
          .eq('is_active', true);
        
        if (assignmentsError) throw assignmentsError;
        
        if (assignments && assignments.length > 0) {
          const members = assignments
            .filter(assignment => assignment.members) // Filter out any null members
            .map(assignment => {
              const members = assignment.members as any;
              return {
                id: members?.id || '',
                name: members?.name || 'Unknown',
                // Add other fields as needed
              };
            });
          
          setAssignedMembers(members);
        }
      } catch (error) {
        console.error('Error fetching assigned members:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAssignedMembers();
  }, [user?.id, currentBranch?.id]);

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-2">Trainer Dashboard</h1>
        <p className="text-muted-foreground mb-6">
          Welcome back, {user?.name || 'Trainer'}
        </p>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">My Members</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="plans">Training Plans</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Announcements</CardTitle>
                </CardHeader>
                <CardContent>
                  {trainerAnnouncements.map(announcement => (
                    <div key={announcement.id} className="mb-4 pb-4 border-b last:border-0">
                      <h3 className="font-medium">{announcement.title}</h3>
                      <p className="text-sm text-muted-foreground">{announcement.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Posted by {announcement.authorName}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No recent activities to display.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="members">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>My Members</CardTitle>
                <Button className="ml-auto" size="sm">
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Request Assignment
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-center py-6">Loading members...</p>
                ) : assignedMembers.length > 0 ? (
                  <div className="grid gap-3">
                    {assignedMembers.map(member => (
                      <div key={member.id} className="flex items-center justify-between border-b pb-3">
                        <div>
                          <h3 className="font-medium">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">Next session: {member.nextSession || 'None scheduled'}</p>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-6">No members assigned yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No upcoming sessions scheduled.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="plans">
            <Card>
              <CardHeader>
                <CardTitle>Training Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No training plans created yet.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default TrainerDashboard;
