
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { usePermissions } from '@/hooks/use-permissions';
import { useNavigate } from 'react-router-dom';
import DietPlansManager from '@/components/fitness/DietPlansManager';

const DietPlansPage = () => {
  const { user } = useAuth();
  const { userRole, can } = usePermissions();
  const navigate = useNavigate();
  
  // Determine user capabilities based on role
  const isStaffOrTrainer = userRole === 'admin' || userRole === 'staff' || userRole === 'trainer';
  const canCreatePlans = userRole === 'admin' || userRole === 'trainer' || can('create_edit_plans');
  const canAssignPlans = isStaffOrTrainer || can('assign_diet_plan');
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Diet Plans</h1>
        
        {canCreatePlans && (
          <Button onClick={() => navigate("/fitness/diet-plans/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Plan
          </Button>
        )}
      </div>
      
      {isStaffOrTrainer ? (
        <Tabs defaultValue={canCreatePlans ? "manage" : "assign"}>
          <TabsList className="grid w-full md:w-auto grid-cols-2 h-auto">
            {canCreatePlans && <TabsTrigger value="manage">Manage Plans</TabsTrigger>}
            {canAssignPlans && <TabsTrigger value="assign">Assign Plans</TabsTrigger>}
          </TabsList>
          
          {canCreatePlans && (
            <TabsContent value="manage" className="mt-6">
              <DietPlansManager readOnly={!canCreatePlans} />
            </TabsContent>
          )}
          
          {canAssignPlans && (
            <TabsContent value="assign" className="mt-6">
              <DietPlansManager assignOnly={true} />
            </TabsContent>
          )}
        </Tabs>
      ) : (
        // Member view - only show their assigned plans
        <DietPlansManager forMemberId={user?.id} readOnly={true} />
      )}
    </div>
  );
};

export default DietPlansPage;
