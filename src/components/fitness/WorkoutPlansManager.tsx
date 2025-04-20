import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { WorkoutPlan, WorkoutDay, Exercise, MemberWorkout } from "@/types/class";
import { Member, Trainer } from "@/types";
import { workoutService } from "@/services/workoutService";
import { trainerService } from "@/services/trainerService";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Copy, Dumbbell, Users, Check, X } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
interface WorkoutPlansManagerProps {
  members?: Member[];
  trainerId?: string;
  forMemberId?: string;
}
const WorkoutPlansManager: React.FC<WorkoutPlansManagerProps> = ({
  members = [],
  trainerId,
  forMemberId
}) => {
  const {
    user
  } = useAuth();
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string>(forMemberId || "");
  const [memberWorkouts, setMemberWorkouts] = useState<MemberWorkout[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);

  // Form state for creating/editing workout plans
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    isCommon: boolean;
    days: WorkoutDay[];
  }>({
    name: "",
    description: "",
    isCommon: true,
    days: []
  });

  // Load workout plans
  useEffect(() => {
    const fetchWorkoutPlans = async () => {
      const plans = await workoutService.getWorkoutPlans();
      setWorkoutPlans(plans);
    };
    const fetchTrainers = async () => {
      const trainersList = await trainerService.getTrainers();
      setTrainers(trainersList);
    };
    fetchWorkoutPlans();
    fetchTrainers();
  }, []);

  // Load member workouts if a member is selected
  useEffect(() => {
    if (selectedMemberId) {
      const fetchMemberWorkouts = async () => {
        const workouts = await workoutService.getMemberWorkouts(selectedMemberId);
        setMemberWorkouts(workouts);
      };
      fetchMemberWorkouts();
    } else {
      setMemberWorkouts([]);
    }
  }, [selectedMemberId]);

  // Initialize form data when editing
  useEffect(() => {
    if (selectedPlan && isEditing) {
      setFormData({
        name: selectedPlan.name,
        description: selectedPlan.description,
        isCommon: selectedPlan.isCommon,
        days: [...selectedPlan.days]
      });
    }
  }, [selectedPlan, isEditing]);
  const handleCreatePlan = () => {
    setIsCreating(true);
    setFormData({
      name: "",
      description: "",
      isCommon: true,
      days: [createNewDay()]
    });
  };
  const handleEditPlan = (plan: WorkoutPlan) => {
    setSelectedPlan(plan);
    setIsEditing(true);
  };
  const handleDeletePlan = async (planId: string) => {
    if (window.confirm("Are you sure you want to delete this workout plan?")) {
      const success = await workoutService.deleteWorkoutPlan(planId);
      if (success) {
        setWorkoutPlans(prev => prev.filter(p => p.id !== planId));
      }
    }
  };
  const handleAssignPlan = (plan: WorkoutPlan) => {
    setSelectedPlan(plan);
    setIsAssigning(true);
  };
  const createNewDay = (): WorkoutDay => ({
    id: uuidv4(),
    dayLabel: `Day ${formData.days.length + 1}`,
    exercises: []
  });
  const createNewExercise = (): Exercise => ({
    id: uuidv4(),
    name: "",
    sets: 3,
    reps: 10,
    weight: 0,
    rest: 60,
    notes: "",
    muscleGroupTag: ""
  });
  const handleAddDay = () => {
    setFormData(prev => ({
      ...prev,
      days: [...prev.days, createNewDay()]
    }));
  };
  const handleRemoveDay = (dayId: string) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.filter(day => day.id !== dayId)
    }));
  };
  const handleDayChange = (dayId: string, field: keyof WorkoutDay, value: any) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.map(day => day.id === dayId ? {
        ...day,
        [field]: value
      } : day)
    }));
  };
  const handleAddExercise = (dayId: string) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.map(day => day.id === dayId ? {
        ...day,
        exercises: [...day.exercises, createNewExercise()]
      } : day)
    }));
  };
  const handleRemoveExercise = (dayId: string, exerciseId: string) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.map(day => day.id === dayId ? {
        ...day,
        exercises: day.exercises.filter(ex => ex.id !== exerciseId)
      } : day)
    }));
  };
  const handleExerciseChange = (dayId: string, exerciseId: string, field: keyof Exercise, value: any) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.map(day => day.id === dayId ? {
        ...day,
        exercises: day.exercises.map(ex => ex.id === exerciseId ? {
          ...ex,
          [field]: value
        } : ex)
      } : day)
    }));
  };
  const handleSubmitPlan = async () => {
    if (!formData.name.trim()) {
      toast.error("Please enter a name for the workout plan");
      return;
    }
    if (formData.days.length === 0) {
      toast.error("Please add at least one day to the workout plan");
      return;
    }

    // Validate that all days have exercises
    for (const day of formData.days) {
      if (day.exercises.length === 0) {
        toast.error(`Please add at least one exercise to ${day.dayLabel}`);
        return;
      }

      // Validate that all exercises have names
      for (const exercise of day.exercises) {
        if (!exercise.name.trim()) {
          toast.error(`Please enter a name for all exercises in ${day.dayLabel}`);
          return;
        }
      }
    }
    const planData = {
      ...formData,
      createdBy: user?.id || ""
    };
    if (isEditing && selectedPlan) {
      const updatedPlan = await workoutService.updateWorkoutPlan(selectedPlan.id, planData);
      if (updatedPlan) {
        setWorkoutPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
        setIsEditing(false);
        setSelectedPlan(null);
      }
    } else {
      const newPlan = await workoutService.createWorkoutPlan(planData);
      if (newPlan) {
        setWorkoutPlans(prev => [...prev, newPlan]);
        setIsCreating(false);
      }
    }
  };
  const handleAssignSubmit = async () => {
    if (!selectedPlan || !selectedMemberId) {
      toast.error("Please select both a plan and a member");
      return;
    }
    const memberWorkout: Omit<MemberWorkout, 'id' | 'assignedAt'> = {
      memberId: selectedMemberId,
      workoutPlanId: selectedPlan.id,
      isCustom: false,
      assignedBy: user?.id || ""
    };
    const result = await workoutService.assignWorkoutPlan(memberWorkout);
    if (result) {
      toast.success(`Plan assigned to member successfully`);
      setIsAssigning(false);
      setSelectedPlan(null);
    }
  };
  const getTrainerName = (trainerId: string) => {
    const trainer = trainers.find(t => t.id === trainerId);
    return trainer ? trainer.name : 'Unknown Trainer';
  };
  const renderPlanForm = () => <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="planName">Plan Name</Label>
          <Input id="planName" value={formData.name} onChange={e => setFormData(prev => ({
          ...prev,
          name: e.target.value
        }))} placeholder="e.g., Beginner Strength Training" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="planDescription">Description</Label>
          <Textarea id="planDescription" value={formData.description} onChange={e => setFormData(prev => ({
          ...prev,
          description: e.target.value
        }))} placeholder="Describe the workout plan and its goals" rows={3} />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="planType">Plan Type</Label>
          <Select value={formData.isCommon ? "common" : "private"} onValueChange={value => setFormData(prev => ({
          ...prev,
          isCommon: value === "common"
        }))}>
            <SelectTrigger id="planType">
              <SelectValue placeholder="Select plan type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="common">Common (available to all trainers)</SelectItem>
              <SelectItem value="private">Private (only visible to you)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4 mt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Workout Days</h3>
          <Button size="sm" onClick={handleAddDay}>
            <Plus className="w-4 h-4 mr-1" /> Add Day
          </Button>
        </div>

        {formData.days.map((day, dayIndex) => <Card key={day.id} className="overflow-hidden">
            <CardHeader className="bg-muted/50 py-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Input value={day.dayLabel} onChange={e => handleDayChange(day.id, 'dayLabel', e.target.value)} placeholder="Day Label" className="font-medium" />
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleRemoveDay(day.id)} className="ml-2 text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {day.exercises.length > 0 ? <div className="space-y-3">
                    {day.exercises.map((exercise, exIndex) => <div key={exercise.id} className="grid grid-cols-12 gap-2 items-center border-b pb-3">
                        <div className="col-span-4">
                          <Label htmlFor={`ex-name-${exercise.id}`} className="sr-only">Exercise Name</Label>
                          <Input id={`ex-name-${exercise.id}`} value={exercise.name} onChange={e => handleExerciseChange(day.id, exercise.id, 'name', e.target.value)} placeholder="Exercise name" />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor={`ex-sets-${exercise.id}`} className="sr-only">Sets</Label>
                          <Input id={`ex-sets-${exercise.id}`} type="number" value={exercise.sets} onChange={e => handleExerciseChange(day.id, exercise.id, 'sets', parseInt(e.target.value) || 0)} placeholder="Sets" />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor={`ex-reps-${exercise.id}`} className="sr-only">Reps</Label>
                          <Input id={`ex-reps-${exercise.id}`} type="number" value={exercise.reps} onChange={e => handleExerciseChange(day.id, exercise.id, 'reps', parseInt(e.target.value) || 0)} placeholder="Reps" />
                        </div>
                        <div className="col-span-3">
                          <Label htmlFor={`ex-muscle-${exercise.id}`} className="sr-only">Target Muscle</Label>
                          <Input id={`ex-muscle-${exercise.id}`} value={exercise.muscleGroupTag || ''} onChange={e => handleExerciseChange(day.id, exercise.id, 'muscleGroupTag', e.target.value)} placeholder="Target muscle" />
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveExercise(day.id, exercise.id)} className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="col-span-12">
                          <Label htmlFor={`ex-media-${exercise.id}`}>Media URL (optional)</Label>
                          <Input id={`ex-media-${exercise.id}`} value={exercise.mediaUrl || ''} onChange={e => handleExerciseChange(day.id, exercise.id, 'mediaUrl', e.target.value)} placeholder="GIF or video URL showing proper form" className="mt-1" />
                        </div>
                        <div className="col-span-12">
                          <Label htmlFor={`ex-notes-${exercise.id}`}>Notes (optional)</Label>
                          <Textarea id={`ex-notes-${exercise.id}`} value={exercise.notes || ''} onChange={e => handleExerciseChange(day.id, exercise.id, 'notes', e.target.value)} placeholder="Additional instructions or tips" className="mt-1" rows={2} />
                        </div>
                      </div>)}
                  </div> : <div className="text-center py-4 text-muted-foreground">
                    No exercises added yet
                  </div>}
                
                <Button variant="outline" size="sm" onClick={() => handleAddExercise(day.id)} className="w-full">
                  <Plus className="w-4 h-4 mr-1" /> Add Exercise
                </Button>
              </div>
            </CardContent>
          </Card>)}
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="outline" onClick={() => {
        setIsCreating(false);
        setIsEditing(false);
        setSelectedPlan(null);
      }}>
          Cancel
        </Button>
        <Button onClick={handleSubmitPlan}>
          {isEditing ? 'Update Plan' : 'Create Plan'}
        </Button>
      </div>
    </div>;
  const renderAssignForm = () => <div className="space-y-4">
      {!forMemberId && <div className="space-y-2">
          <Label htmlFor="memberSelect">Select Member</Label>
          <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
            <SelectTrigger id="memberSelect">
              <SelectValue placeholder="Choose a member" />
            </SelectTrigger>
            <SelectContent>
              {members.map(member => <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>}

      {selectedPlan && <div className="mt-4">
          <h3 className="font-medium">Selected Plan:</h3>
          <div className="bg-muted p-3 rounded-md mt-2">
            <h4 className="font-medium">{selectedPlan.name}</h4>
            <p className="text-sm text-muted-foreground">{selectedPlan.description}</p>
            <p className="text-xs mt-1">Days: {selectedPlan.days.length} | Exercises: {selectedPlan.days.reduce((total, day) => total + day.exercises.length, 0)}</p>
          </div>
        </div>}

      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="outline" onClick={() => {
        setIsAssigning(false);
        setSelectedPlan(null);
      }}>
          Cancel
        </Button>
        <Button onClick={handleAssignSubmit} disabled={!selectedPlan || !selectedMemberId}>
          Assign Plan
        </Button>
      </div>
    </div>;

  // If we're creating, editing, or assigning, show the appropriate form
  if (isCreating || isEditing) {
    return <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Workout Plan" : "Create New Workout Plan"}</CardTitle>
          <CardDescription>
            {isEditing ? "Modify the details of this workout plan" : "Define a new workout plan with exercises and instructions"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderPlanForm()}
        </CardContent>
      </Card>;
  }
  if (isAssigning) {
    return <Card>
        <CardHeader>
          <CardTitle>Assign Workout Plan</CardTitle>
          <CardDescription>
            Assign this workout plan to a member
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderAssignForm()}
        </CardContent>
      </Card>;
  }

  // Default view - list of plans and/or member's assigned plans
  return <Card>
      <CardHeader>
        <CardTitle>Workout Plans</CardTitle>
        <CardDescription>
          Manage and assign workout plans to members
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={forMemberId ? "assigned" : "all"}>
          <TabsList>
            <TabsTrigger value="all">All Plans</TabsTrigger>
            {forMemberId && <TabsTrigger value="assigned">Assigned Plans</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Available Workout Plans</h3>
              
            </div>
            
            {workoutPlans.length > 0 ? <div className="grid gap-4 md:grid-cols-2">
                {workoutPlans.map(plan => <Card key={plan.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/50 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{plan.name}</CardTitle>
                          <CardDescription>{plan.isCommon ? "Common Plan" : "Private Plan"}</CardDescription>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEditPlan(plan)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeletePlan(plan.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          {forMemberId && <Button variant="ghost" size="sm" onClick={() => handleAssignPlan(plan)}>
                              <Copy className="w-4 h-4" />
                            </Button>}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="text-sm mb-2">{plan.description}</p>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Days: {plan.days.length}</span>
                          <span>Exercises: {plan.days.reduce((sum, day) => sum + day.exercises.length, 0)}</span>
                        </div>
                        <div className="mt-1">
                          Created by: {getTrainerName(plan.createdBy)}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-end">
                      {!forMemberId && <Button variant="outline" size="sm" onClick={() => handleAssignPlan(plan)}>
                          <Users className="w-4 h-4 mr-1" /> Assign to Member
                        </Button>}
                    </CardFooter>
                  </Card>)}
              </div> : <div className="text-center py-8 border rounded-lg">
                <Dumbbell className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-lg font-medium">No Workout Plans</h3>
                <p className="text-muted-foreground">Create your first workout plan to get started</p>
                <Button onClick={handleCreatePlan} className="mt-4">
                  <Plus className="w-4 h-4 mr-1" /> Create Plan
                </Button>
              </div>}
          </TabsContent>
          
          {forMemberId && <TabsContent value="assigned" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Assigned Workout Plans</h3>
                
              </div>
              
              {memberWorkouts.length > 0 ? <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plan Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Assigned By</TableHead>
                      <TableHead>Assigned On</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {memberWorkouts.map(memberWorkout => {
                const plan = workoutPlans.find(p => p.id === memberWorkout.workoutPlanId);
                if (!plan) return null;
                return <TableRow key={memberWorkout.id}>
                          <TableCell className="font-medium">{plan.name}</TableCell>
                          <TableCell>{memberWorkout.isCustom ? "Custom" : "Standard"}</TableCell>
                          <TableCell>{getTrainerName(memberWorkout.assignedBy)}</TableCell>
                          <TableCell>{new Date(memberWorkout.assignedAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>;
              })}
                  </TableBody>
                </Table> : <div className="text-center py-8 border rounded-lg">
                  <Dumbbell className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-medium">No Assigned Plans</h3>
                  <p className="text-muted-foreground">Assign a workout plan to this member</p>
                  <Button variant="outline" onClick={() => setSelectedMemberId(forMemberId)} className="mt-4">
                    <Plus className="w-4 h-4 mr-1" /> Assign Plan
                  </Button>
                </div>}
            </TabsContent>}
        </Tabs>
      </CardContent>
    </Card>;
};
export default WorkoutPlansManager;