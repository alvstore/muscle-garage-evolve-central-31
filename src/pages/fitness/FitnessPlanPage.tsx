
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FitnessPlanManager from '@/components/fitness/FitnessPlanManager';
import ProgressTracker from '@/components/fitness/ProgressTracker';
import WorkoutPlanForm from '@/components/fitness/WorkoutPlanForm';
import DietPlanForm from '@/components/fitness/DietPlanForm';
import { useAuth } from '@/hooks/use-auth';
import { usePermissions } from '@/hooks/use-permissions';
import { Member } from '@/types';

const FitnessPlanPage = () => {
  const { user } = useAuth();
  const { can, userRole } = usePermissions();
  const isMember = userRole === 'member';
  const canManagePlans = userRole === 'admin' || userRole === 'trainer' || can('assign_workout_plan') || can('assign_diet_plan');
  
  // Mock data for a logged in user/member
  const mockMember: Member = {
    id: user?.id || '1',
    name: user?.name || 'Current Member',
    email: user?.email || 'member@example.com',
    role: 'member',
    membershipStatus: 'active',
  };
  
  // Mock trainer ID - in a real app, this would come from the user's assigned trainer
  const mockTrainerId = 'trainer-123';
  
  // Mock handlers for saving plans
  const handleSaveWorkoutPlan = (plan: any) => {
    console.log('Saving workout plan:', plan);
    // Logic to save workout plan
  };
  
  const handleSaveDietPlan = (plan: any) => {
    console.log('Saving diet plan:', plan);
    // Logic to save diet plan
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {isMember ? "My Fitness Plans" : "Fitness Plans Management"}
        </h1>
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
          <FitnessPlanManager 
            members={[mockMember]} 
            trainerId={mockTrainerId}
            readOnly={isMember} 
          />
        </TabsContent>
        
        <TabsContent value="progress" className="mt-6">
          <ProgressTracker member={mockMember} />
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
                  <WorkoutPlanForm 
                    member={mockMember}
                    trainerId={mockTrainerId}
                    onSave={handleSaveWorkoutPlan}
                    onCancel={() => console.log('Workout plan form canceled')}
                  />
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
                  <DietPlanForm 
                    member={mockMember}
                    trainerId={mockTrainerId}
                    onSave={handleSaveDietPlan}
                    onCancel={() => console.log('Diet plan form canceled')}
                    showDaysTabs={true}
                  />
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
