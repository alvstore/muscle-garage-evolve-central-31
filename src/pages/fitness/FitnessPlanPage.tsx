
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FitnessPlanManager from '@/components/fitness/FitnessPlanManager';
import ProgressTracker from '@/components/fitness/ProgressTracker';
import WorkoutPlanForm from '@/components/fitness/WorkoutPlanForm';
import DietPlanForm from '@/components/fitness/DietPlanForm';
import { useAuth } from '@/hooks/use-auth';
import { usePermissions } from '@/hooks/use-permissions';
import { Member } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { UserRound } from 'lucide-react';

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

const FitnessPlanPage = () => {
  const { user } = useAuth();
  const { userRole, can } = usePermissions();
  const isMember = userRole === 'member';
  const isAdmin = userRole === 'admin';
  const isTrainer = userRole === 'trainer';
  const canManagePlans = isAdmin || isTrainer || can('assign_workout_plan') || can('assign_diet_plan');
  
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  
  // For trainers, filter to only show their assigned members
  const trainerAssignedMembers = isTrainer && user?.id ? 
    mockMembers.filter(member => member.trainerId === user.id) : [];
  
  // Determine which members to show
  const availableMembers = isAdmin ? 
    mockMembers : 
    (isTrainer ? trainerAssignedMembers : []);
  
  // If user is a member, get their own profile
  const userMember = isMember && user ? {
    id: user.id || 'member-default',
    name: user.name || 'Current Member',
    email: user.email || 'member@example.com',
    role: 'member' as const,
    membershipStatus: 'active' as const,
  } : null;
  
  // Use useEffect to set the selected member ID when data is available
  useEffect(() => {
    if (isMember && userMember) {
      setSelectedMemberId(userMember.id);
    } else if (availableMembers.length > 0 && !selectedMemberId) {
      setSelectedMemberId(availableMembers[0].id);
    }
  }, [availableMembers, isMember, userMember, selectedMemberId]);
  
  // Get the selected member object safely
  const selectedMember = React.useMemo(() => {
    if (isMember && userMember) {
      return userMember;
    }
    
    if (!selectedMemberId && availableMembers.length > 0) {
      return availableMembers[0];
    }
    
    return availableMembers.find(m => m.id === selectedMemberId) || null;
  }, [selectedMemberId, availableMembers, isMember, userMember]);
  
  // Mock trainer ID - in a real app, this would come from the user's assigned trainer
  const mockTrainerId = user?.role === 'trainer' && user?.id ? user.id : 'trainer-123';
  
  // Mock handlers for saving plans
  const handleSaveWorkoutPlan = (plan: any) => {
    console.log('Saving workout plan:', plan);
    // Logic to save workout plan
  };
  
  const handleSaveDietPlan = (plan: any) => {
    console.log('Saving diet plan:', plan);
    // Logic to save diet plan
  };
  
  if (!user) {
    return <div className="p-8 text-center">Loading user data...</div>;
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">
          {isMember ? "My Fitness Plans" : "Fitness Plans Management"}
        </h1>
        
        {!isMember && (
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
      </div>
      
      <Tabs defaultValue="plans">
        <TabsList className="grid w-full md:w-auto grid-cols-4 h-auto">
          <TabsTrigger value="plans">My Plans</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          {canManagePlans && (
            <>
              <TabsTrigger value="workout">Workout</TabsTrigger>
              <TabsTrigger value="diet">Diet</TabsTrigger>
            </>
          )}
        </TabsList>
        
        <TabsContent value="plans" className="mt-6">
          {selectedMember && (
            <FitnessPlanManager 
              members={[selectedMember]} 
              trainerId={mockTrainerId}
              readOnly={isMember} 
            />
          )}
          {!selectedMember && (
            <div className="p-4 text-center">
              No member selected. Please select a member to view plans.
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="progress" className="mt-6">
          {selectedMember && <ProgressTracker member={selectedMember} />}
          {!selectedMember && (
            <div className="p-4 text-center">
              No member selected. Please select a member to view progress.
            </div>
          )}
        </TabsContent>
        
        {canManagePlans && (
          <>
            <TabsContent value="workout" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Workout Plan</CardTitle>
                  <CardDescription>Create or update workout plans for members</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedMember ? (
                    <WorkoutPlanForm 
                      member={selectedMember}
                      trainerId={mockTrainerId}
                      onSave={handleSaveWorkoutPlan}
                      onCancel={() => console.log('Workout plan form canceled')}
                    />
                  ) : (
                    <div className="p-4 text-center">
                      No member selected. Please select a member to create a workout plan.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="diet" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Diet Plan</CardTitle>
                  <CardDescription>Create or update nutrition plans for members</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedMember ? (
                    <DietPlanForm 
                      member={selectedMember}
                      trainerId={mockTrainerId}
                      onSave={handleSaveDietPlan}
                      onCancel={() => console.log('Diet plan form canceled')}
                    />
                  ) : (
                    <div className="p-4 text-center">
                      No member selected. Please select a member to create a diet plan.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default FitnessPlanPage;
