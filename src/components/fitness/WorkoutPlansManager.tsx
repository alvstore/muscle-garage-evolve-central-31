import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { WorkoutPlan, WorkoutDay, Exercise, Member } from "@/types";
import { Pencil, Plus, Save, Trash, X } from "lucide-react";
import { toast } from "sonner";

interface WorkoutPlansManagerProps {
  selectedMember: Member | null;
  onSave: (plan: WorkoutPlan) => void;
  onCancel: () => void;
}

const WorkoutPlansManager = ({ selectedMember, onSave, onCancel }: WorkoutPlansManagerProps) => {
  const [planName, setPlanName] = useState("");
  const [planDescription, setPlanDescription] = useState("");
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseSets, setExerciseSets] = useState(3);
  const [exerciseReps, setExerciseReps] = useState(10);
  const [exerciseWeight, setExerciseWeight] = useState<number | undefined>(undefined);
  const [exerciseRest, setExerciseRest] = useState(60);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    if (selectedMember) {
      setPlanName(`${selectedMember.name}'s Custom Plan`);
      setPlanDescription(`Custom workout plan for ${selectedMember.name}`);
    }
  }, [selectedMember]);

  const resetForm = () => {
    setPlanName("");
    setPlanDescription("");
    setWorkoutDays([]);
    setSelectedDay(null);
    setExerciseName("");
    setExerciseSets(3);
    setExerciseReps(10);
    setExerciseWeight(undefined);
    setExerciseRest(60);
    setIsEditDialogOpen(false);
    setEditingExercise(null);
  };

  const handleAddDay = () => {
    const newDay: WorkoutDay = {
      id: `day-${Date.now()}`,
      name: `Day ${workoutDays.length + 1}`,
      dayLabel: "",
      exercises: []
    };
    setWorkoutDays([...workoutDays, newDay]);
  };

  const handleDayNameChange = (dayId: string, newName: string) => {
    setWorkoutDays(prevDays =>
      prevDays.map(day =>
        day.id === dayId ? { ...day, name: newName } : day
      )
    );
  };

  const handleRemoveDay = (dayId: string) => {
    setWorkoutDays(prevDays => prevDays.filter(day => day.id !== dayId));
    if (selectedDay === dayId) {
      setSelectedDay(null);
    }
  };

  const handleSelectDay = (dayId: string) => {
    setSelectedDay(dayId);
  };

  const handleAddExercise = () => {
    if (!exerciseName.trim()) {
      toast.error("Please enter an exercise name");
      return;
    }

    const newExercise: Exercise = {
      id: `ex-${Date.now()}`,
      name: exerciseName,
      sets: exerciseSets,
      reps: exerciseReps,
      weight: exerciseWeight,
      rest: exerciseRest
    };

    setWorkoutDays(prevDays =>
      prevDays.map(day =>
        day.id === selectedDay ? { ...day, exercises: [...day.exercises, newExercise] } : day
      )
    );

    setExerciseName("");
    setExerciseSets(3);
    setExerciseReps(10);
    setExerciseWeight(undefined);
    setExerciseRest(60);
  };

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setExerciseName(exercise.name);
    setExerciseSets(exercise.sets);
    setExerciseReps(exercise.reps);
    setExerciseWeight(exercise.weight);
    setExerciseRest(exercise.rest);
    setIsEditDialogOpen(true);
  };

  const handleUpdateExercise = () => {
    if (!editingExercise) return;

    const updatedExercise: Exercise = {
      ...editingExercise,
      name: exerciseName,
      sets: exerciseSets,
      reps: exerciseReps,
      weight: exerciseWeight,
      rest: exerciseRest
    };

    setWorkoutDays(prevDays =>
      prevDays.map(day =>
        day.id === selectedDay
          ? {
              ...day,
              exercises: day.exercises.map(ex =>
                ex.id === editingExercise.id ? updatedExercise : ex
              )
            }
          : day
      )
    );

    setIsEditDialogOpen(false);
    setEditingExercise(null);
    setExerciseName("");
    setExerciseSets(3);
    setExerciseReps(10);
    setExerciseWeight(undefined);
    setExerciseRest(60);
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setWorkoutDays(prevDays =>
      prevDays.map(day =>
        day.id === selectedDay
          ? { ...day, exercises: day.exercises.filter(ex => ex.id !== exerciseId) }
          : day
      )
    );
  };

  const handleSavePlan = () => {
    if (!planName.trim()) {
      toast.error("Please enter a plan name");
      return;
    }

    if (workoutDays.length === 0) {
      toast.error("Please add at least one workout day");
      return;
    }

    const plan: Omit<WorkoutPlan, "id" | "createdAt" | "updatedAt"> = {
      name: planName,
      description: planDescription,
      memberId: selectedMember ? selectedMember.id : "",
      trainerId: "trainer-123", // This would come from the current user context
      isCustom: !!selectedMember,
      workoutDays: workoutDays,
      createdBy: "Current User", // This would come from the auth context
    };

    onSave(plan);
    resetForm();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Workout Plan</CardTitle>
        <CardDescription>
          {selectedMember
            ? `Create a custom workout plan for ${selectedMember.name}`
            : "Create a general workout plan"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Plan Name"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
          />
        </div>
        <div>
          <Input
            type="text"
            placeholder="Plan Description"
            value={planDescription}
            onChange={(e) => setPlanDescription(e.target.value)}
          />
        </div>

        <Tabs defaultValue={selectedDay || "no-day"}>
          <TabsList>
            {workoutDays.map((day) => (
              <TabsTrigger
                key={day.id}
                value={day.id}
                onClick={() => handleSelectDay(day.id)}
                className={selectedDay === day.id ? "bg-secondary text-secondary-foreground" : ""}
              >
                {day.name}
                <Button variant="ghost" size="icon" onClick={() => handleRemoveDay(day.id)} className="ml-2">
                  <X className="h-4 w-4" />
                </Button>
              </TabsTrigger>
            ))}
            <Button onClick={handleAddDay} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Day
            </Button>
          </TabsList>
          <div className="mt-4">
            {workoutDays.length === 0 ? (
              <p className="text-muted-foreground">No workout days added yet.</p>
            ) : selectedDay ? (
              <TabsContent value={selectedDay} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Day Name"
                  value={workoutDays.find(day => day.id === selectedDay)?.name || ""}
                  onChange={(e) => handleDayNameChange(selectedDay, e.target.value)}
                />
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Exercises:</h4>
                  {workoutDays.find(day => day.id === selectedDay)?.exercises.map((exercise) => (
                    <div key={exercise.id} className="flex items-center justify-between p-2 border rounded-md">
                      <span>{exercise.name} ({exercise.sets} sets x {exercise.reps} reps)</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditExercise(exercise)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveExercise(exercise.id)} className="text-destructive">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="Exercise Name"
                      value={exerciseName}
                      onChange={(e) => setExerciseName(e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Sets"
                        value={exerciseSets}
                        onChange={(e) => setExerciseSets(Number(e.target.value))}
                      />
                      <Input
                        type="number"
                        placeholder="Reps"
                        value={exerciseReps}
                        onChange={(e) => setExerciseReps(Number(e.target.value))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Weight (kg)"
                        value={exerciseWeight || ""}
                        onChange={(e) => setExerciseWeight(e.target.value === "" ? undefined : Number(e.target.value))}
                      />
                      <Input
                        type="number"
                        placeholder="Rest (seconds)"
                        value={exerciseRest}
                        onChange={(e) => setExerciseRest(Number(e.target.value))}
                      />
                    </div>
                    <Button onClick={handleAddExercise} variant="secondary" size="sm">
                      Add Exercise
                    </Button>
                  </div>
                </div>
              </TabsContent>
            ) : (
              <p className="text-muted-foreground">Select a workout day to add exercises.</p>
            )}
          </div>
        </Tabs>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSavePlan}>
            <Save className="h-4 w-4 mr-2" />
            Save Plan
          </Button>
        </div>
      </CardContent>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Exercise</DialogTitle>
            <DialogDescription>
              Update the details for this exercise.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name">Exercise Name</label>
              <Input
                id="name"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                placeholder="e.g., Bench Press"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <label htmlFor="sets">Sets</label>
                <Input
                  id="sets"
                  type="number"
                  value={exerciseSets}
                  onChange={(e) => setExerciseSets(Number(e.target.value))}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="reps">Reps</label>
                <Input
                  id="reps"
                  type="number"
                  value={exerciseReps}
                  onChange={(e) => setExerciseReps(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <label htmlFor="weight">Weight (kg)</label>
                <Input
                  id="weight"
                  type="number"
                  value={exerciseWeight || ""}
                  onChange={(e) => setExerciseWeight(e.target.value === "" ? undefined : Number(e.target.value))}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="rest">Rest (seconds)</label>
                <Input
                  id="rest"
                  type="number"
                  value={exerciseRest}
                  onChange={(e) => setExerciseRest(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateExercise}>
              Update Exercise
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default WorkoutPlansManager;
