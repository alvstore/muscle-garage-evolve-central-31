
import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, MoreHorizontal, Edit, Trash2, Copy, FileText, Calendar, Check } from "lucide-react";
import { mockMembers } from "@/data/mockData";
import { Member } from "@/types";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface PTWorkout {
  id: string;
  name: string;
  description: string;
  duration: string;
  exercises: {
    name: string;
    sets: number;
    reps: string;
    rest: string;
    notes?: string;
  }[];
}

interface PTProgram {
  id: string;
  title: string;
  description: string;
  trainerId: string;
  memberId: string;
  status: 'active' | 'completed' | 'draft';
  createdAt: string;
  updatedAt: string;
  startDate: string;
  endDate: string;
  workouts: PTWorkout[];
}

const TrainerPTPlansPage = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [ptPrograms, setPtPrograms] = useState<PTProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<PTProgram | null>(null);
  const [showProgramDialog, setShowProgramDialog] = useState(false);
  
  // Form state for new program
  const [newProgram, setNewProgram] = useState<Partial<PTProgram>>({
    title: '',
    description: '',
    trainerId: user?.id || '',
    memberId: '',
    status: 'draft',
    startDate: '',
    endDate: '',
    workouts: []
  });
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, this would be an API call
        // For now, simulate with mock data
        setTimeout(() => {
          // Filter members assigned to this trainer
          const trainerMembers = mockMembers.filter(m => m.trainerId === user?.id || m.trainerId === "trainer1");
          setMembers(trainerMembers);
          
          // Mock PT programs
          const mockPrograms: PTProgram[] = [
            {
              id: "program-1",
              title: "Weight Loss Program - John Doe",
              description: "12-week program focused on fat loss and building lean muscle",
              trainerId: user?.id || "trainer1",
              memberId: "member-1",
              status: 'active',
              createdAt: "2025-03-15T08:00:00Z",
              updatedAt: "2025-04-01T14:30:00Z",
              startDate: "2025-03-15",
              endDate: "2025-06-07",
              workouts: [
                {
                  id: "workout-1",
                  name: "Upper Body Day",
                  description: "Focus on chest, shoulders, and triceps",
                  duration: "60 min",
                  exercises: [
                    { name: "Bench Press", sets: 4, reps: "8-10", rest: "90 sec" },
                    { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", rest: "60 sec" },
                    { name: "Shoulder Press", sets: 3, reps: "10-12", rest: "60 sec" },
                    { name: "Lateral Raises", sets: 3, reps: "12-15", rest: "45 sec" },
                    { name: "Tricep Pushdowns", sets: 3, reps: "12-15", rest: "45 sec" }
                  ]
                },
                {
                  id: "workout-2",
                  name: "Lower Body Day",
                  description: "Focus on quadriceps, hamstrings, and calves",
                  duration: "60 min",
                  exercises: [
                    { name: "Squats", sets: 4, reps: "8-10", rest: "90 sec" },
                    { name: "Leg Press", sets: 3, reps: "10-12", rest: "60 sec" },
                    { name: "Romanian Deadlifts", sets: 3, reps: "10-12", rest: "60 sec" },
                    { name: "Leg Extensions", sets: 3, reps: "12-15", rest: "45 sec" },
                    { name: "Calf Raises", sets: 3, reps: "15-20", rest: "45 sec" }
                  ]
                }
              ]
            },
            {
              id: "program-2",
              title: "Muscle Building - Sarah Parker",
              description: "8-week program focused on progressive overload and muscle hypertrophy",
              trainerId: user?.id || "trainer1",
              memberId: "member-3",
              status: 'active',
              createdAt: "2025-02-10T09:15:00Z",
              updatedAt: "2025-03-20T11:45:00Z",
              startDate: "2025-02-15",
              endDate: "2025-04-12",
              workouts: [
                {
                  id: "workout-3",
                  name: "Push Day",
                  description: "Chest, shoulders, and triceps",
                  duration: "75 min",
                  exercises: [
                    { name: "Barbell Bench Press", sets: 5, reps: "5", rest: "180 sec" },
                    { name: "Overhead Press", sets: 4, reps: "6-8", rest: "120 sec" },
                    { name: "Incline Dumbbell Press", sets: 3, reps: "8-10", rest: "90 sec" },
                    { name: "Lateral Raises", sets: 3, reps: "10-12", rest: "60 sec" },
                    { name: "Tricep Dips", sets: 3, reps: "8-10", rest: "90 sec" }
                  ]
                },
                {
                  id: "workout-4",
                  name: "Pull Day",
                  description: "Back and biceps",
                  duration: "75 min",
                  exercises: [
                    { name: "Deadlifts", sets: 4, reps: "5", rest: "180 sec" },
                    { name: "Pull-ups", sets: 4, reps: "8-10", rest: "120 sec" },
                    { name: "Barbell Rows", sets: 3, reps: "8-10", rest: "90 sec" },
                    { name: "Face Pulls", sets: 3, reps: "12-15", rest: "60 sec" },
                    { name: "Barbell Curls", sets: 3, reps: "10-12", rest: "60 sec" }
                  ]
                }
              ]
            }
          ];
          
          setPtPrograms(mockPrograms);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user?.id]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProgram(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleMemberSelect = (memberId: string) => {
    const selectedMember = members.find(m => m.id === memberId);
    
    setNewProgram(prev => ({
      ...prev,
      memberId,
      title: selectedMember ? `New Program - ${selectedMember.name}` : 'New Program'
    }));
  };
  
  const handleCreateProgram = () => {
    const program: PTProgram = {
      id: `program-${Date.now()}`,
      title: newProgram.title || 'Untitled Program',
      description: newProgram.description || '',
      trainerId: user?.id || 'trainer1',
      memberId: newProgram.memberId || '',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      startDate: newProgram.startDate || '',
      endDate: newProgram.endDate || '',
      workouts: []
    };
    
    setPtPrograms(prev => [...prev, program]);
    setShowProgramDialog(false);
    
    // Reset form
    setNewProgram({
      title: '',
      description: '',
      trainerId: user?.id || '',
      memberId: '',
      status: 'draft',
      startDate: '',
      endDate: '',
      workouts: []
    });
    
    toast.success("Program created successfully");
  };
  
  const getMemberName = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    return member ? member.name : 'Unknown Member';
  };
  
  const getWorkoutCount = (program: PTProgram) => {
    return program.workouts.length;
  };
  
  const getProgramDuration = (program: PTProgram) => {
    if (!program.startDate || !program.endDate) return 'N/A';
    
    const start = new Date(program.startDate);
    const end = new Date(program.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return `${diffDays} days`;
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'completed':
        return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'draft':
        return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };
  
  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Personal Training Plans</h1>
            <p className="text-muted-foreground">Manage customized training programs for your clients</p>
          </div>
          
          <Dialog open={showProgramDialog} onOpenChange={setShowProgramDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Program
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New PT Program</DialogTitle>
                <DialogDescription>
                  Create a customized training program for your client.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="memberId">Select Member</Label>
                  <Select
                    value={newProgram.memberId}
                    onValueChange={handleMemberSelect}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a member" />
                    </SelectTrigger>
                    <SelectContent>
                      {members.map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Program Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={newProgram.title}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newProgram.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={newProgram.startDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={newProgram.endDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowProgramDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProgram} disabled={!newProgram.memberId}>
                  Create Program
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs defaultValue="active">
          <TabsList className="mb-6">
            <TabsTrigger value="active">Active Programs</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map(i => (
                  <div key={i} className="h-40 animate-pulse bg-muted rounded-md"></div>
                ))}
              </div>
            ) : (
              <>
                {ptPrograms.filter(p => p.status === 'active').length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {ptPrograms
                      .filter(p => p.status === 'active')
                      .map(program => (
                        <Card key={program.id}>
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle>{program.title}</CardTitle>
                                <CardDescription className="mt-1">{program.description}</CardDescription>
                              </div>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Program
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Check className="h-4 w-4 mr-2" />
                                    Mark as Completed
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-3">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                              <div className="flex items-center mb-2 sm:mb-0">
                                <Avatar className="h-8 w-8 mr-2">
                                  <AvatarImage src={members.find(m => m.id === program.memberId)?.avatar} alt={getMemberName(program.memberId)} />
                                  <AvatarFallback>{getInitials(getMemberName(program.memberId))}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">{getMemberName(program.memberId)}</span>
                              </div>
                              
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(program.status)}`}>
                                {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 text-muted-foreground mr-2" />
                                <span>{getWorkoutCount(program)} workouts</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                                <span>{getProgramDuration(program)}</span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button variant="outline" className="w-full">View Details</Button>
                          </CardFooter>
                        </Card>
                      ))
                    }
                  </div>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <div className="rounded-full bg-muted p-3 mb-4">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold text-lg mb-1">No Active Programs</h3>
                      <p className="text-muted-foreground text-center mb-4">
                        You don't have any active training programs yet.
                      </p>
                      <Button onClick={() => setShowProgramDialog(true)}>Create Program</Button>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            {isLoading ? (
              <div className="h-40 animate-pulse bg-muted rounded-md"></div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <Check className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">No Completed Programs</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    You don't have any completed training programs yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="draft">
            {isLoading ? (
              <div className="h-40 animate-pulse bg-muted rounded-md"></div>
            ) : (
              <>
                {ptPrograms.filter(p => p.status === 'draft').length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {ptPrograms
                      .filter(p => p.status === 'draft')
                      .map(program => (
                        <Card key={program.id}>
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle>{program.title}</CardTitle>
                                <CardDescription className="mt-1">{program.description}</CardDescription>
                              </div>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Program
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Check className="h-4 w-4 mr-2" />
                                    Publish
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-3">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                              <div className="flex items-center mb-2 sm:mb-0">
                                <Avatar className="h-8 w-8 mr-2">
                                  <AvatarImage src={members.find(m => m.id === program.memberId)?.avatar} alt={getMemberName(program.memberId)} />
                                  <AvatarFallback>{getInitials(getMemberName(program.memberId))}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">{getMemberName(program.memberId)}</span>
                              </div>
                              
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(program.status)}`}>
                                {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                              </span>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button variant="default" className="w-full">Continue Editing</Button>
                          </CardFooter>
                        </Card>
                      ))
                    }
                  </div>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <div className="rounded-full bg-muted p-3 mb-4">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold text-lg mb-1">No Draft Programs</h3>
                      <p className="text-muted-foreground text-center mb-4">
                        You don't have any program drafts yet.
                      </p>
                      <Button onClick={() => setShowProgramDialog(true)}>Create Program</Button>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default TrainerPTPlansPage;
