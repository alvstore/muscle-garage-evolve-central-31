
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkoutPlan, WorkoutAssignment } from '@/types/workout';
import { Member } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar as CalendarIcon, 
  Search, 
  Plus, 
  Trash2,
  Users,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from '@/lib/utils';

// Mock data
const mockWorkoutPlans: WorkoutPlan[] = [
  {
    id: '1',
    name: 'Beginner Full Body',
    description: 'A comprehensive workout for beginners targeting all major muscle groups',
    trainerId: 'trainer1',
    workoutDays: [
      {
        id: 'day1',
        name: 'Day 1: Upper Body',
        exercises: [
          { id: 'ex1', name: 'Push-Ups', sets: 3, reps: 10 },
          { id: 'ex2', name: 'Dumbbell Rows', sets: 3, reps: 12 }
        ]
      },
      {
        id: 'day2',
        name: 'Day 2: Lower Body',
        exercises: [
          { id: 'ex3', name: 'Squats', sets: 3, reps: 15 },
          { id: 'ex4', name: 'Lunges', sets: 3, reps: 10 }
        ]
      }
    ],
    targetGoals: ['Strength', 'Muscle Gain'],
    difficulty: 'beginner',
    isGlobal: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Intermediate Strength',
    description: 'Progressive strength training for intermediate fitness levels',
    trainerId: 'trainer1',
    workoutDays: [
      {
        id: 'day1',
        name: 'Day 1: Chest & Triceps',
        exercises: [
          { id: 'ex1', name: 'Bench Press', sets: 4, reps: 8, weight: '60kg' },
          { id: 'ex2', name: 'Incline Dumbbell Press', sets: 3, reps: 10, weight: '20kg' }
        ]
      },
      {
        id: 'day2',
        name: 'Day 2: Back & Biceps',
        exercises: [
          { id: 'ex3', name: 'Deadlifts', sets: 4, reps: 6, weight: '80kg' },
          { id: 'ex4', name: 'Pull-Ups', sets: 3, reps: 8 }
        ]
      }
    ],
    targetGoals: ['Strength', 'Muscle Gain'],
    difficulty: 'intermediate',
    isGlobal: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Mock members data
const mockMembers: Member[] = [
  {
    id: 'member1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'member',
    membershipStatus: 'active',
    trainerId: 'trainer1',
    goal: 'Weight Loss'
  },
  {
    id: 'member2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'member',
    membershipStatus: 'active',
    trainerId: 'trainer1',
    goal: 'Muscle Gain'
  },
  {
    id: 'member3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'member',
    membershipStatus: 'active',
    trainerId: 'trainer2',
    goal: 'Strength'
  }
];

// Mock assignments
const mockAssignments: WorkoutAssignment[] = [
  {
    id: 'assign1',
    planId: '1',
    memberId: 'member1',
    trainerId: 'trainer1',
    assignedAt: new Date().toISOString(),
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true
  },
  {
    id: 'assign2',
    planId: '2',
    memberId: 'member2',
    trainerId: 'trainer1',
    assignedAt: new Date().toISOString(),
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true
  }
];

const TrainerPlanAssignmentsPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [assignments, setAssignments] = useState<WorkoutAssignment[]>(mockAssignments);
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>(mockWorkoutPlans);
  
  // New assignment state
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const trainerMembers = members.filter(member => member.trainerId === user?.id);
  
  const filteredAssignments = assignments.filter(assignment => {
    const member = members.find(m => m.id === assignment.memberId);
    const plan = workoutPlans.find(p => p.id === assignment.planId);
    
    if (!member || !plan) return false;
    
    const searchTerms = `${member.name} ${plan.name}`.toLowerCase();
    return assignment.trainerId === user?.id && searchTerms.includes(searchQuery.toLowerCase());
  });
  
  const handleCreateAssignment = () => {
    if (!selectedMemberId || !selectedPlanId || !startDate || !endDate) {
      toast.error("Please fill all required fields");
      return;
    }
    
    if (endDate < startDate) {
      toast.error("End date cannot be before start date");
      return;
    }
    
    // Check if selected member is assigned to the current trainer
    const member = members.find(m => m.id === selectedMemberId);
    if (member?.trainerId !== user?.id) {
      toast.error("You can only assign plans to members assigned to you");
      return;
    }
    
    // In a real app, this would be an API call
    const newAssignment: WorkoutAssignment = {
      id: `assign-${Date.now()}`,
      planId: selectedPlanId,
      memberId: selectedMemberId,
      trainerId: user?.id || '',
      assignedAt: new Date().toISOString(),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      isActive: true
    };
    
    setAssignments([...assignments, newAssignment]);
    setIsDialogOpen(false);
    toast.success("Workout plan assigned successfully");
    
    // Reset form
    setSelectedMemberId('');
    setSelectedPlanId('');
    setStartDate(new Date());
    setEndDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  };
  
  const handleDeleteAssignment = (assignmentId: string) => {
    // In a real app, this would be an API call
    setAssignments(assignments.filter(a => a.id !== assignmentId));
    toast.success("Assignment removed successfully");
  };
  
  const getMemberById = (memberId: string) => {
    return members.find(m => m.id === memberId);
  };
  
  const getPlanById = (planId: string) => {
    return workoutPlans.find(p => p.id === planId);
  };
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Plan Assignments</h1>
          <p className="text-muted-foreground">Assign workout plans to your members</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-1" />
              Assign Plan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Workout Plan</DialogTitle>
              <DialogDescription>
                Assign a workout plan to a member from your list.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="member">Member *</Label>
                <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {trainerMembers.map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="plan">Workout Plan *</Label>
                <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a workout plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {workoutPlans.map(plan => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => date && setStartDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label>End Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => date && setEndDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleCreateAssignment}>Assign Plan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Plan Assignments</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members or plans..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <CardDescription>
            Manage workout plans assigned to your members
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAssignments.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium mb-2">No Assignments Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? "No assignments match your search criteria" 
                  : "You haven't assigned any workout plans yet"}
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Assign Plan
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Workout Plan</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssignments.map((assignment) => {
                    const member = getMemberById(assignment.memberId);
                    const plan = getPlanById(assignment.planId);
                    
                    if (!member || !plan) return null;
                    
                    const isActive = assignment.isActive && new Date(assignment.endDate) >= new Date();
                    
                    return (
                      <TableRow key={assignment.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium leading-none mb-1">{member.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Goal: {member.goal || 'Not specified'}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p>{plan.name}</p>
                            <Badge variant="outline">{plan.difficulty}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(assignment.startDate), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          {format(new Date(assignment.endDate), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          {isActive ? (
                            <div className="flex items-center">
                              <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                              <span>Active</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <XCircle className="h-4 w-4 text-gray-400 mr-1" />
                              <span>Inactive</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Confirm Removal</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to remove the "{plan.name}" workout plan from {member.name}?
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter className="mt-4">
                                <DialogClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button 
                                  variant="destructive" 
                                  onClick={() => handleDeleteAssignment(assignment.id)}
                                >
                                  Remove Assignment
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainerPlanAssignmentsPage;
