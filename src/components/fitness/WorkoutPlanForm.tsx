
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Member, WorkoutPlan, Exercise, WorkoutDay } from "@/types";
import { toast } from "sonner";

interface WorkoutPlanFormProps {
  member: Member;
  trainerId: string;
  existingPlan?: WorkoutPlan;
  onSave: (plan: WorkoutPlan) => void;
  onCancel: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const WorkoutPlanForm = ({ member, trainerId, existingPlan, onSave, onCancel }: WorkoutPlanFormProps) => {
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>(
    existingPlan?.workoutDays || [
      {
        id: generateId(),
        name: "Day 1: Full Body",
        exercises: [
          {
            id: generateId(),
            name: "Squats",
            sets: 3,
            reps: 10,
            weight: 0,
            rest: 60,
            notes: ""
          }
        ]
      }
    ]
  );

  const addWorkoutDay = () => {
    setWorkoutDays([
      ...workoutDays,
      {
        id: generateId(),
        name: `Day ${workoutDays.length + 1}`,
        exercises: []
      }
    ]);
  };

  const removeWorkoutDay = (dayId: string) => {
    setWorkoutDays(workoutDays.filter(day => day.id !== dayId));
  };

  const updateDayName = (dayId: string, name: string) => {
    setWorkoutDays(
      workoutDays.map(day => 
        day.id === dayId ? { ...day, name } : day
      )
    );
  };

  const addExercise = (dayId: string) => {
    setWorkoutDays(
      workoutDays.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            exercises: [
              ...day.exercises,
              {
                id: generateId(),
                name: "",
                sets: 3,
                reps: 10,
                weight: 0,
                rest: 60,
                notes: ""
              }
            ]
          };
        }
        return day;
      })
    );
  };

  const removeExercise = (dayId: string, exerciseId: string) => {
    setWorkoutDays(
      workoutDays.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            exercises: day.exercises.filter(ex => ex.id !== exerciseId)
          };
        }
        return day;
      })
    );
  };

  const updateExercise = (dayId: string, exerciseId: string, field: keyof Exercise, value: any) => {
    setWorkoutDays(
      workoutDays.map(day => {
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
      })
    );
  };

  const handleSave = () => {
    // Validate if there are any empty fields
    const hasEmptyFields = workoutDays.some(day => 
      day.name.trim() === "" || day.exercises.some(ex => ex.name.trim() === "")
    );

    if (hasEmptyFields) {
      toast.error("Please fill in all exercise names and day names");
      return;
    }

    // Create workout plan object
    const workoutPlan: WorkoutPlan = {
      id: existingPlan?.id || generateId(),
      memberId: member.id,
      trainerId: trainerId,
      createdAt: existingPlan?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      workoutDays: workoutDays
    };

    onSave(workoutPlan);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {existingPlan ? "Edit Workout Plan" : "Create Workout Plan"}
          </h2>
          <p className="text-sm text-muted-foreground">
            For: {member.name}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Plan
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {workoutDays.map((day, dayIndex) => (
          <Card key={day.id} className="overflow-hidden">
            <CardHeader className="bg-muted/50 py-3">
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <Input
                    placeholder="Day Name (e.g. Push Day, Legs, Upper Body, etc.)"
                    value={day.name}
                    onChange={(e) => updateDayName(day.id, e.target.value)}
                    className="font-medium"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeWorkoutDay(day.id)}
                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {day.exercises.length === 0 ? (
                <div className="text-center py-6 border border-dashed rounded-md">
                  <p className="text-muted-foreground mb-2">No exercises added yet</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => addExercise(day.id)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Exercise
                  </Button>
                </div>
              ) : (
                <>
                  {day.exercises.map((exercise, exIndex) => (
                    <div 
                      key={exercise.id}
                      className="border rounded-md p-4 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Exercise {exIndex + 1}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExercise(day.id, exercise.id)}
                          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid gap-4">
                        <div>
                          <Label htmlFor={`ex-name-${exercise.id}`}>Exercise Name</Label>
                          <Input
                            id={`ex-name-${exercise.id}`}
                            placeholder="Exercise Name"
                            value={exercise.name}
                            onChange={(e) => updateExercise(day.id, exercise.id, "name", e.target.value)}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`ex-sets-${exercise.id}`}>Sets</Label>
                            <Input
                              id={`ex-sets-${exercise.id}`}
                              type="number"
                              min="1"
                              value={exercise.sets}
                              onChange={(e) => updateExercise(day.id, exercise.id, "sets", parseInt(e.target.value))}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`ex-reps-${exercise.id}`}>Reps</Label>
                            <Input
                              id={`ex-reps-${exercise.id}`}
                              type="number"
                              min="1"
                              value={exercise.reps}
                              onChange={(e) => updateExercise(day.id, exercise.id, "reps", parseInt(e.target.value))}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`ex-weight-${exercise.id}`}>Weight (kg)</Label>
                            <Input
                              id={`ex-weight-${exercise.id}`}
                              type="number"
                              min="0"
                              step="0.5"
                              value={exercise.weight || 0}
                              onChange={(e) => updateExercise(day.id, exercise.id, "weight", parseFloat(e.target.value))}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`ex-rest-${exercise.id}`}>Rest (seconds)</Label>
                            <Input
                              id={`ex-rest-${exercise.id}`}
                              type="number"
                              min="0"
                              step="5"
                              value={exercise.rest}
                              onChange={(e) => updateExercise(day.id, exercise.id, "rest", parseInt(e.target.value))}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor={`ex-notes-${exercise.id}`}>Notes</Label>
                          <Textarea
                            id={`ex-notes-${exercise.id}`}
                            placeholder="Additional instructions or notes"
                            value={exercise.notes || ""}
                            onChange={(e) => updateExercise(day.id, exercise.id, "notes", e.target.value)}
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    onClick={() => addExercise(day.id)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Another Exercise
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ))}
        
        <Button 
          variant="outline" 
          onClick={addWorkoutDay}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Another Day
        </Button>
      </div>
    </div>
  );
};

export default WorkoutPlanForm;
