import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash, ArrowLeft, Move } from "lucide-react";
import { Member, WorkoutPlan, WorkoutDay, Exercise } from "@/types";
import { v4 as uuidv4 } from 'uuid';

interface WorkoutPlanFormProps {
  member: Member;
  existingPlan?: WorkoutPlan;
  trainerId: string;
  onSave: (plan: WorkoutPlan) => void;
  onCancel: () => void;
}

const WorkoutPlanForm: React.FC<WorkoutPlanFormProps> = ({
  member,
  existingPlan,
  trainerId,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<Omit<WorkoutPlan, 'id' | 'createdAt' | 'updatedAt'>>({
    memberId: member.id,
    trainerId: trainerId,
    workoutDays: existingPlan?.workoutDays || [createEmptyWorkoutDay(1)],
    notes: existingPlan?.notes || '',
    isCustom: existingPlan?.isCustom || false
  });

  function createEmptyWorkoutDay(dayNumber: number): WorkoutDay {
    return {
      id: uuidv4(),
      name: `Day ${dayNumber}`,
      exercises: [],
      notes: ''
    };
  }

  function createEmptyExercise(): Exercise {
    return {
      id: uuidv4(),
      name: '',
      sets: 3,
      reps: 10,
      weight: 0,
      rest: 60,
      notes: '',
      muscleGroupTag: ''
    };
  }

  const handleAddWorkoutDay = () => {
    setFormData({
      ...formData,
      workoutDays: [...formData.workoutDays, createEmptyWorkoutDay(formData.workoutDays.length + 1)]
    });
  };

  const handleRemoveWorkoutDay = (index: number) => {
    setFormData({
      ...formData,
      workoutDays: formData.workoutDays.filter((_, i) => i !== index)
    });
  };

  const handleWorkoutDayChange = (index: number, field: keyof WorkoutDay, value: any) => {
    const updatedWorkoutDays = [...formData.workoutDays];
    updatedWorkoutDays[index] = {
      ...updatedWorkoutDays[index],
      [field]: value
    };
    setFormData({
      ...formData,
      workoutDays: updatedWorkoutDays
    });
  };

  const handleAddExercise = (dayIndex: number) => {
    const updatedWorkoutDays = [...formData.workoutDays];
    updatedWorkoutDays[dayIndex] = {
      ...updatedWorkoutDays[dayIndex],
      exercises: [...updatedWorkoutDays[dayIndex].exercises, createEmptyExercise()]
    };
    setFormData({
      ...formData,
      workoutDays: updatedWorkoutDays
    });
  };

  const handleRemoveExercise = (dayIndex: number, exerciseIndex: number) => {
    const updatedWorkoutDays = [...formData.workoutDays];
    updatedWorkoutDays[dayIndex] = {
      ...updatedWorkoutDays[dayIndex],
      exercises: updatedWorkoutDays[dayIndex].exercises.filter((_, i) => i !== exerciseIndex)
    };
    setFormData({
      ...formData,
      workoutDays: updatedWorkoutDays
    });
  };

  const handleExerciseChange = (dayIndex: number, exerciseIndex: number, field: keyof Exercise, value: any) => {
    const updatedWorkoutDays = [...formData.workoutDays];
    const updatedExercises = [...updatedWorkoutDays[dayIndex].exercises];
    updatedExercises[exerciseIndex] = {
      ...updatedExercises[exerciseIndex],
      [field]: value
    };
    updatedWorkoutDays[dayIndex] = {
      ...updatedWorkoutDays[dayIndex],
      exercises: updatedExercises
    };
    setFormData({
      ...formData,
      workoutDays: updatedWorkoutDays
    });
  };

  const handleSubmit = () => {
    const finalPlan: WorkoutPlan = {
      id: existingPlan?.id || uuidv4(),
      memberId: member.id,
      trainerId,
      workoutDays: formData.workoutDays,
      notes: formData.notes,
      isCustom: formData.isCustom,
      createdAt: existingPlan?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    onSave(finalPlan);
  };

  const muscleGroups = [
    'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 
    'Legs', 'Glutes', 'Hamstrings', 'Quadriceps', 'Calves', 
    'Abs', 'Core', 'Forearms', 'Full Body', 'Cardio'
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{existingPlan ? 'Edit Workout Plan' : 'Create New Workout Plan'}</CardTitle>
            <CardDescription>
              {existingPlan 
                ? `Modify workout plan for ${member.name}` 
                : `Create a new workout plan for ${member.name}`}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Workout Days</h3>
            <Button size="sm" onClick={handleAddWorkoutDay}>
              <Plus className="mr-2 h-4 w-4" />
              Add Day
            </Button>
          </div>

          {formData.workoutDays.map((day, dayIndex) => (
            <Card key={day.id} className="border border-gray-200">
              <CardHeader className="py-3 px-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <Input
                      placeholder="Day Name"
                      value={day.name}
                      onChange={(e) => handleWorkoutDayChange(dayIndex, 'name', e.target.value)}
                      className="font-medium"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveWorkoutDay(dayIndex)}
                    className="ml-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    disabled={formData.workoutDays.length <= 1}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <Label>Exercises</Label>
                    <div className="space-y-3 mt-2">
                      {day.exercises.map((exercise, exerciseIndex) => (
                        <div key={exercise.id} className="border rounded-md p-3 bg-gray-50">
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-medium flex items-center">
                              <Move className="h-4 w-4 mr-2 text-gray-400" />
                              <span>Exercise {exerciseIndex + 1}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveExercise(dayIndex, exerciseIndex)}
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="grid gap-3">
                            <div>
                              <Label htmlFor={`exercise-name-${dayIndex}-${exerciseIndex}`} className="text-xs">Exercise Name</Label>
                              <Input
                                id={`exercise-name-${dayIndex}-${exerciseIndex}`}
                                placeholder="e.g., Bench Press, Squats, etc."
                                value={exercise.name}
                                onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, 'name', e.target.value)}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              <div>
                                <Label htmlFor={`exercise-sets-${dayIndex}-${exerciseIndex}`} className="text-xs">Sets</Label>
                                <Input
                                  id={`exercise-sets-${dayIndex}-${exerciseIndex}`}
                                  type="number"
                                  value={exercise.sets}
                                  onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, 'sets', Number(e.target.value))}
                                  min="1"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`exercise-reps-${dayIndex}-${exerciseIndex}`} className="text-xs">Reps</Label>
                                <Input
                                  id={`exercise-reps-${dayIndex}-${exerciseIndex}`}
                                  type="number"
                                  value={exercise.reps}
                                  onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, 'reps', Number(e.target.value))}
                                  min="1"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`exercise-weight-${dayIndex}-${exerciseIndex}`} className="text-xs">Weight (kg)</Label>
                                <Input
                                  id={`exercise-weight-${dayIndex}-${exerciseIndex}`}
                                  type="number"
                                  value={exercise.weight}
                                  onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, 'weight', Number(e.target.value))}
                                  min="0"
                                  step="0.5"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`exercise-rest-${dayIndex}-${exerciseIndex}`} className="text-xs">Rest (sec)</Label>
                                <Input
                                  id={`exercise-rest-${dayIndex}-${exerciseIndex}`}
                                  type="number"
                                  value={exercise.rest}
                                  onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, 'rest', Number(e.target.value))}
                                  min="0"
                                  step="5"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <Label htmlFor={`exercise-muscle-${dayIndex}-${exerciseIndex}`} className="text-xs">Muscle Group</Label>
                              <Select
                                value={exercise.muscleGroupTag || ''}
                                onValueChange={(value) => handleExerciseChange(dayIndex, exerciseIndex, 'muscleGroupTag', value)}
                              >
                                <SelectTrigger id={`exercise-muscle-${dayIndex}-${exerciseIndex}`}>
                                  <SelectValue placeholder="Select muscle group" />
                                </SelectTrigger>
                                <SelectContent>
                                  {muscleGroups.map(group => (
                                    <SelectItem key={group} value={group}>
                                      {group}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label htmlFor={`exercise-notes-${dayIndex}-${exerciseIndex}`} className="text-xs">Notes</Label>
                              <Textarea
                                id={`exercise-notes-${dayIndex}-${exerciseIndex}`}
                                placeholder="Additional instructions, form tips, etc."
                                value={exercise.notes || ''}
                                onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, 'notes', e.target.value)}
                                rows={2}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {day.exercises.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground border rounded-md mt-2">
                        No exercises added yet
                      </div>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddExercise(dayIndex)}
                      className="mt-3 w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Exercise
                    </Button>
                  </div>
                  
                  <div>
                    <Label htmlFor={`day-notes-${dayIndex}`}>Day Notes (optional)</Label>
                    <Textarea
                      id={`day-notes-${dayIndex}`}
                      placeholder="Additional instructions for this day..."
                      value={day.notes || ''}
                      onChange={(e) => handleWorkoutDayChange(dayIndex, 'notes', e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="workout-notes">Additional Notes</Label>
          <Textarea
            id="workout-notes"
            placeholder="Add any instructions, progressions, or guidelines..."
            value={formData.notes || ''}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            rows={4}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="workout-plan-custom"
            checked={formData.isCustom}
            onChange={(e) => setFormData({...formData, isCustom: e.target.checked})}
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <Label htmlFor="workout-plan-custom" className="cursor-pointer">
            This is a custom plan specific for this member
          </Label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>
          {existingPlan ? 'Update Plan' : 'Create Plan'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WorkoutPlanForm;
