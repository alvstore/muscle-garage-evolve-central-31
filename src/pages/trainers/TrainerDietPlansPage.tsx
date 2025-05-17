
import React, { useState } from 'react';
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { DietPlanList } from "@/components/fitness";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/auth/use-auth";
import { useBranch } from "@/hooks/settings/use-branches";
import { toast } from "sonner";
import { DietPlan, adaptToDietPlanClient, adaptToDietPlanDb } from '@/types/diet';

// Mock diet plans
const mockDietPlans: DietPlan[] = [
  {
    id: "1",
    name: "High Protein Plan",
    diet_type: "High Protein",
    description: "For serious bodybuilding and muscle gain",
    daily_calories: 2500,
    protein_ratio: 0.4,
    carbs_ratio: 0.4,
    fat_ratio: 0.2,
    is_custom: false,
    is_global: true,
    trainer_id: "trainer-1",
    branch_id: "branch-1",
    meal_plans: [
      {
        id: "m1",
        name: "Breakfast",
        time: "08:00",
        calories: 600,
        protein: 40,
        carbs: 60,
        fat: 15,
        food_items: [
          {
            id: "f1",
            name: "Eggs",
            quantity: "4 whole",
            calories: 320,
            protein: 24,
            carbs: 0,
            fat: 20,
            notes: "Boiled or scrambled"
          },
          {
            id: "f2",
            name: "Oatmeal",
            quantity: "1 cup",
            calories: 280,
            protein: 16,
            carbs: 60,
            fat: 5,
            notes: "With berries"
          }
        ]
      }
    ],
    created_at: "2023-01-10T09:30:00Z",
    updated_at: "2023-01-15T14:45:00Z"
  },
  {
    id: "2",
    name: "Weight Loss Plan",
    diet_type: "Calorie Deficit",
    description: "For effective weight loss",
    daily_calories: 1800,
    protein_ratio: 0.35,
    carbs_ratio: 0.35,
    fat_ratio: 0.3,
    is_custom: false,
    is_global: true,
    trainer_id: "trainer-1",
    branch_id: "branch-1",
    meal_plans: [
      {
        id: "m2",
        name: "Breakfast",
        time: "08:00",
        calories: 400,
        protein: 30,
        carbs: 40,
        fat: 10,
        food_items: [
          {
            id: "f3",
            name: "Greek Yogurt",
            quantity: "1 cup",
            calories: 200,
            protein: 20,
            carbs: 10,
            fat: 5,
            notes: "Low-fat"
          },
          {
            id: "f4",
            name: "Fruits",
            quantity: "1 cup mixed",
            calories: 200,
            protein: 10,
            carbs: 30,
            fat: 5,
            notes: "Berries and apple"
          }
        ]
      }
    ],
    created_at: "2023-01-12T10:45:00Z",
    updated_at: "2023-01-16T11:30:00Z"
  },
  {
    id: "3",
    name: "Custom Plan for John",
    diet_type: "Maintenance",
    description: "Customized for John's needs",
    daily_calories: 2200,
    protein_ratio: 0.3,
    carbs_ratio: 0.5,
    fat_ratio: 0.2,
    is_custom: true,
    is_global: false,
    member_id: "member-1",
    trainer_id: "trainer-1",
    branch_id: "branch-1",
    meal_plans: [
      {
        id: "m3",
        name: "Lunch",
        time: "13:00",
        calories: 700,
        protein: 50,
        carbs: 70,
        fat: 20,
        food_items: [
          {
            id: "f5",
            name: "Chicken Breast",
            quantity: "200g",
            calories: 350,
            protein: 40,
            carbs: 0,
            fat: 10,
            notes: "Grilled"
          },
          {
            id: "f6",
            name: "Brown Rice",
            quantity: "1 cup",
            calories: 350,
            protein: 10,
            carbs: 70,
            fat: 10,
            notes: "Cooked"
          }
        ]
      }
    ],
    created_at: "2023-01-20T08:15:00Z",
    updated_at: "2023-01-22T16:20:00Z"
  }
];

