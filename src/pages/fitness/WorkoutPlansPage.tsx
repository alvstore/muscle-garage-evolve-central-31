
import React from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorkoutPlansManager from '@/components/fitness/WorkoutPlansManager';
import { useAuth } from '@/hooks/use-auth';
import { usePermissions } from '@/hooks/use-permissions';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const WorkoutPlansPage = () => {
  const { user } = useAuth();
  const { userRole, can } = usePermissions();
  
  // For staff/admin/trainer, show the full workout plan manager
  // For members, show only their assigned plans
  const isStaffOrTrainer = userRole === 'admin' || userRole === 'staff' || userRole === 'trainer';
  const canAssignWorkoutPlan = can('assign_workout_plan');
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Workout Plans</h1>
      </div>
      
      {isStaffOrTrainer ? (
        <PermissionGuard permission="manage_fitness_data">
          <Tabs defaultValue="manage">
            <TabsList className="grid w-full md:w-auto grid-cols-2 h-auto">
              <TabsTrigger value="manage">Manage Plans</TabsTrigger>
              <TabsTrigger value="assign" disabled={!canAssignWorkoutPlan}>Assign Plans</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manage" className="mt-6">
              <WorkoutPlansManager />
            </TabsContent>
            
            <TabsContent value="assign" className="mt-6">
              {canAssignWorkoutPlan ? (
                <WorkoutPlansManager />
              ) : (
                <Alert>
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>Permission Required</AlertTitle>
                  <AlertDescription>
                    You don't have permission to assign workout plans. Please contact an administrator.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </PermissionGuard>
      ) : (
        // Member view - only show their assigned plans
        <div>
          <Alert className="mb-4">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Your Workout Plans</AlertTitle>
            <AlertDescription>
              These are the workout plans assigned to you by your trainer. Follow them to achieve your fitness goals.
            </AlertDescription>
          </Alert>
          <WorkoutPlansManager forMemberId={user?.id} viewOnly={true} />
        </div>
      )}
    </div>
  );
};

export default WorkoutPlansPage;
