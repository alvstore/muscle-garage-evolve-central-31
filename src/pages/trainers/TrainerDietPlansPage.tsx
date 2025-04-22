
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { DietPlan } from '@/types/diet';
import DietPlanForm from '@/components/fitness/DietPlanForm';
import { DietPlanList } from '@/components/fitness/DietPlanList';

// Mock data for initial development
const mockDietPlans: DietPlan[] = [
  {
    id: "diet-plan-1",
    name: "Weight Loss Meal Plan",
    description: "A balanced meal plan designed for healthy weight loss",
    memberId: "",
    trainerId: "trainer1",
    mealPlans: [
      {
        id: "meal-1",
        name: "Breakfast",
        time: "8:00 AM",
        items: ["Oatmeal with berries", "Greek yogurt", "Black coffee"],
        macros: {
          calories: 350,
          protein: 20,
          carbs: 45,
          fats: 10
        }
      },
      {
        id: "meal-2",
        name: "Lunch",
        time: "12:30 PM",
        items: ["Grilled chicken salad", "Whole grain bread", "Apple"],
        macros: {
          calories: 450,
          protein: 35,
          carbs: 50,
          fats: 15
        }
      },
      {
        id: "meal-3",
        name: "Dinner",
        time: "7:00 PM",
        items: ["Baked salmon", "Brown rice", "Steamed vegetables"],
        macros: {
          calories: 500,
          protein: 30,
          carbs: 55,
          fats: 20
        }
      }
    ],
    notes: "Drink at least 2 liters of water daily. Avoid processed foods and added sugars.",
    isCustom: false,
    isGlobal: true,
    dietType: "standard",
    goal: "weight-loss",
    dailyCalories: 1600,
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z"
  },
  {
    id: "diet-plan-2",
    name: "Muscle Building Plan",
    description: "High protein meal plan designed for muscle growth",
    memberId: "",
    trainerId: "trainer1",
    mealPlans: [
      {
        id: "meal-1",
        name: "Breakfast",
        time: "7:00 AM",
        items: ["Protein pancakes", "Eggs", "Spinach"],
        macros: {
          calories: 500,
          protein: 40,
          carbs: 50,
          fats: 15
        }
      },
      {
        id: "meal-2",
        name: "Mid-morning Snack",
        time: "10:00 AM",
        items: ["Protein shake", "Banana"],
        macros: {
          calories: 300,
          protein: 25,
          carbs: 30,
          fats: 5
        }
      },
      {
        id: "meal-3",
        name: "Lunch",
        time: "1:00 PM",
        items: ["Grilled steak", "Sweet potato", "Broccoli"],
        macros: {
          calories: 600,
          protein: 45,
          carbs: 60,
          fats: 20
        }
      },
      {
        id: "meal-4",
        name: "Dinner",
        time: "7:00 PM",
        items: ["Chicken breast", "Quinoa", "Mixed vegetables"],
        macros: {
          calories: 550,
          protein: 40,
          carbs: 55,
          fats: 15
        }
      }
    ],
    notes: "Aim for 1g of protein per pound of body weight. Time your carbs around workouts.",
    isCustom: false,
    isGlobal: true,
    dietType: "standard",
    goal: "muscle-gain",
    dailyCalories: 2800,
    createdAt: "2025-02-01T10:00:00Z",
    updatedAt: "2025-02-01T10:00:00Z"
  }
];

const TrainerDietPlansPage = () => {
  const { user } = useAuth();
  const [dietPlans, setDietPlans] = useState<DietPlan[]>(mockDietPlans);
  const [selectedPlan, setSelectedPlan] = useState<DietPlan | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  // For the actual implementation, you would fetch diet plans from the API
  /*
  useEffect(() => {
    const fetchDietPlans = async () => {
      try {
        const response = await dietPlanService.getTrainerDietPlans(user?.id);
        setDietPlans(response);
      } catch (error) {
        toast.error("Failed to load diet plans");
      }
    };
    
    fetchDietPlans();
  }, [user?.id]);
  */
  
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
  
  const handleDeletePlan = (planId: string) => {
    // In a real implementation, you would call an API to delete the plan
    // For now, we'll just filter it out from our state
    setDietPlans(dietPlans.filter(p => p.id !== planId));
    toast.success("Diet plan deleted successfully");
  };
  
  const handleSavePlan = (plan: DietPlan) => {
    // In a real implementation, you would call an API to save the plan
    if (selectedPlan) {
      // Update existing plan
      setDietPlans(dietPlans.map(p => p.id === plan.id ? plan : p));
      toast.success("Diet plan updated successfully");
    } else {
      // Create new plan
      setDietPlans([...dietPlans, plan]);
      toast.success("Diet plan created successfully");
    }
    
    setShowForm(false);
    setSelectedPlan(null);
  };
  
  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedPlan(null);
  };
  
  // Mock member for the form
  const mockMember = {
    id: user?.id || 'member-1',
    name: user?.name || 'Member Name',
    email: user?.email || 'member@example.com',
    role: 'member' as const,
    membershipStatus: 'active' as const,
  };
  
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
          trainerId={user?.id || 'trainer1'}
          onSave={handleSavePlan}
          onCancel={handleCancelForm}
        />
      ) : (
        <Tabs defaultValue="global">
          <TabsList className="mb-6">
            <TabsTrigger value="global">Global Diet Plans</TabsTrigger>
            <TabsTrigger value="custom">My Custom Plans</TabsTrigger>
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
                <CardTitle>My Custom Plans</CardTitle>
                <CardDescription>Diet plans you've created specifically for your members</CardDescription>
              </CardHeader>
              <CardContent>
                <DietPlanList
                  plans={dietPlans.filter(p => !p.isGlobal && p.trainerId === user?.id)}
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
                <CardDescription>Diet plans currently assigned to members</CardDescription>
              </CardHeader>
              <CardContent>
                <DietPlanList
                  plans={dietPlans.filter(p => p.memberId !== "")}
                  onEdit={handleEditPlan}
                  onDelete={handleDeletePlan}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default TrainerDietPlansPage;
