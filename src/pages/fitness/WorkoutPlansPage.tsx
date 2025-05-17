
import React from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorkoutPlansManager from '@/components/fitness/WorkoutPlansManager';
import { useAuth } from '@/hooks/auth/use-auth';
import { usePermissions } from '@/hooks/auth/use-permissions';

const WorkoutPlansPage = () => {
  const { user } = useAuth();
  const { userRole } = usePermissions();
  
  // For staff/admin/trainer, show the full workout plan manager
  // For members, show only their assigned plans
  const isStaffOrTrainer = userRole === 'admin' || userRole === 'staff' || userRole === 'trainer';
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Workout Plans</h1>
      </div>
      
      {isStaffOrTrainer ? (
        <Tabs defaultValue="manage">
          <TabsList className="grid w-full md:w-auto grid-cols-2 h-auto">
            <TabsTrigger value="manage">Manage Plans</TabsTrigger>
            <TabsTrigger value="assign">Assign Plans</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manage" className="mt-6">
            <WorkoutPlansManager />
          </TabsContent>
          
          <TabsContent value="assign" className="mt-6">
            <WorkoutPlansManager />
          </TabsContent>
        </Tabs>
      ) : (
        // Member view - only show their assigned plans
        <WorkoutPlansManager forMemberId={user?.id} />
      )}
    </div>
  );
};

export default WorkoutPlansPage;