const TrainerDietPlansPage = () => {
  const { user } = useAuth();
  const { currentBranch } = useBranch();
  const [activeTab, setActiveTab] = useState("all");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<DietPlan | null>(null);
  const [dietPlans] = useState<DietPlan[]>(mockDietPlans);

  // Handler for viewing a diet plan
  const handleViewPlan = (plan: DietPlan) => {
    setSelectedPlan(plan);
    setIsViewDialogOpen(true);
  };

  // Handler for editing a diet plan
  const handleEditPlan = (plan: DietPlan) => {
    // This would navigate to an edit page in a real app
    toast.info("Edit plan functionality would open here");
    console.log("Edit plan:", plan);
  };

  // Handler for duplicating a diet plan
  const handleDuplicatePlan = (plan: DietPlan) => {
    toast.success("Diet plan duplicated");
    console.log("Duplicate plan:", plan);
  };

  // Handler for deleting a diet plan
  const handleDeletePlan = (planId: string) => {
    toast.success("Diet plan deleted");
    console.log("Delete plan ID:", planId);
  };

  // Filter plans based on the active tab
  const getFilteredPlans = () => {
    switch (activeTab) {
      case "global":
        return dietPlans.filter(plan => plan.is_global);
      case "custom":
        return dietPlans.filter(plan => plan.is_custom);
      default:
        return dietPlans;
    }
  };

  return (
    <Container>
      <div className="py-6">
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Diet Plans</h1>
            <p className="text-muted-foreground">
              Manage diet plans for your clients
            </p>
          </div>
          <Button>Create New Diet Plan</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Diet Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Plans</TabsTrigger>
                <TabsTrigger value="global">Global Plans</TabsTrigger>
                <TabsTrigger value="custom">Custom Plans</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="space-y-4">
                <DietPlanList 
                  plans={getFilteredPlans()}
                  onEdit={handleEditPlan}
                  onDelete={handleDeletePlan}
                  onDuplicate={handleDuplicatePlan}
                  onView={handleViewPlan}
                  showFilters={true}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* View Diet Plan Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Diet Plan Details</DialogTitle>
            </DialogHeader>
            {selectedPlan && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{selectedPlan.name}</h3>
                  <p className="text-muted-foreground">{selectedPlan.description}</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="rounded-lg border p-3 text-center">
                    <div className="text-lg font-bold">{selectedPlan.daily_calories}</div>
                    <div className="text-xs text-muted-foreground">Calories</div>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <div className="text-lg font-bold">{Math.round(selectedPlan.protein_ratio * 100)}%</div>
                    <div className="text-xs text-muted-foreground">Protein</div>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <div className="text-lg font-bold">{Math.round(selectedPlan.carbs_ratio * 100)}%</div>
                    <div className="text-xs text-muted-foreground">Carbs</div>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <div className="text-lg font-bold">{Math.round(selectedPlan.fat_ratio * 100)}%</div>
                    <div className="text-xs text-muted-foreground">Fat</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Meal Plans</h4>
                  {selectedPlan.meal_plans && selectedPlan.meal_plans.length > 0 ? (
                    selectedPlan.meal_plans.map((meal) => (
                      <div key={meal.id} className="rounded-lg border p-4 mb-4">
                        <div className="flex justify-between mb-2">
                          <div className="font-medium">{meal.name}</div>
                          <div className="text-sm text-muted-foreground">{meal.time}</div>
                        </div>
                        <div className="text-sm mb-3">{meal.calories} calories</div>
                        
                        <h5 className="text-sm font-medium mb-2">Food Items</h5>
                        <ul className="space-y-2">
                          {meal.food_items.map((food) => (
                            <li key={food.id} className="text-sm flex justify-between">
                              <span>{food.name} ({food.quantity})</span>
                              <span>{food.calories} cal</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No meal plans defined</p>
                  )}
                </div>
                
                <div className="flex justify-between text-sm text-muted-foreground">
                  <div>
                    Created: {new Date(selectedPlan.created_at).toLocaleDateString()}
                  </div>
                  <div>
                    Updated: {new Date(selectedPlan.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Container>
  );
};

export default TrainerDietPlansPage;
