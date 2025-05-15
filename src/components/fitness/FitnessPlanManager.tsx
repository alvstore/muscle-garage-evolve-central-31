import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Member, WorkoutPlan, DietPlan } from "@/types";
import { Plus, Save, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { WorkoutPlanForm } from "./WorkoutPlanForm";
import DietPlanForm from "./DietPlanForm";

interface FitnessPlanManagerProps {
  members: Member[];
  trainerId: string;
  readOnly?: boolean;
}

const FitnessPlanManager = ({ members, trainerId, readOnly = false }: FitnessPlanManagerProps) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [editingWorkoutPlan, setEditingWorkoutPlan] = useState(false);
  const [editingDietPlan, setEditingDietPlan] = useState(false);
  
  // Dummy data - in a real app, this would come from an API
  const [workoutPlans, setWorkoutPlans] = useState<Record<string, WorkoutPlan>>({});
  const [dietPlans, setDietPlans] = useState<Record<string, DietPlan>>({});
  
  const selectedMember = members.find(m => m.id === selectedMemberId);
  
  const assignedMembers = members.filter(m => m.trainerId === trainerId);
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleSaveWorkoutPlan = (plan: WorkoutPlan) => {
    setWorkoutPlans(prev => ({
      ...prev,
      [plan.member_id]: plan
    }));
    setEditingWorkoutPlan(false);
    toast.success("Workout plan saved successfully");
  };

  const handleSaveDietPlan = (plan: DietPlan) => {
    setDietPlans(prev => ({
      ...prev,
      [plan.member_id]: plan
    }));
    setEditingDietPlan(false);
    toast.success("Diet plan saved successfully");
  };

  if (!selectedMemberId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fitness & Diet Plans</CardTitle>
          <CardDescription>Select a member to view or edit their plans</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="memberSelect">Select Member</Label>
              <Select onValueChange={setSelectedMemberId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a member" />
                </SelectTrigger>
                <SelectContent>
                  {assignedMembers.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {assignedMembers.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
                {assignedMembers.map(member => (
                  <div 
                    key={member.id} 
                    className="p-4 border rounded-lg space-y-3 cursor-pointer hover:border-primary transition-colors"
                    onClick={() => setSelectedMemberId(member.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{member.name}</h3>
                        <p className="text-xs text-muted-foreground">Goal: {member.goal || "Not set"}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-2">
                      <div className="text-xs px-2 py-1 bg-accent rounded flex items-center gap-1">
                        {workoutPlans[member.id] ? "Has workout plan" : "No workout plan"}
                      </div>
                      <div className="text-xs px-2 py-1 bg-accent rounded flex items-center gap-1">
                        {dietPlans[member.id] ? "Has diet plan" : "No diet plan"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No members are currently assigned to you
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!selectedMember) {
    return null; // Should never happen, but for type safety
  }

  const workoutPlan = workoutPlans[selectedMemberId];
  const dietPlan = dietPlans[selectedMemberId];

  if (editingWorkoutPlan && !readOnly) {
    return (
      <WorkoutPlanForm 
        member={selectedMember}
        existingPlan={workoutPlan}
        trainerId={trainerId}
        onSave={handleSaveWorkoutPlan}
        onCancel={() => setEditingWorkoutPlan(false)}
      />
    );
  }

  if (editingDietPlan && !readOnly) {
    return (
      <DietPlanForm 
        member={selectedMember}
        existingPlan={dietPlan}
        trainerId={trainerId}
        onSave={handleSaveDietPlan}
        onCancel={() => setEditingDietPlan(false)}
      />
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Plans for {selectedMember.name}</CardTitle>
          <CardDescription>
            View and manage fitness and diet plans
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setSelectedMemberId("")}
        >
          Select Different Member
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={selectedMember.avatar} alt={selectedMember.name} />
            <AvatarFallback>{getInitials(selectedMember.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-lg">{selectedMember.name}</h3>
            <p className="text-sm text-muted-foreground">Goal: {selectedMember.goal || "Not set"}</p>
          </div>
        </div>

        <Tabs defaultValue="workout" className="space-y-4">
          <TabsList>
            <TabsTrigger value="workout">Workout Plan</TabsTrigger>
            <TabsTrigger value="diet">Diet Plan</TabsTrigger>
          </TabsList>
          
          <TabsContent value="workout" className="space-y-4">
            {workoutPlan ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">{workoutPlan.workout_days.length} Day Split</h3>
                  {!readOnly && (
                    <div className="space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingWorkoutPlan(true)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit Plan
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {workoutPlan.workout_days.map((day, index) => (
                    <div key={day.id} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Day {index + 1}: {day.name}</h4>
                      
                      <div className="space-y-3">
                        {day.exercises.map(exercise => (
                          <div key={exercise.id} className="bg-accent/20 p-3 rounded-md">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{exercise.name}</span>
                              <span className="text-sm">
                                {exercise.sets} sets × {exercise.reps} reps
                                {exercise.weight ? ` @ ${exercise.weight}kg` : ""}
                              </span>
                            </div>
                            {exercise.notes && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Note: {exercise.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>Last updated: {new Date(workoutPlan.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No workout plan has been created yet</p>
                {!readOnly && (
                  <Button onClick={() => setEditingWorkoutPlan(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Create Workout Plan
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="diet" className="space-y-4">
            {dietPlan ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">{dietPlan.mealPlans.length} Meal Plan</h3>
                  {!readOnly && (
                    <div className="space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingDietPlan(true)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit Plan
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {dietPlan.mealPlans.map((meal, index) => (
                    <div key={meal.id} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">
                        Meal {index + 1}: {meal.name} ({meal.time})
                      </h4>
                      
                      <div className="space-y-2">
                        <div className="text-sm">
                          <ul className="list-disc list-inside">
                            {meal.items.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        
                        {meal.macros && (
                          <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                            <div className="bg-accent/20 p-2 rounded-md">
                              <p className="text-xs text-muted-foreground">Protein</p>
                              <p className="font-medium">{meal.macros.protein}g</p>
                            </div>
                            <div className="bg-accent/20 p-2 rounded-md">
                              <p className="text-xs text-muted-foreground">Carbs</p>
                              <p className="font-medium">{meal.macros.carbs}g</p>
                            </div>
                            <div className="bg-accent/20 p-2 rounded-md">
                              <p className="text-xs text-muted-foreground">Fats</p>
                              <p className="font-medium">{meal.macros.fats}g</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>Last updated: {new Date(dietPlan.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No diet plan has been created yet</p>
                {!readOnly && (
                  <Button onClick={() => setEditingDietPlan(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Create Diet Plan
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FitnessPlanManager;
