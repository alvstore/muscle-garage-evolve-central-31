
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

const AdminDietPlansPage = () => {
  const { user } = useAuth();
  const { currentBranch } = useBranch();
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<DietPlan | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllDietPlans = async () => {
      setIsLoading(true);
      try {
        // Admin can view all plans across branches
        const response = await dietPlanService.getAllDietPlans();
        setDietPlans(response);
      } catch (error) {
        toast.error("Failed to load diet plans");
        console.error("Error fetching diet plans:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllDietPlans();
  }, []);

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
    }
  };

  const handleSavePlan = async (plan: DietPlan) => {
    try {
      if (selectedPlan) {
        const updatedPlan = await dietPlanService.updateDietPlan(plan.id, plan);
        if (updatedPlan) {
          setDietPlans(dietPlans.map(p => p.id === plan.id ? updatedPlan : p));
          toast.success("Diet plan updated successfully");
        }
      } else {
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
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <h1 className="text-3xl font-bold">Diet Plans Management</h1>
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
        <h1 className="text-3xl font-bold">Diet Plans Management</h1>
        {!showForm && (
          <Button onClick={handleCreatePlan}>Create New Diet Plan</Button>
        )}
      </div>

      {showForm ? (
        <DietPlanForm
          member={{
            id: 'default',
            name: 'New Plan',
            email: '',
            role: 'member',
            membershipStatus: 'active'
          }}
          existingPlan={selectedPlan || undefined}
          trainerId={user?.id || 'admin'}
          onSave={handleSavePlan}
          onCancel={() => {
            setShowForm(false);
            setSelectedPlan(null);
          }}
        />
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Diet Plans</TabsTrigger>
            <TabsTrigger value="global">Global Plans</TabsTrigger>
            <TabsTrigger value="branch">Branch Plans</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <DietPlanList
              plans={dietPlans}
              onEdit={handleEditPlan}
              onDelete={handleDeletePlan}
            />
          </TabsContent>

          <TabsContent value="global">
            <DietPlanList
              plans={dietPlans.filter(p => p.isGlobal)}
              onEdit={handleEditPlan}
              onDelete={handleDeletePlan}
            />
          </TabsContent>

          <TabsContent value="branch">
            <DietPlanList
              plans={dietPlans.filter(p => !p.isGlobal && p.branchId === currentBranch?.id)}
              onEdit={handleEditPlan}
              onDelete={handleDeletePlan}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AdminDietPlansPage;
