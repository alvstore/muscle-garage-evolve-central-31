import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash, ArrowLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Member } from "@/types";
import { WorkoutPlan, WorkoutDay, Exercise } from "@/types/index";
import { v4 as uuidv4 } from 'uuid';

interface WorkoutPlanFormProps {
  member: Member;
  existingPlan?: WorkoutPlan;
  trainerId: string;
  onSave: (plan: WorkoutPlan) => void;
  onCancel: () => void;
}

export function WorkoutPlanForm({
  member,
  existingPlan,
  trainerId,
  onSave,
  onCancel
}: WorkoutPlanFormProps) {
  const [formData, setFormData] = useState<Omit<WorkoutPlan, 'id' | 'created_at' | 'updated_at'>>(existingPlan ? {
    name: existingPlan.name,
    description: existingPlan.description || '',
    trainer_id: trainerId,
    member_id: member?.id,
    workout_days: existingPlan.workout_days || [],
    target_goals: existingPlan.target_goals || [],
    is_custom: existingPlan.is_custom || true,
    difficulty: existingPlan.difficulty || 'intermediate'
  } : {
    name: '',
    description: '',
    trainer_id: trainerId,
    member_id: member?.id,
    workout_days: [{
      id: uuidv4(),
      name: 'Day 1',
      description: '',
      workout_plan_id: '', // Will be set when the plan is created
      exercises: [{
        id: uuidv4(),
        name: '',
        sets: 3,
        reps: 10,
        workout_day_id: '' // Will be set when the workout day is created
      }]
    }],
    target_goals: [],
    is_custom: true,
    difficulty: 'intermediate'
  });

  function createEmptyWorkoutDay(): WorkoutDay {
    const id = uuidv4();
    return {
      id: id,
      name: '',
      description: '',
      workout_plan_id: '', // Will be set when saving
      exercises: [createEmptyExercise(id)]
    };
  }

  function createEmptyExercise(dayId: string): Exercise {
    return {
      id: uuidv4(),
      name: '',
      workout_day_id: dayId, // Set to the parent workout day id
      sets: 3,
      reps: 10
    };
  }

  const handleAddWorkoutDay = () => {
    setFormData({
      ...formData,
      workout_days: [...formData.workout_days, createEmptyWorkoutDay()]
    });
  };

  const handleRemoveWorkoutDay = (index: number) => {
    setFormData({
      ...formData,
      workout_days: formData.workout_days.filter((_, i) => i !== index)
    });
  };

  const handleWorkoutDayChange = (index: number, field: keyof WorkoutDay, value: any) => {
    const updatedWorkoutDays = [...formData.workout_days];
    updatedWorkoutDays[index] = {
      ...updatedWorkoutDays[index],
      [field]: value
    };
    setFormData({
      ...formData,
      workout_days: updatedWorkoutDays
    });
  };

  const handleAddExercise = (dayIndex: number) => {
    const updatedWorkoutDays = [...formData.workout_days];
    updatedWorkoutDays[dayIndex] = {
      ...updatedWorkoutDays[dayIndex],
      exercises: [...updatedWorkoutDays[dayIndex].exercises, createEmptyExercise(updatedWorkoutDays[dayIndex].id)]
    };
    setFormData({
      ...formData,
      workout_days: updatedWorkoutDays
    });
  };

  const handleRemoveExercise = (dayIndex: number, exerciseIndex: number) => {
    const updatedWorkoutDays = [...formData.workout_days];
    updatedWorkoutDays[dayIndex] = {
      ...updatedWorkoutDays[dayIndex],
      exercises: updatedWorkoutDays[dayIndex].exercises.filter((_, i) => i !== exerciseIndex)
    };
    setFormData({
      ...formData,
      workout_days: updatedWorkoutDays
    });
  };

  const handleExerciseChange = (dayIndex: number, exerciseIndex: number, field: keyof Exercise, value: any) => {
    const updatedWorkoutDays = [...formData.workout_days];
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
      workout_days: updatedWorkoutDays
    });
  };

  const handleSubmit = () => {
    const finalPlan: WorkoutPlan = {
      id: existingPlan?.id || uuidv4(),
      name: formData.name,
      description: formData.description,
      trainer_id: trainerId,
      workout_days: formData.workout_days,
      target_goals: formData.target_goals,
      difficulty: formData.difficulty,
      is_global: formData.is_global,
      created_at: existingPlan?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      member_id: formData.member_id
    };
    
    onSave(finalPlan);
  };

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
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="plan-name">Plan Name</Label>
            <Input
              id="plan-name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., 12-Week Strength Program"
            />
          </div>
          <div>
            <Label htmlFor="plan-description">Description</Label>
            <Textarea
              id="plan-description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe the workout plan and its goals"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="plan-difficulty">Difficulty Level</Label>
            <Select 
              value={formData.difficulty} 
              onValueChange={(value) => setFormData({...formData, difficulty: value as 'beginner' | 'intermediate' | 'advanced'})}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Workout Days</h3>
            <Button size="sm" onClick={handleAddWorkoutDay}>
              <Plus className="mr-2 h-4 w-4" />
              Add Workout Day
            </Button>
          </div>

          {formData.workout_days.map((day, dayIndex) => (
            <Card key={day.id} className="border border-gray-200">
              <CardHeader className="py-3 px-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="grid grid-cols-1 gap-2 flex-1">
                    <div>
                      <Label htmlFor={`day-name-${dayIndex}`}>Day Name</Label>
                      <Input
                        id={`day-name-${dayIndex}`}
                        placeholder="e.g., Upper Body, Leg Day, etc."
                        value={day.name}
                        onChange={(e) => handleWorkoutDayChange(dayIndex, 'name', e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveWorkoutDay(dayIndex)}
                    className="ml-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`day-description-${dayIndex}`}>Description</Label>
                    <Textarea
                      id={`day-description-${dayIndex}`}
                      placeholder="Details about this workout day"
                      value={day.description || ''}
                      onChange={(e) => handleWorkoutDayChange(dayIndex, 'description', e.target.value)}
                      rows={2}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Exercises</Label>
                      <Button size="sm" variant="outline" onClick={() => handleAddExercise(dayIndex)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Exercise
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {day.exercises.map((exercise, exerciseIndex) => (
                        <div key={exercise.id} className="grid grid-cols-1 gap-2 p-3 border rounded-md">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <Label htmlFor={`exercise-name-${dayIndex}-${exerciseIndex}`}>Exercise Name</Label>
                              <Input
                                id={`exercise-name-${dayIndex}-${exerciseIndex}`}
                                placeholder="e.g., Bench Press, Squat, etc."
                                value={exercise.name}
                                onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, 'name', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveExercise(dayIndex, exerciseIndex)}
                              className="ml-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>
                              <Label htmlFor={`exercise-sets-${dayIndex}-${exerciseIndex}`}>Sets</Label>
                              <Input
                                id={`exercise-sets-${dayIndex}-${exerciseIndex}`}
                                type="number"
                                min="1"
                                value={exercise.sets}
                                onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, 'sets', parseInt(e.target.value))}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`exercise-reps-${dayIndex}-${exerciseIndex}`}>Reps</Label>
                              <Input
                                id={`exercise-reps-${dayIndex}-${exerciseIndex}`}
                                type="number"
                                min="1"
                                value={exercise.reps}
                                onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, 'reps', parseInt(e.target.value))}
                                className="mt-1"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>
                              <Label htmlFor={`exercise-weight-${dayIndex}-${exerciseIndex}`}>Weight (optional)</Label>
                              <Input
                                id={`exercise-weight-${dayIndex}-${exerciseIndex}`}
                                placeholder="e.g., 50kg, Body weight"
                                value={exercise.weight || ''}
                                onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, 'weight', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`exercise-rest-${dayIndex}-${exerciseIndex}`}>Rest Time (optional)</Label>
                              <Input
                                id={`exercise-rest-${dayIndex}-${exerciseIndex}`}
                                placeholder="e.g., 60 seconds"
                                value={exercise.rest || ''}
                                onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, 'rest', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <Label htmlFor={`exercise-notes-${dayIndex}-${exerciseIndex}`}>Notes (optional)</Label>
                            <Textarea
                              id={`exercise-notes-${dayIndex}-${exerciseIndex}`}
                              placeholder="Additional instructions or tips"
                              value={exercise.notes || ''}
                              onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, 'notes', e.target.value)}
                              rows={2}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="workout-plan-global"
            checked={formData.is_global}
            onChange={(e) => setFormData({...formData, is_global: e.target.checked})}
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <Label htmlFor="workout-plan-global" className="cursor-pointer">
            Make this a global template (available to all trainers)
          </Label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={!formData.name}>
          {existingPlan ? 'Update Plan' : 'Create Plan'}
        </Button>
      </CardFooter>
    </Card>
  );
}
