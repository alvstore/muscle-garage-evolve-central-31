
import React, { useState } from 'react';
import { WorkoutPlan, WorkoutDay, Exercise } from '@/types/workout';
import { useAuth } from '@/hooks/use-auth';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Plus, Trash2, ChevronLeft, Save, Dumbbell } from 'lucide-react';

interface WorkoutPlanFormProps {
  existingPlan?: WorkoutPlan;
  onSave: (plan: WorkoutPlan) => void;
  onCancel: () => void;
}

export const WorkoutPlanForm: React.FC<WorkoutPlanFormProps> = ({
  existingPlan,
  onSave,
  onCancel
}) => {
  const { user } = useAuth();
  const isEditing = !!existingPlan;
  
  const [name, setName] = useState(existingPlan?.name || '');
  const [description, setDescription] = useState(existingPlan?.description || '');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>(
    existingPlan?.difficulty || 'beginner'
  );
  const [isGlobal, setIsGlobal] = useState(existingPlan?.isGlobal || false);
  const [targetGoals, setTargetGoals] = useState<string[]>(existingPlan?.targetGoals || []);
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>(existingPlan?.workoutDays || [
    {
      id: `day-${Date.now()}`,
      name: 'Day 1',
      exercises: []
    }
  ]);
  
  const availableGoals = [
    'Strength', 'Muscle Gain', 'Weight Loss', 'Endurance', 
    'Flexibility', 'Cardiovascular Health', 'Core Strength'
  ];
  
  const handleAddWorkoutDay = () => {
    setWorkoutDays([
      ...workoutDays, 
      {
        id: `day-${Date.now()}`,
        name: `Day ${workoutDays.length + 1}`,
        exercises: []
      }
    ]);
  };
  
  const handleRemoveWorkoutDay = (dayId: string) => {
    setWorkoutDays(workoutDays.filter(day => day.id !== dayId));
  };
  
  const handleAddExercise = (dayId: string) => {
    setWorkoutDays(workoutDays.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          exercises: [
            ...day.exercises,
            {
              id: `exercise-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              name: '',
              sets: 3,
              reps: 10
            }
          ]
        };
      }
      return day;
    }));
  };
  
  const handleRemoveExercise = (dayId: string, exerciseId: string) => {
    setWorkoutDays(workoutDays.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          exercises: day.exercises.filter(ex => ex.id !== exerciseId)
        };
      }
      return day;
    }));
  };
  
  const handleUpdateExercise = (dayId: string, exerciseId: string, field: keyof Exercise, value: any) => {
    setWorkoutDays(workoutDays.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          exercises: day.exercises.map(ex => {
            if (ex.id === exerciseId) {
              return {
                ...ex,
                [field]: value
              };
            }
            return ex;
          })
        };
      }
      return day;
    }));
  };
  
  const handleUpdateWorkoutDay = (dayId: string, field: keyof WorkoutDay, value: string) => {
    setWorkoutDays(workoutDays.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          [field]: value
        };
      }
      return day;
    }));
  };
  
  const handleToggleGoal = (goal: string) => {
    if (targetGoals.includes(goal)) {
      setTargetGoals(targetGoals.filter(g => g !== goal));
    } else {
      setTargetGoals([...targetGoals, goal]);
    }
  };
  
  const handleSave = () => {
    // Validate
    if (!name.trim()) {
      alert('Please enter a name for the workout plan');
      return;
    }
    
    if (workoutDays.some(day => !day.name.trim())) {
      alert('All workout days must have a name');
      return;
    }
    
    if (workoutDays.some(day => 
      day.exercises.some(ex => !ex.name.trim() || ex.sets <= 0 || ex.reps <= 0)
    )) {
      alert('All exercises must have a name, sets, and reps');
      return;
    }
    
    const newPlan: WorkoutPlan = {
      id: existingPlan?.id || `plan-${Date.now()}`,
      name,
      description,
      trainerId: user?.id || 'unknown',
      workoutDays,
      targetGoals,
      difficulty,
      isGlobal,
      createdAt: existingPlan?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    onSave(newPlan);
  };
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onCancel} className="mr-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{isEditing ? 'Edit Workout Plan' : 'Create Workout Plan'}</h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Modify the existing workout plan' : 'Create a new workout plan for your members'}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plan Details</CardTitle>
              <CardDescription>Basic information about the workout plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="plan-name">Plan Name *</Label>
                <Input 
                  id="plan-name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g., Full Body Strength" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="plan-description">Description</Label>
                <Textarea 
                  id="plan-description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Describe the workout plan..."
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Difficulty Level *</Label>
                <RadioGroup 
                  value={difficulty} 
                  onValueChange={(value) => setDifficulty(value as 'beginner' | 'intermediate' | 'advanced')}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="beginner" id="beginner" />
                    <Label htmlFor="beginner">Beginner</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intermediate" id="intermediate" />
                    <Label htmlFor="intermediate">Intermediate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="advanced" id="advanced" />
                    <Label htmlFor="advanced">Advanced</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label>Target Goals</Label>
                <div className="grid grid-cols-2 gap-2">
                  {availableGoals.map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`goal-${goal}`} 
                        checked={targetGoals.includes(goal)}
                        onCheckedChange={() => handleToggleGoal(goal)}
                      />
                      <Label htmlFor={`goal-${goal}`}>{goal}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2 pt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="global-plan" 
                    checked={isGlobal}
                    onCheckedChange={(checked) => setIsGlobal(!!checked)}
                  />
                  <Label htmlFor="global-plan">Make this plan available to all trainers</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Workout Days</CardTitle>
                  <CardDescription>Define the exercises for each day of the workout</CardDescription>
                </div>
                <Button onClick={handleAddWorkoutDay} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Day
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={workoutDays[0]?.id}>
                <TabsList className="mb-4 flex flex-wrap">
                  {workoutDays.map((day, index) => (
                    <TabsTrigger key={day.id} value={day.id} className="relative pr-8">
                      Day {index + 1}
                      {workoutDays.length > 1 && (
                        <button
                          className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveWorkoutDay(day.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {workoutDays.map((day) => (
                  <TabsContent key={day.id} value={day.id} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`day-name-${day.id}`}>Day Name *</Label>
                      <Input 
                        id={`day-name-${day.id}`} 
                        value={day.name} 
                        onChange={(e) => handleUpdateWorkoutDay(day.id, 'name', e.target.value)} 
                        placeholder="e.g., Upper Body, Legs Day, etc." 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`day-description-${day.id}`}>Description</Label>
                      <Textarea 
                        id={`day-description-${day.id}`} 
                        value={day.description || ''} 
                        onChange={(e) => handleUpdateWorkoutDay(day.id, 'description', e.target.value)} 
                        placeholder="Describe this workout day..."
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label>Exercises</Label>
                        <Button 
                          onClick={() => handleAddExercise(day.id)} 
                          size="sm" 
                          variant="outline"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Exercise
                        </Button>
                      </div>
                      
                      {day.exercises.length === 0 ? (
                        <div className="text-center py-8 border rounded-md bg-muted/40">
                          <Dumbbell className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No exercises added yet</p>
                          <Button 
                            onClick={() => handleAddExercise(day.id)} 
                            variant="outline" 
                            className="mt-2"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Exercise
                          </Button>
                        </div>
                      ) : (
                        <Accordion type="multiple" className="w-full">
                          {day.exercises.map((exercise, index) => (
                            <AccordionItem key={exercise.id} value={exercise.id}>
                              <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center">
                                  <span className="text-muted-foreground mr-2">{index + 1}.</span>
                                  {exercise.name || 'Unnamed Exercise'}
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="space-y-4 pt-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`exercise-name-${exercise.id}`}>Exercise Name *</Label>
                                    <Input 
                                      id={`exercise-name-${exercise.id}`} 
                                      value={exercise.name} 
                                      onChange={(e) => handleUpdateExercise(day.id, exercise.id, 'name', e.target.value)} 
                                      placeholder="e.g., Bench Press" 
                                    />
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor={`exercise-sets-${exercise.id}`}>Sets *</Label>
                                      <Input 
                                        id={`exercise-sets-${exercise.id}`} 
                                        type="number" 
                                        value={exercise.sets} 
                                        onChange={(e) => handleUpdateExercise(day.id, exercise.id, 'sets', parseInt(e.target.value))} 
                                        min="1"
                                      />
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label htmlFor={`exercise-reps-${exercise.id}`}>Reps *</Label>
                                      <Input 
                                        id={`exercise-reps-${exercise.id}`} 
                                        type="number" 
                                        value={exercise.reps} 
                                        onChange={(e) => handleUpdateExercise(day.id, exercise.id, 'reps', parseInt(e.target.value))} 
                                        min="1"
                                      />
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`exercise-weight-${exercise.id}`}>Weight (optional)</Label>
                                    <Input 
                                      id={`exercise-weight-${exercise.id}`} 
                                      value={exercise.weight || ''} 
                                      onChange={(e) => handleUpdateExercise(day.id, exercise.id, 'weight', e.target.value)} 
                                      placeholder="e.g., 50kg or 'Body Weight'" 
                                    />
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor={`exercise-rest-${exercise.id}`}>Rest Time (optional)</Label>
                                    <Input 
                                      id={`exercise-rest-${exercise.id}`} 
                                      value={exercise.restTime || ''} 
                                      onChange={(e) => handleUpdateExercise(day.id, exercise.id, 'restTime', e.target.value)} 
                                      placeholder="e.g., 60 seconds" 
                                    />
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor={`exercise-notes-${exercise.id}`}>Notes (optional)</Label>
                                  <Textarea 
                                    id={`exercise-notes-${exercise.id}`} 
                                    value={exercise.notes || ''} 
                                    onChange={(e) => handleUpdateExercise(day.id, exercise.id, 'notes', e.target.value)} 
                                    placeholder="Additional instructions for this exercise..." 
                                    rows={2}
                                  />
                                </div>
                                
                                <div className="text-right">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleRemoveExercise(day.id, exercise.id)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Remove Exercise
                                  </Button>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-end mt-6 space-x-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-1" />
          {isEditing ? 'Update Plan' : 'Create Plan'}
        </Button>
      </div>
    </div>
  );
};
