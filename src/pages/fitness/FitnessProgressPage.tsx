
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import ProgressTracker from '@/components/fitness/ProgressTracker';
import MemberProgressChart from '@/components/dashboard/MemberProgressChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/hooks/use-auth';
import { Member } from '@/types';
import MemberSelector from '@/components/fitness/MemberSelector';
import { usePermissions } from '@/hooks/use-permissions';

const FitnessProgressPage = () => {
  const { user } = useAuth();
  const { userRole } = usePermissions();
  const isMember = userRole === 'member';
  
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  
  // For members, they can only view their own progress
  const currentMember: Member = selectedMember || {
    id: user?.id || '1',
    name: user?.name || 'Current Member',
    email: user?.email || 'member@example.com',
    role: 'member',
    membershipStatus: 'active',
  };
  
  // Mock data for member progress charts
  const progressData = [
    { date: '2025-01-01', metrics: { weight: 80, bodyFatPercentage: 22, bmi: 26.4, muscleGain: 0 } },
    { date: '2025-02-01', metrics: { weight: 78, bodyFatPercentage: 21, bmi: 25.8, muscleGain: 1.5 } },
    { date: '2025-03-01', metrics: { weight: 77, bodyFatPercentage: 20, bmi: 25.4, muscleGain: 2.2 } },
    { date: '2025-04-01', metrics: { weight: 76, bodyFatPercentage: 19, bmi: 25.1, muscleGain: 2.8 } },
    { date: '2025-05-01', metrics: { weight: 75, bodyFatPercentage: 18, bmi: 24.8, muscleGain: 3.5 } },
    { date: '2025-06-01', metrics: { weight: 74, bodyFatPercentage: 17, bmi: 24.4, muscleGain: 4.2 } }
  ];
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Fitness Progress</h1>
      </div>
      
      {/* Display member selector for staff/trainers/admin, not for members */}
      {!isMember && (
        <div className="mb-6">
          <MemberSelector 
            onSelectMember={setSelectedMember} 
            selectedMemberId={selectedMember?.id}
          />
          
          {selectedMember && (
            <div className="mt-4 p-4 bg-accent/10 rounded-lg">
              <h2 className="text-lg font-medium">Viewing progress for: {selectedMember.name}</h2>
              <p className="text-sm text-muted-foreground">
                {selectedMember.goal ? `Goal: ${selectedMember.goal}` : ''}
              </p>
            </div>
          )}
        </div>
      )}
      
      {(isMember || selectedMember) && (
        <Tabs defaultValue="tracker">
          <TabsList className="grid w-full md:w-auto grid-cols-2 h-auto">
            <TabsTrigger value="tracker">Progress Tracker</TabsTrigger>
            <TabsTrigger value="charts">Progress Charts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tracker" className="mt-6">
            <ProgressTracker member={currentMember} />
          </TabsContent>
          
          <TabsContent value="charts" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Body Metrics</CardTitle>
                  <CardDescription>Track your body metrics over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <MemberProgressChart 
                    data={progressData} 
                    memberId={currentMember.id} 
                    memberName={currentMember.name} 
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Key Measurements</CardTitle>
                  <CardDescription>View your progress milestones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-accent/20 p-4 rounded-lg text-center">
                        <h3 className="text-sm font-medium text-muted-foreground">Starting Weight</h3>
                        <p className="text-2xl font-bold">{progressData[0].metrics.weight} kg</p>
                      </div>
                      <div className="bg-accent/20 p-4 rounded-lg text-center">
                        <h3 className="text-sm font-medium text-muted-foreground">Current Weight</h3>
                        <p className="text-2xl font-bold">{progressData[progressData.length - 1].metrics.weight} kg</p>
                      </div>
                      <div className="bg-accent/20 p-4 rounded-lg text-center">
                        <h3 className="text-sm font-medium text-muted-foreground">Total Loss</h3>
                        <p className="text-2xl font-bold">{(progressData[0].metrics.weight - progressData[progressData.length - 1].metrics.weight).toFixed(1)} kg</p>
                      </div>
                      <div className="bg-accent/20 p-4 rounded-lg text-center">
                        <h3 className="text-sm font-medium text-muted-foreground">Muscle Gain</h3>
                        <p className="text-2xl font-bold">{progressData[progressData.length - 1].metrics.muscleGain} kg</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
      
      {!isMember && !selectedMember && (
        <div className="text-center py-12 bg-accent/10 rounded-lg">
          <p className="text-lg text-muted-foreground">Please select a member to view their progress</p>
        </div>
      )}
    </div>
  );
};

export default FitnessProgressPage;
