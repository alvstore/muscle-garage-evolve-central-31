
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { DietPlanList } from '@/components/fitness';
import { dietPlanService } from '@/services/fitness/dietPlanService';
import { toast } from 'sonner';
import { DietPlan } from '@/types/diet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminDietPlansPage = () => {
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchDietPlans = async () => {
      try {
        setIsLoading(true);
        const plans = await dietPlanService.getAllDietPlans();
        setDietPlans(plans);
      } catch (error) {
        console.error('Error fetching diet plans:', error);
        toast.error('Failed to load diet plans');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDietPlans();
  }, []);

  const handlePlanCreated = (plan: DietPlan) => {
    setDietPlans(prev => [...prev, plan]);
    toast.success('Diet plan created successfully');
  };

  const handlePlanUpdated = (updatedPlan: DietPlan) => {
    setDietPlans(prev => 
      prev.map(plan => plan.id === updatedPlan.id ? updatedPlan : plan)
    );
    toast.success('Diet plan updated successfully');
  };

  const handlePlanDeleted = (planId: string) => {
    setDietPlans(prev => prev.filter(plan => plan.id !== planId));
    toast.success('Diet plan deleted successfully');
  };

  const filteredPlans = activeTab === 'all' 
    ? dietPlans
    : activeTab === 'global'
      ? dietPlans.filter(plan => plan.is_global)
      : dietPlans.filter(plan => !plan.is_global && plan.is_custom);

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Diet Plans Management</h1>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Plans</TabsTrigger>
            <TabsTrigger value="global">Global Plans</TabsTrigger>
            <TabsTrigger value="custom">Custom Plans</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <DietPlanList 
          plans={filteredPlans}
          isLoading={isLoading}
          onPlanCreated={handlePlanCreated}
          onPlanUpdated={handlePlanUpdated}
          onPlanDeleted={handlePlanDeleted}
          canCreateGlobal={true}
        />
      </div>
    </Container>
  );
};

export default AdminDietPlansPage;
