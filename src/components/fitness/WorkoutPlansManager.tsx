import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Loader2, PlusCircle, Edit, Trash2, Copy, GripVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  WorkoutPlan,
  WorkoutDay,
  Exercise
} from "@/types/workout";
import { useAuth } from "@/hooks/use-auth";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface WorkoutPlansManagerProps {
  memberId?: string;
}

const WorkoutPlansManager: React.FC<WorkoutPlansManagerProps> = ({ memberId }) => {
  const { user: currentUser } = useAuth();
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateDescription, setNewTemplateDescription] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  useEffect(() => {
    // Mock data for demonstration
    const mockWorkoutPlans: WorkoutPlan[] = [
      {
        id: "wp1",
        name: "Full Body Blast",
        description: "Comprehensive workout targeting all major muscle groups.",
        trainerId: "trainer1",
        memberId: memberId,
        workoutDays: [
          {
            id: "wd1",
            name: "Day 1",
            dayLabel: "Monday",
            exercises: [
              { id: "ex1", name: "Squats", sets: 3, reps: 12, rest: 60 },
              { id: "ex2", name: "Bench Press", sets: 3, reps: 8, rest: 60 },
            ],
          },
          {
            id: "wd2",
            name: "Day 2",
            dayLabel: "Wednesday",
            exercises: [
              { id: "ex3", name: "Deadlifts", sets: 1, reps: 5, rest: 120 },
              { id: "ex4", name: "Overhead Press", sets: 3, reps: 8, rest: 60 },
            ],
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isCustom: true,
        notes: "Focus on form and controlled movements.",
      },
      {
        id: "wp2",
        name: "Upper/Lower Split",
        description: "Alternating upper and lower body workouts.",
        trainerId: "trainer2",
        memberId: memberId,
        workoutDays: [
          {
            id: "wd3",
            name: "Day 1",
            dayLabel: "Tuesday",
            exercises: [
              { id: "ex5", name: "Pull-ups", sets: 3, reps: "AMRAP", rest: 60 },
              { id: "ex6", name: "Dips", sets: 3, reps: "AMRAP", rest: 60 },
            ],
          },
          {
            id: "wd4",
            name: "Day 2",
            dayLabel: "Thursday",
            exercises: [
              { id: "ex7", name: "Leg Press", sets: 3, reps: 12, rest: 60 },
              { id: "ex8", name: "Hamstring Curls", sets: 3, reps: 15, rest: 45 },
            ],
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isCustom: true,
        notes: "Adjust reps based on strength level.",
      },
    ];
    setWorkoutPlans(mockWorkoutPlans);
  }, [memberId]);
  
  const dayOptions = [
    { label: "Monday", value: "monday" },
    { label: "Tuesday", value: "tuesday" },
    { label: "Wednesday", value: "wednesday" },
    { label: "Thursday", value: "thursday" },
    { label: "Friday", value: "friday" },
    { label: "Saturday", value: "saturday" },
    { label: "Sunday", value: "sunday" },
  ];
  
  const handleDragStart = () => {
    setIsDragging(true);
  };
  
  const handleDragEnd = (result: any) => {
    setIsDragging(false);
    if (!result.destination) {
      return;
    }
    
    const items = Array.from(workoutPlans);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setWorkoutPlans(items);
  };
  
  const createPlanTemplate = () => {
    const workoutDay: WorkoutDay = {
      id: uuidv4(),
      name: "Day 1", // Add name property
      dayLabel: "Monday",
      exercises: []
    };
    
    return workoutDay;
  };
  
  const handleDayToggle = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };
  
  const handleAddWorkoutPlan = async (planData: Omit<WorkoutPlan, "id" | "createdAt" | "updatedAt">) => {
    try {
      setIsSaving(true);
      // Add the missing properties to match the WorkoutPlan type
      const completeData: Omit<WorkoutPlan, "id" | "createdAt" | "updatedAt"> = {
        ...planData,
        trainerId: currentUser?.id,
        workoutDays: planData.days || []
      };
      
      // Create fake ID for demo purposes
      const newPlan: WorkoutPlan = {
        ...completeData,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add to local state
      setWorkoutPlans([...workoutPlans, newPlan]);
      toast.success("Workout plan created successfully!");
      
      // Reset form
      setShowTemplateDialog(false);
      setNewTemplateName("");
      setNewTemplateDescription("");
      setSelectedDays([]);
      
    } catch (error) {
      console.error("Error creating workout plan:", error);
      toast.error("Failed to create workout plan");
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Workout Plans</CardTitle>
          <CardDescription>Manage workout plans for members</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Input placeholder="Search workout plans..." className="max-w-md" />
            <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Template
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Workout Plan Template</DialogTitle>
                  <DialogDescription>
                    Define a template for quick workout plan creation
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Template Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Strength Building"
                      value={newTemplateName}
                      onChange={(e) => setNewTemplateName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the template"
                      value={newTemplateDescription}
                      onChange={(e) => setNewTemplateDescription(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Select Days</Label>
                    <div className="flex flex-wrap gap-2">
                      {dayOptions.map(day => (
                        <Button
                          key={day.value}
                          variant={selectedDays.includes(day.value) ? "default" : "outline"}
                          onClick={() => handleDayToggle(day.value)}
                        >
                          {day.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="secondary" onClick={() => setShowTemplateDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      handleAddWorkoutPlan({
                        name: newTemplateName,
                        description: newTemplateDescription,
                        days: selectedDays.map(day => ({
                          id: uuidv4(),
                          name: `Day ${dayOptions.findIndex(d => d.value === day) + 1}`,
                          dayLabel: dayOptions.find(d => d.value === day)?.label,
                          exercises: []
                        }))
                      });
                    }}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Template"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <Droppable droppableId="workoutPlans">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <ScrollArea className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]"></TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {workoutPlans.map((plan, index) => (
                          <Draggable key={plan.id} draggableId={plan.id} index={index}>
                            {(provided) => (
                              <TableRow
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                className="group"
                              >
                                <TableCell className="w-[50px] text-center">
                                  <GripVertical className="h-4 w-4 text-gray-400 group-hover:text-gray-600 cursor-move" />
                                </TableCell>
                                <TableCell className="font-medium">{plan.name}</TableCell>
                                <TableCell>{plan.description}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="sm">
                                      <Copy className="h-4 w-4 mr-2" />
                                      Duplicate
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50">
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              )}
            </Droppable>
          </DragDropContext>
          
          {workoutPlans.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No workout plans found.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutPlansManager;
