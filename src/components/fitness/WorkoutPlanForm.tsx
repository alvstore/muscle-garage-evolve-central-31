
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Member, WorkoutPlan, WorkoutDay, Exercise } from "@/types";
import { Plus, Trash2, GripVertical, ArrowUp, ArrowDown } from "lucide-react";

interface WorkoutPlanFormProps {
  member: Member;
  trainerId: string;
  existingPlan?: WorkoutPlan;
  onSave: (plan: WorkoutPlan) => void;
  onCancel: () => void;
}

const WorkoutPlanForm = ({ member, trainerId, existingPlan, onSave, onCancel }: WorkoutPlanFormProps) => {
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>(
    existingPlan?.workoutDays || [
      {
        id: uuidv4(),
        name: "Full Body",
        exercises: [
          {
            id: uuidv4(),
            name: "Squat",
            sets: 3,
            reps: 10,
            weight: 0,
            rest: 60,
            notes: "",
          },
        ],
      },
    ]
  );

  const handleSave = () => {
    const plan: WorkoutPlan = {
      id: existingPlan?.id || uuidv4(),
      memberId: member.id,
      trainerId,
      createdAt: existingPlan?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      workoutDays,
    };
    onSave(plan);
  };

  const addWorkoutDay = () => {
    setWorkoutDays([
      ...workoutDays,
      {
        id: uuidv4(),
        name: "New Workout Day",
        exercises: [
          {
            id: uuidv4(),
            name: "Exercise Name",
            sets: 3,
            reps: 10,
            weight: 0,
            rest: 60,
            notes: "",
          },
        ],
      },
    ]);
  };

  const removeWorkoutDay = (dayId: string) => {
    setWorkoutDays(workoutDays.filter((day) => day.id !== dayId));
  };

  const updateWorkoutDay = (dayId: string, field: string, value: string) => {
    setWorkoutDays(
      workoutDays.map((day) => {
        if (day.id === dayId) {
          return { ...day, [field]: value };
        }
        return day;
      })
    );
  };

  const addExercise = (dayId: string) => {
    setWorkoutDays(
      workoutDays.map((day) => {
        if (day.id === dayId) {
          return {
            ...day,
            exercises: [
              ...day.exercises,
              {
                id: uuidv4(),
                name: "New Exercise",
                sets: 3,
                reps: 10,
                weight: 0,
                rest: 60,
                notes: "",
              },
            ],
          };
        }
        return day;
      })
    );
  };

  const removeExercise = (dayId: string, exerciseId: string) => {
    setWorkoutDays(
      workoutDays.map((day) => {
        if (day.id === dayId) {
          return {
            ...day,
            exercises: day.exercises.filter((ex) => ex.id !== exerciseId),
          };
        }
        return day;
      })
    );
  };

  const updateExercise = (dayId: string, exerciseId: string, field: string, value: any) => {
    setWorkoutDays(
      workoutDays.map((day) => {
        if (day.id === dayId) {
          return {
            ...day,
            exercises: day.exercises.map((ex) => {
              if (ex.id === exerciseId) {
                return { ...ex, [field]: value };
              }
              return ex;
            }),
          };
        }
        return day;
      })
    );
  };

  const moveWorkoutDay = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === workoutDays.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const newDays = [...workoutDays];
    [newDays[index], newDays[newIndex]] = [newDays[newIndex], newDays[index]];
    setWorkoutDays(newDays);
  };

  const moveExercise = (dayId: string, index: number, direction: "up" | "down") => {
    setWorkoutDays(
      workoutDays.map((day) => {
        if (day.id === dayId) {
          const exercises = [...day.exercises];
          if (
            (direction === "up" && index === 0) ||
            (direction === "down" && index === exercises.length - 1)
          ) {
            return day;
          }

          const newIndex = direction === "up" ? index - 1 : index + 1;
          [exercises[index], exercises[newIndex]] = [exercises[newIndex], exercises[index]];
          
          return {
            ...day,
            exercises,
          };
        }
        return day;
      })
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{existingPlan ? "Edit" : "Create"} Workout Plan for {member.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {workoutDays.map((day, dayIndex) => (
          <div key={day.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
                <div className="space-y-1 flex-1">
                  <Label htmlFor={`day-${day.id}`}>Day {dayIndex + 1} Name</Label>
                  <Input
                    id={`day-${day.id}`}
                    value={day.name}
                    onChange={(e) => updateWorkoutDay(day.id, "name", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => moveWorkoutDay(dayIndex, "up")}
                  disabled={dayIndex === 0}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => moveWorkoutDay(dayIndex, "down")}
                  disabled={dayIndex === workoutDays.length - 1}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => removeWorkoutDay(day.id)}
                  disabled={workoutDays.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {day.exercises.map((exercise, exIndex) => (
                <div key={exercise.id} className="bg-accent/10 p-3 rounded-md space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Exercise {exIndex + 1}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => moveExercise(day.id, exIndex, "up")}
                        disabled={exIndex === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => moveExercise(day.id, exIndex, "down")}
                        disabled={exIndex === day.exercises.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => removeExercise(day.id, exercise.id)}
                        disabled={day.exercises.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor={`ex-name-${exercise.id}`}>Exercise Name</Label>
                      <Input
                        id={`ex-name-${exercise.id}`}
                        value={exercise.name}
                        onChange={(e) => updateExercise(day.id, exercise.id, "name", e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor={`ex-sets-${exercise.id}`}>Sets</Label>
                        <Input
                          id={`ex-sets-${exercise.id}`}
                          type="number"
                          min="1"
                          value={exercise.sets}
                          onChange={(e) => updateExercise(day.id, exercise.id, "sets", Number(e.target.value))}
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor={`ex-reps-${exercise.id}`}>Reps</Label>
                        <Input
                          id={`ex-reps-${exercise.id}`}
                          type="number"
                          min="1"
                          value={exercise.reps}
                          onChange={(e) => updateExercise(day.id, exercise.id, "reps", Number(e.target.value))}
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor={`ex-weight-${exercise.id}`}>Weight (kg)</Label>
                        <Input
                          id={`ex-weight-${exercise.id}`}
                          type="number"
                          min="0"
                          value={exercise.weight || 0}
                          onChange={(e) => updateExercise(day.id, exercise.id, "weight", Number(e.target.value))}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor={`ex-rest-${exercise.id}`}>Rest (seconds)</Label>
                      <Input
                        id={`ex-rest-${exercise.id}`}
                        type="number"
                        min="0"
                        value={exercise.rest}
                        onChange={(e) => updateExercise(day.id, exercise.id, "rest", Number(e.target.value))}
                      />
                    </div>
                    
                    <div className="space-y-1 md:col-span-2">
                      <Label htmlFor={`ex-notes-${exercise.id}`}>Notes</Label>
                      <Textarea
                        id={`ex-notes-${exercise.id}`}
                        value={exercise.notes || ""}
                        onChange={(e) => updateExercise(day.id, exercise.id, "notes", e.target.value)}
                        className="resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => addExercise(day.id)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Exercise
              </Button>
            </div>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={addWorkoutDay}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Workout Day
        </Button>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSave}>
          Save Workout Plan
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WorkoutPlanForm;
