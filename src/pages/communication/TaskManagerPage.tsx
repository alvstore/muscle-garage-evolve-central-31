
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, CheckSquare, Plus, Filter, Calendar, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from '@/hooks/use-branch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type TaskStatus = "todo" | "in_progress" | "completed";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high";
  due_date?: string;
  assigned_to?: string;
  assignee?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  created_at: string;
  updated_at: string;
  branch_id: string;
}

interface StaffMember {
  id: string;
  full_name: string;
  avatar_url?: string;
  email?: string;
}

const TaskManagerPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [timeFilter, setTimeFilter] = useState("all");
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
  });
  
  const { toast } = useToast();
  const { currentBranch } = useBranch();
  const branchId = currentBranch?.id;

  useEffect(() => {
    const fetchTasks = async () => {
      if (!branchId) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('communication_tasks')
          .select(`
            *,
            assignee:assigned_to (
              id,
              full_name,
              avatar_url
            )
          `)
          .eq('branch_id', branchId);
          
        if (error) throw error;
        
        setTasks(data || []);
      } catch (error: any) {
        console.error('Error fetching tasks:', error);
        toast({
          title: 'Error fetching tasks',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    const fetchStaffMembers = async () => {
      if (!branchId) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, email')
          .eq('branch_id', branchId)
          .in('role', ['admin', 'staff', 'trainer']);
          
        if (error) throw error;
        
        setStaffMembers(data || []);
      } catch (error: any) {
        console.error('Error fetching staff members:', error);
      }
    };
    
    fetchTasks();
    fetchStaffMembers();
  }, [branchId, toast]);

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusColumnTitle = (status: TaskStatus) => {
    switch(status) {
      case 'todo': return "To Do";
      case 'in_progress': return "In Progress";
      case 'completed': return "Completed";
    }
  };

  const handleDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;
    
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    
    const updatedStatus = destination.droppableId as TaskStatus;
    
    // Find the task
    const taskToUpdate = tasks.find(task => task.id === draggableId);
    if (!taskToUpdate) return;
    
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('communication_tasks')
        .update({ 
          status: updatedStatus,
          updated_at: new Date().toISOString() 
        })
        .eq('id', draggableId);
        
      if (error) throw error;
      
      // Update locally
      const newTasks = [...tasks];
      const taskIndex = newTasks.findIndex(task => task.id === draggableId);
      if (taskIndex !== -1) {
        newTasks[taskIndex] = {
          ...newTasks[taskIndex],
          status: updatedStatus
        };
        setTasks(newTasks);
      }
      
      toast({
        title: 'Task updated',
        description: 'Task status has been updated successfully',
      });
    } catch (error: any) {
      console.error('Error updating task status:', error);
      toast({
        title: 'Error updating task',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  const handleCreateTask = async () => {
    if (!branchId || !newTask.title) return;
    
    try {
      setIsSubmitting(true);
      
      const taskToCreate = {
        ...newTask,
        branch_id: branchId
      };
      
      const { data, error } = await supabase
        .from('communication_tasks')
        .insert([taskToCreate])
        .select(`
          *,
          assignee:assigned_to (
            id,
            full_name,
            avatar_url
          )
        `)
        .single();
        
      if (error) throw error;
      
      setTasks([...tasks, data]);
      setNewTask({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
      });
      setOpen(false);
      
      toast({
        title: 'Task created',
        description: 'New task has been created successfully',
      });
    } catch (error: any) {
      console.error('Error creating task:', error);
      toast({
        title: 'Error creating task',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter tasks
  let filteredTasks = [...tasks];
  
  // Apply time filter
  if (timeFilter === "today") {
    const today = new Date().toISOString().split('T')[0];
    filteredTasks = filteredTasks.filter(task => task.due_date === today);
  } else if (timeFilter === "week") {
    const today = new Date();
    const weekFromNow = new Date(today);
    weekFromNow.setDate(today.getDate() + 7);
    
    filteredTasks = filteredTasks.filter(task => {
      if (!task.due_date) return false;
      const dueDate = new Date(task.due_date);
      return dueDate >= today && dueDate <= weekFromNow;
    });
  } else if (timeFilter === "overdue") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    filteredTasks = filteredTasks.filter(task => {
      if (!task.due_date) return false;
      const dueDate = new Date(task.due_date);
      return dueDate < today && task.status !== "completed";
    });
  }

  // Group the filtered tasks by status
  const tasksByStatus: Record<TaskStatus, Task[]> = {
    todo: filteredTasks.filter(task => task.status === "todo"),
    in_progress: filteredTasks.filter(task => task.status === "in_progress"),
    completed: filteredTasks.filter(task => task.status === "completed")
  };

  if (isLoading) {
    return (
      <Container>
        <div className="py-6">
          <div className="flex justify-center items-center py-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-6">
        <Breadcrumb className="mb-4">
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/communication">Communication</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/communication/tasks" isCurrentPage>Tasks</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground">Manage and organize your follow-ups and tasks</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Add a new task to your board. Fill in the details and click create when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    placeholder="Task title" 
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Task details..." 
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select 
                      value={newTask.priority} 
                      onValueChange={(value) => setNewTask({ ...newTask, priority: value as 'low' | 'medium' | 'high' })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="w-full justify-start text-left font-normal"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {newTask.due_date ? format(new Date(newTask.due_date), "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={newTask.due_date ? new Date(newTask.due_date) : undefined}
                          onSelect={(date) => setNewTask({ ...newTask, due_date: date?.toISOString() })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assigned">Assign To</Label>
                  <Select 
                    value={newTask.assigned_to} 
                    onValueChange={(value) => setNewTask({ ...newTask, assigned_to: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {staffMembers.map((staff) => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateTask} disabled={!newTask.title || isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Create Task
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5" />
                  <span>Task Board</span>
                </CardTitle>
                <CardDescription>
                  Organize and track your tasks by status
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Select value={timeFilter} onValueChange={setTimeFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tasks</SelectItem>
                      <SelectItem value="today">Due Today</SelectItem>
                      <SelectItem value="week">Due This Week</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="board">
              <TabsList className="mb-4">
                <TabsTrigger value="board">Board View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="board">
                <DragDropContext onDragEnd={handleDragEnd}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(["todo", "in_progress", "completed"] as TaskStatus[]).map(status => (
                      <div key={status}>
                        <div className="bg-muted/50 rounded-lg p-4">
                          <h3 className="font-medium mb-3">{getStatusColumnTitle(status)} ({tasksByStatus[status].length})</h3>
                          <Droppable droppableId={status}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="min-h-[200px]"
                              >
                                {tasksByStatus[status].map((task, index) => (
                                  <Draggable key={task.id} draggableId={task.id} index={index}>
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="bg-card border rounded-md p-3 mb-2 shadow-sm"
                                      >
                                        <div className="flex justify-between items-start mb-2">
                                          <h4 className="font-medium text-sm">{task.title}</h4>
                                          <Badge className={getPriorityColor(task.priority)}>
                                            {task.priority}
                                          </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-2">
                                          {task.description}
                                        </p>
                                        <div className="flex justify-between items-center text-xs">
                                          <div>
                                            {task.due_date && (
                                              <div className="flex items-center">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                {format(new Date(task.due_date), "MMM d, yyyy")}
                                              </div>
                                            )}
                                          </div>
                                          {task.assignee && (
                                            <div className="flex items-center">
                                              <Avatar className="h-5 w-5 mr-1">
                                                <AvatarFallback>{task.assignee.full_name[0]}</AvatarFallback>
                                                {task.assignee.avatar_url && (
                                                  <AvatarImage src={task.assignee.avatar_url} />
                                                )}
                                              </Avatar>
                                              <span>{task.assignee.full_name}</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                                {tasksByStatus[status].length === 0 && (
                                  <div className="h-20 border border-dashed rounded-md flex items-center justify-center text-muted-foreground text-sm">
                                    No tasks
                                  </div>
                                )}
                              </div>
                            )}
                          </Droppable>
                        </div>
                      </div>
                    ))}
                  </div>
                </DragDropContext>
              </TabsContent>
              
              <TabsContent value="list">
                <div className="border rounded-md">
                  {filteredTasks.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      No tasks match your current filter.
                    </div>
                  ) : (
                    <div className="divide-y">
                      {filteredTasks.map(task => (
                        <div key={task.id} className="p-4 flex items-center gap-4">
                          <input 
                            type="checkbox" 
                            checked={task.status === "completed"}
                            onChange={async () => {
                              const newStatus = task.status === "completed" ? "todo" : "completed";
                              try {
                                await supabase
                                  .from('communication_tasks')
                                  .update({ 
                                    status: newStatus,
                                    updated_at: new Date().toISOString() 
                                  })
                                  .eq('id', task.id);
                                  
                                setTasks(prevTasks => 
                                  prevTasks.map(t => 
                                    t.id === task.id ? { ...t, status: newStatus } : t
                                  )
                                );
                              } catch (error) {
                                console.error('Error updating task:', error);
                              }
                            }} 
                          />
                          <div className="flex-1">
                            <div className="font-medium">{task.title}</div>
                            <div className="text-sm text-muted-foreground">{task.description}</div>
                          </div>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          {task.due_date && (
                            <div className="text-sm">
                              {format(new Date(task.due_date), "MMM d, yyyy")}
                            </div>
                          )}
                          {task.assignee && (
                            <div className="flex items-center">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarFallback>{task.assignee.full_name[0]}</AvatarFallback>
                                {task.assignee.avatar_url && (
                                  <AvatarImage src={task.assignee.avatar_url} />
                                )}
                              </Avatar>
                              <span className="text-sm">{task.assignee.full_name}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default TaskManagerPage;
