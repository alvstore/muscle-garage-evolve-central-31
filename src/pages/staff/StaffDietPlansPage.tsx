
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { DietPlan } from '@/types/diet';
import DietPlanForm from '@/components/fitness/DietPlanForm';
import { DietPlanList } from '@/components/fitness/DietPlanList';
import { dietPlanService } from '@/services/dietPlanService';
import { useBranch } from '@/hooks/use-branch';

const StaffDietPlansPage = () => {
  const { user } = useAuth();
  const { currentBranch } = useBranch();
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<DietPlan | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchDietPlans = async () => {
      setIsLoading(true);
      try {
        const response = await dietPlanService.getTrainerDietPlans();
        setDietPlans(response);
      } catch (error) {
        toast.error("Failed to load diet plans");
        console.error("Error fetching diet plans:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (currentBranch?.id) {
      fetchDietPlans();
    }
  }, [currentBranch?.id]);
  
  const handleCreatePlan = () => {
    setSelectedPlan(null);
    setShowForm(true);
  };
  
  const handleEditPlan = (planId: string) => {
    const plan = dietPlans.find(p => p.id === planId);
    if (plan) {
      setSelectedPlan(plan);
      setShowForm(true);
    }
  };
  
  const handleDeletePlan = async (planId: string) => {
    try {
      const success = await dietPlanService.deleteDietPlan(planId);
      if (success) {
        setDietPlans(dietPlans.filter(p => p.id !== planId));
        toast.success("Diet plan deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete diet plan");
      console.error("Error deleting diet plan:", error);
    }
  };
  
  const handleSavePlan = async (plan: DietPlan) => {
    try {
      if (selectedPlan) {
        // Update existing plan
        const updatedPlan = await dietPlanService.updateDietPlan(plan.id, plan);
        if (updatedPlan) {
          setDietPlans(dietPlans.map(p => p.id === plan.id ? updatedPlan : p));
          toast.success("Diet plan updated successfully");
        }
      } else {
        // Create new plan
        const newPlan = await dietPlanService.createDietPlan({
          ...plan,
          branchId: currentBranch?.id
        });
        if (newPlan) {
          setDietPlans([...dietPlans, newPlan]);
          toast.success("Diet plan created successfully");
        }
      }
      
      setShowForm(false);
      setSelectedPlan(null);
    } catch (error) {
      toast.error("Failed to save diet plan");
      console.error("Error saving diet plan:", error);
    }
  };
  
  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedPlan(null);
  };
  
  // Mock member for the form if needed
  const mockMember = {
    id: user?.id || 'member-1',
    name: user?.name || 'Member Name',
    email: user?.email || 'member@example.com',
    role: 'member' as const,
    membershipStatus: 'active' as const,
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <h1 className="text-3xl font-bold">Diet Plans</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-7 bg-muted rounded w-2/3"></div>
                <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                  <div className="h-4 bg-muted rounded w-4/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Diet Plans</h1>
        {!showForm && (
          <Button onClick={handleCreatePlan}>Create New Diet Plan</Button>
        )}
      </div>
      
      {showForm ? (
        <DietPlanForm
          member={mockMember}
          existingPlan={selectedPlan || undefined}
          trainerId={user?.id || 'staff-user'}
          onSave={handleSavePlan}
          onCancel={handleCancelForm}
        />
      ) : (
        <Tabs defaultValue="global">
          <TabsList className="mb-6">
            <TabsTrigger value="global">Global Diet Plans</TabsTrigger>
            <TabsTrigger value="custom">Branch Diet Plans</TabsTrigger>
            <TabsTrigger value="assigned">Assigned Plans</TabsTrigger>
          </TabsList>
          
          <TabsContent value="global">
            <Card>
              <CardHeader>
                <CardTitle>Global Diet Plans</CardTitle>
                <CardDescription>Standard diet plans that can be assigned to any member</CardDescription>
              </CardHeader>
              <CardContent>
                <DietPlanList
                  plans={dietPlans.filter(p => p.isGlobal)}
                  onEdit={handleEditPlan}
                  onDelete={handleDeletePlan}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="custom">
            <Card>
              <CardHeader>
                <CardTitle>Branch Diet Plans</CardTitle>
                <CardDescription>Diet plans specific to {currentBranch?.name || 'this branch'}</CardDescription>
              </CardHeader>
              <CardContent>
                <DietPlanList
                  plans={dietPlans.filter(p => !p.isGlobal && p.branchId === currentBranch?.id)}
                  onEdit={handleEditPlan}
                  onDelete={handleDeletePlan}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="assigned">
            <Card>
              <CardHeader>
                <CardTitle>Assigned Plans</CardTitle>
                <CardDescription>Diet plans that have been assigned to members</CardDescription>
              </CardHeader>
              <CardContent>
                {dietPlans.filter(p => p.memberId).length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No diet plans have been assigned to members yet
                  </div>
                ) : (
                  <DietPlanList
                    plans={dietPlans.filter(p => p.memberId)}
                    onEdit={handleEditPlan}
                    onDelete={handleDeletePlan}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default StaffDietPlansPage;
