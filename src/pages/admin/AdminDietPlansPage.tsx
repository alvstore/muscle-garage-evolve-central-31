
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { DietPlan } from '@/types';
import { usePermissions } from '@/hooks/use-permissions';
import DietPlansList from '@/components/fitness/DietPlanList';
import DietPlanForm from '@/components/fitness/DietPlanForm';
import { Plus, ArrowLeft } from 'lucide-react';

const AdminDietPlansPage = () => {
  const [plans, setPlans] = useState<DietPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<DietPlan | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { isSuperAdmin } = usePermissions();
  
  useEffect(() => {
    // In a real app, fetch plans from API
    setIsLoading(false);
    setPlans([
      // Sample data
    ]);
  }, []);
  
  const handleCreatePlan = () => {
    setSelectedPlan(null);
    setIsCreating(true);
  };
  
  const handleEditPlan = (plan: DietPlan) => {
    setSelectedPlan(plan);
    setIsCreating(true);
  };
  
  const handleCancel = () => {
    setIsCreating(false);
    setSelectedPlan(null);
  };
  
  const handlePlanCreated = (plan: DietPlan) => {
    setPlans(prev => [plan, ...prev]);
    setIsCreating(false);
    toast({
      title: "Success",
      description: "Diet plan created successfully",
    });
  };
  
  const handlePlanUpdated = (updatedPlan: DietPlan) => {
    setPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
    setIsCreating(false);
    setSelectedPlan(null);
    toast({
      title: "Success",
      description: "Diet plan updated successfully",
    });
  };
  
  const handlePlanDeleted = (planId: string) => {
    setPlans(prev => prev.filter(p => p.id !== planId));
    toast({
      title: "Success",
      description: "Diet plan deleted successfully",
    });
  };
  
  if (isCreating) {
    return (
      <Container>
        <div className="py-6">
          <Button 
            variant="outline" 
            className="mb-4"
            onClick={handleCancel}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Plans
          </Button>
          
          <DietPlanForm 
            existingPlan={selectedPlan}
            onSave={selectedPlan ? handlePlanUpdated : handlePlanCreated}
            onCancel={handleCancel}
            isGlobal={true}
          />
        </div>
      </Container>
    );
  }
  
  return (
    <Container>
      <div className="py-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Diet Plans</CardTitle>
            <Button onClick={handleCreatePlan}>
              <Plus className="h-4 w-4 mr-2" />
              Create Plan
            </Button>
          </CardHeader>
          <CardContent>
            <DietPlansList 
              plans={plans}
              isLoading={isLoading}
              onPlanCreated={handlePlanCreated}
              onPlanUpdated={handlePlanUpdated}
              onPlanDeleted={handlePlanDeleted}
              canCreateGlobal={isSuperAdmin()}
            />
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default AdminDietPlansPage;
