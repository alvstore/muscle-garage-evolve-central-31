
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { DietPlanList } from '@/components/fitness';
import { dietPlanService } from '@/services/dietPlanService';
import { DietPlan } from '@/types/diet';
import { toast } from 'sonner';

const DietPlanPage = () => {
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Diet Plans</h1>
        <div className="bg-card rounded-lg shadow p-6">
          <DietPlanList 
            plans={dietPlans}
            isLoading={isLoading}
            onPlanCreated={handlePlanCreated}
            onPlanUpdated={handlePlanUpdated}
            onPlanDeleted={handlePlanDeleted}
          />
        </div>
      </div>
    </Container>
  );
};

export default DietPlanPage;
