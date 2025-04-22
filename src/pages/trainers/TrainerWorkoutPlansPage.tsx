import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WorkoutPlanList } from '@/components/fitness/WorkoutPlanList';
import { WorkoutPlanForm } from '@/components/fitness/WorkoutPlanForm';
import { WorkoutPlan } from '@/types/workout';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

const mockWorkoutPlans: WorkoutPlan[] = [
  {
    id: '1',
    name: 'Beginner Full Body',
    description: 'A comprehensive workout for beginners targeting all major muscle groups',
    trainerId: 'trainer1',
    workoutDays: [
      {
        id: 'day1',
        name: 'Day 1: Upper Body',
        exercises: [
          { id: 'ex1', name: 'Push-Ups', sets: 3, reps: 10 },
          { id: 'ex2', name: 'Dumbbell Rows', sets: 3, reps: 12 }
        ]
      },
      {
        id: 'day2',
        name: 'Day 2: Lower Body',
        exercises: [
          { id: 'ex3', name: 'Squats', sets: 3, reps: 15 },
          { id: 'ex4', name: 'Lunges', sets: 3, reps: 10 }
        ]
      }
    ],
    targetGoals: ['Strength', 'Muscle Gain'],
    difficulty: 'beginner',
    isGlobal: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    memberId: 'default' // Added memberId
  },
  {
    id: '2',
    name: 'Intermediate Strength',
    description: 'Progressive strength training for intermediate fitness levels',
    trainerId: 'trainer1',
    workoutDays: [
      {
        id: 'day1',
        name: 'Day 1: Chest & Triceps',
        exercises: [
          { id: 'ex1', name: 'Bench Press', sets: 4, reps: 8, weight: '60kg' },
          { id: 'ex2', name: 'Incline Dumbbell Press', sets: 3, reps: 10, weight: '20kg' }
        ]
      },
      {
        id: 'day2',
        name: 'Day 2: Back & Biceps',
        exercises: [
          { id: 'ex3', name: 'Deadlifts', sets: 4, reps: 6, weight: '80kg' },
          { id: 'ex4', name: 'Pull-Ups', sets: 3, reps: 8 }
        ]
      }
    ],
    targetGoals: ['Strength', 'Muscle Gain'],
    difficulty: 'intermediate',
    isGlobal: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    memberId: 'default' // Added memberId
  }
];

const TrainerWorkoutPlansPage = () => {
  const { user } = useAuth();
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>(mockWorkoutPlans);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [isEditingPlan, setIsEditingPlan] = useState<string | null>(null);
  
  const filteredPlans = workoutPlans.filter(plan => 
    plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleCreatePlan = (newPlan: WorkoutPlan) => {
    const planWithIds = {
      ...newPlan,
      id: `plan-${Date.now()}`,
      trainerId: user?.id || 'unknown',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setWorkoutPlans([...workoutPlans, planWithIds]);
    setIsCreatingPlan(false);
    toast.success("Workout plan created successfully");
  };
  
  const handleUpdatePlan = (updatedPlan: WorkoutPlan) => {
    const updatedPlans = workoutPlans.map(plan => 
      plan.id === updatedPlan.id ? { ...updatedPlan, updatedAt: new Date().toISOString() } : plan
    );
    
    setWorkoutPlans(updatedPlans);
    setIsEditingPlan(null);
    toast.success("Workout plan updated successfully");
  };
  
  const handleDeletePlan = (planId: string) => {
    const updatedPlans = workoutPlans.filter(plan => plan.id !== planId);
    setWorkoutPlans(updatedPlans);
    toast.success("Workout plan deleted successfully");
  };
  
  if (isCreatingPlan) {
    return (
      <div className="container mx-auto py-6">
        <WorkoutPlanForm 
          member={{ 
            id: 'default', 
            name: 'New Member', 
            role: 'member', 
            membershipStatus: 'active',
            email: 'default@example.com' 
          }}
          trainerId={user?.id || 'unknown'}
          onSave={handleCreatePlan}
          onCancel={() => setIsCreatingPlan(false)}
        />
      </div>
    );
  }
  
  if (isEditingPlan) {
    const planToEdit = workoutPlans.find(plan => plan.id === isEditingPlan);
    if (!planToEdit) return null;
    
    return (
      <div className="container mx-auto py-6">
        <WorkoutPlanForm
          member={{ 
            id: planToEdit.memberId || 'default', 
            name: 'Member', 
            role: 'member', 
            membershipStatus: 'active',
            email: 'member@example.com' 
          }}
          trainerId={user?.id || 'unknown'}
          existingPlan={planToEdit}
          onSave={handleUpdatePlan}
          onCancel={() => setIsEditingPlan(null)}
        />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Workout Plans</h1>
          <p className="text-muted-foreground">Manage and create workout plans for your members</p>
        </div>
        <Button onClick={() => setIsCreatingPlan(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Plan
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Workout Plan Library</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search plans..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <CardDescription>
            Create and manage workout plans that can be assigned to members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="my-plans">
            <TabsList className="mb-4">
              <TabsTrigger value="my-plans">My Plans</TabsTrigger>
              <TabsTrigger value="global">Global Plans</TabsTrigger>
            </TabsList>
            
            <TabsContent value="my-plans">
              <WorkoutPlanList 
                plans={filteredPlans.filter(plan => plan.trainerId === user?.id)} 
                onEdit={(planId) => setIsEditingPlan(planId)} 
                onDelete={handleDeletePlan} 
              />
            </TabsContent>
            
            <TabsContent value="global">
              <WorkoutPlanList 
                plans={filteredPlans.filter(plan => plan.isGlobal)} 
                onEdit={(planId) => setIsEditingPlan(planId)} 
                onDelete={handleDeletePlan} 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainerWorkoutPlansPage;
