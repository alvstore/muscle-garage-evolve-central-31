
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProgressTracker from '@/components/fitness/ProgressTracker';
import MemberBodyMeasurements from '@/components/fitness/MemberBodyMeasurements';
import BodyMeasurementForm from '@/components/fitness/BodyMeasurementForm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { UserRound, Plus, BarChart2, TrendingUp, Weight, RotateCw } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { useAuth } from '@/hooks/use-auth';
import { Member } from '@/types';
import { usePermissions } from '@/hooks/use-permissions';

// Mock members data
const mockMembers: Member[] = [
  {
    id: 'member-1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'member',
    membershipStatus: 'active',
    trainerId: 'trainer-1'
  },
  {
    id: 'member-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'member',
    membershipStatus: 'active',
    trainerId: 'trainer-1'
  },
  {
    id: 'member-3',
    name: 'Robert Johnson',
    email: 'robert@example.com',
    role: 'member',
    membershipStatus: 'active',
    trainerId: 'trainer-2'
  },
  {
    id: 'member-4',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    role: 'member',
    membershipStatus: 'active',
    trainerId: 'trainer-2'
  }
];

const FitnessProgressPage = () => {
  const { user } = useAuth();
  const { userRole, can } = usePermissions();
  const [activeTab, setActiveTab] = useState('progress');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  
  const isAdmin = userRole === 'admin';
  const isTrainer = userRole === 'trainer';
  const isMember = userRole === 'member';
  
  const canViewAllMembers = isAdmin || can('view_all_member_progress');
  
  // If user is a member, get their own progress
  const userMember = isMember ? { 
    id: user?.id || '',
    name: user?.name || '',
    email: user?.email || '',
    role: 'member' as const,
    membershipStatus: 'active' as const
  } : null;
  
  // If user is a trainer, get members assigned to them
  const trainerAssignedMembers = isTrainer ? 
    mockMembers.filter(member => member.trainerId === user?.id) : [];
  
  // Determine which members to show in the selector
  const availableMembers = canViewAllMembers ? 
    mockMembers : 
    (isTrainer ? trainerAssignedMembers : (userMember ? [userMember] : []));
  
  // Default to the first member or the user's own profile if they're a member
  React.useEffect(() => {
    if (availableMembers.length > 0 && !selectedMemberId) {
      setSelectedMemberId(availableMembers[0].id);
    }
  }, [availableMembers, selectedMemberId]);
  
  // Get the selected member object
  const selectedMember = availableMembers.find(m => m.id === selectedMemberId) || availableMembers[0];
  
  return (
    <Container>
      <div className="py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold">Fitness Progress</h1>
          
          <div className="flex flex-wrap gap-2">
            {(canViewAllMembers || isTrainer) && (
              <div className="flex items-center gap-2">
                <Label htmlFor="member-select" className="whitespace-nowrap">
                  <UserRound className="h-4 w-4 inline mr-1" />
                  Member:
                </Label>
                <Select 
                  value={selectedMemberId} 
                  onValueChange={setSelectedMemberId}
                >
                  <SelectTrigger id="member-select" className="w-[200px]">
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMembers.map(member => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <DatePicker 
              date={selectedDate} 
              setDate={setSelectedDate} 
            />
            
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <RotateCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="progress" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Progress Overview
            </TabsTrigger>
            <TabsTrigger value="measurements" className="flex items-center gap-1">
              <Weight className="h-4 w-4" />
              Body Measurements
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1">
              <BarChart2 className="h-4 w-4" />
              Progress Analytics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="progress">
            {selectedMember && (
              <ProgressTracker member={selectedMember} />
            )}
          </TabsContent>
          
          <TabsContent value="measurements">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Body Measurements</CardTitle>
                    <CardDescription>Track physical measurements over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedMember && (
                      <MemberBodyMeasurements 
                        member={selectedMember}
                        viewOnly={!(isMember || isAdmin || (isTrainer && selectedMember.trainerId === user?.id))}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-1">
                {(isMember || isAdmin || (isTrainer && selectedMember?.trainerId === user?.id)) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Add New Measurement</CardTitle>
                      <CardDescription>Record new body measurements</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedMember && (
                        <BodyMeasurementForm 
                          memberId={selectedMember.id}
                          onSave={() => console.log('Measurement saved')}
                        />
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Progress Analytics</CardTitle>
                <CardDescription>Detailed analysis of fitness progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-8 text-center text-muted-foreground">
                  <p>Detailed analytics will be displayed here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default FitnessProgressPage;
