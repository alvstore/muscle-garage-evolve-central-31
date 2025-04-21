
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Edit, Trash2, Search } from 'lucide-react';
import { WorkoutPlan, Exercise } from '@/types/workout';
import { v4 as uuidv4 } from 'uuid';
import WorkoutPlansManager from '@/components/fitness/WorkoutPlansManager';
import { toast } from 'sonner';

const WorkoutPlansPage: React.FC = () => {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDescription, setNewTemplateDescription] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const currentUser = { id: 'user123', name: 'John Doe' }; // Mock user

  useEffect(() => {
    // Mock data for demonstration
    const mockWorkoutPlans: WorkoutPlan[] = [
      {
        id: "wp1",
        name: "Full Body Blast",
        description: "A comprehensive workout targeting all major muscle groups.",
        workoutDays: [],
      },
      {
        id: "wp2",
        name: "Upper Body Strength",
        description: "Focus on building strength in the chest, back, shoulders, and arms.",
        workoutDays: [],
      },
      {
        id: "wp3",
        name: "Lower Body Power",
        description: "Emphasizing leg strength and power.",
        workoutDays: [],
      },
    ];
    setWorkoutPlans(mockWorkoutPlans);
  }, []);

  // Fix the Exercise type by adding the required 'rest' property
  const mockExercises: Exercise[] = [
    { 
      id: "ex1", 
      name: "Barbell Bench Press", 
      sets: 3, 
      reps: 12,
      rest: 60 // Add rest period in seconds
    },
    { 
      id: "ex2", 
      name: "Incline Dumbbell Press", 
      sets: 3, 
      reps: 10,
      rest: 60 // Add rest period in seconds
    },
    { 
      id: "ex3", 
      name: "Dumbbell Flyes", 
      sets: 3, 
      reps: 12,
      rest: 45 // Add rest period in seconds
    },
    { 
      id: "ex4", 
      name: "Pull-ups", 
      sets: 3, 
      reps: 8,
      rest: 60 // Add rest period in seconds
    },
    { 
      id: "ex5", 
      name: "Barbell Rows", 
      sets: 3, 
      reps: 10,
      rest: 60 // Add rest period in seconds
    },
    { 
      id: "ex6", 
      name: "Lat Pulldowns", 
      sets: 3, 
      reps: 12,
      rest: 45 // Add rest period in seconds
    },
    { 
      id: "ex7", 
      name: "Overhead Press", 
      sets: 3, 
      reps: 10,
      rest: 60 // Add rest period in seconds
    },
    { 
      id: "ex8", 
      name: "Lateral Raises", 
      sets: 3, 
      reps: 12,
      rest: 45 // Add rest period in seconds
    },
    { 
      id: "ex9", 
      name: "Bicep Curls", 
      sets: 3, 
      reps: 12,
      rest: 45 // Add rest period in seconds
    },
    { 
      id: "ex10", 
      name: "Triceps Extensions", 
      sets: 3, 
      reps: 12,
      rest: 45 // Add rest period in seconds
    }
  ];

  const filteredWorkoutPlans = workoutPlans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Workout Plans</CardTitle>
              <CardDescription>Manage and create workout plans for members</CardDescription>
            </div>
            <Button onClick={() => setShowTemplateDialog(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="search">Search Workout Plans</Label>
            <div className="relative">
              <Input
                id="search"
                type="text"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredWorkoutPlans.map(plan => (
              <Card key={plan.id} className="bg-gray-100 dark:bg-gray-800">
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-end items-center">
                  <Button variant="secondary" size="sm" onClick={() => setSelectedPlan(plan)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" className="ml-2">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {showTemplateDialog && (
        <WorkoutPlansManager
          open={showTemplateDialog}
          onOpenChange={setShowTemplateDialog}
        />
      )}
    </div>
  );
};

export default WorkoutPlansPage;
