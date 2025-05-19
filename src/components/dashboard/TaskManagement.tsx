
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, ChevronRight, Plus, Trash2, CheckSquare, ListTodo, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/auth/use-auth";
import { usePermissions } from "@/hooks/auth/use-permissions";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { taskService, Task as TaskType } from '@/services/taskService';
import { useEffect } from 'react';

// Extend the TaskType from the service with UI-specific properties
interface Task extends Omit<TaskType, 'assigned_to_name' | 'assigned_to_avatar'> {
  completed: boolean;
  assigneeName: string;
  assigneeAvatar: string;
  assigned_to_name?: string;
  assigned_to_avatar?: string;
}

interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
}

interface User {
  id: string;
  name: string;
  avatar?: string;
}

const TaskManagement = () => {
  const { user } = useAuth();
  const { can } = usePermissions();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    priority: 'medium',
    assignedTo: '',
  });
  const [date, setDate] = useState<Date>();
  
  // Format task for display
  const formatTaskForDisplay = (task: TaskType): Task => {
    const assignedToName = (task as any).assigned_to_name || 'Unassigned';
    const assignedToAvatar = (task as any).assigned_to_avatar || '/placeholder-user.jpg';
    
    return {
      ...task,
      completed: task.status === 'completed',
      assigneeName: assignedToName,
      assigneeAvatar: assignedToAvatar,
      assigned_to_name: assignedToName,
      assigned_to_avatar: assignedToAvatar,
    };
  };
  
  // Format form data for API
  const formatTaskForApi = (formData: TaskFormData): Omit<TaskType, 'id' | 'created_at' | 'updated_at'> => ({
    title: formData.title,
    description: formData.description || null,
    due_date: formData.dueDate,
    priority: formData.priority,
    status: 'todo',
    assigned_to: formData.assignedTo || null,
    created_by: user?.id || null,
    branch_id: null, // You might want to set this based on the current branch
  });

  // Fetch tasks from the server
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const tasks = await taskService.getTasks();
        const formattedTasks = tasks.map(task => formatTaskForDisplay(task));
        setTasks(formattedTasks);
        setError(null);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks. Please try again later.');
        toast.error('Failed to load tasks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const taskData = formatTaskForApi(formData);
      const newTask = await taskService.createTask(taskData);
      
      // Format the new task for display and add it to the list
      const formattedTask = formatTaskForDisplay(newTask);
      setTasks([formattedTask, ...tasks]);
      
      // Reset form and close dialog
      setDialogOpen(false);
      setFormData({
        title: '',
        description: '',
        dueDate: format(new Date(), 'yyyy-MM-dd'),
        priority: 'medium',
        assignedTo: '',
      });
      
      toast.success('Task created successfully');
    } catch (err) {
      console.error('Error creating task:', err);
      toast.error('Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle priority change
  const handlePriorityChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      priority: value as 'low' | 'medium' | 'high'
    }));
  };
  
  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setDate(date);
    setFormData(prev => ({
      ...prev,
      dueDate: format(date, 'yyyy-MM-dd')
    }));
  };

  // Update task status
  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'todo' : 'completed';
      await taskService.updateTask(taskId, { status: newStatus });
      
      setTasks(tasks.map(task => {
        if (task.id === taskId) {
          const updatedTask = { ...task, status: newStatus, completed: newStatus === 'completed' };
          return formatTaskForDisplay(updatedTask);
        }
        return task;
      }));
      
      toast.success(`Task marked as ${newStatus}`);
    } catch (err) {
      console.error('Error updating task status:', err);
      toast.error('Failed to update task status');
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      toast.success('Task deleted successfully');
    } catch (err) {
      console.error('Error deleting task:', err);
      toast.error('Failed to delete task');
    }
  };
  
  // Handle date selection (single implementation)
  const handleDateSelectSingle = (date: Date | undefined) => {
    if (!date) return;
    setDate(date);
    setFormData(prev => ({
      ...prev,
      dueDate: format(date, 'yyyy-MM-dd')
    }));
  };
  
  // Mock staff/trainers for assignment
  const staffAndTrainers: User[] = [
    { id: 'trainer1', name: 'Alex Trainer' },
    { id: 'trainer2', name: 'Sarah Fitness', avatar: '/placeholder.svg' },
    { id: 'staff1', name: 'John Staff' },
    { id: 'staff2', name: 'Emily Admin' }
  ];
  
  const canManageTasks = can('assign_plan') || userRole === 'admin' || userRole === 'staff';
  
  const handleFormChange = (field: keyof TaskFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setFormData(prev => ({
        ...prev,
        dueDate: format(selectedDate, 'yyyy-MM-dd')
      }));
    }
  };
  
  const handleCreateTask = () => {
    // Validate form
    if (!formData.title.trim()) {
      toast.error("Task title is required");
      return;
    }
    
    if (!formData.dueDate) {
      toast.error("Due date is required");
      return;
    }
    
    // Create new task
    const newTask: Task = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      priority: formData.priority,
      assignedTo: formData.assignedTo,
      assigneeName: formData.assignedTo ? 
        staffAndTrainers.find(s => s.id === formData.assignedTo)?.name : undefined,
      assigneeAvatar: formData.assignedTo ? 
        staffAndTrainers.find(s => s.id === formData.assignedTo)?.avatar : undefined,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setTasks(prev => [...prev, newTask]);
    
    // Reset form and close dialog
    setFormData({
      title: '',
      description: '',
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      priority: 'medium',
      assignedTo: '',
    });
    setDialogOpen(false);
    
    toast.success("Task created successfully");
  };
  
  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prev => 
      prev.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            completed: !task.completed,
            updatedAt: new Date().toISOString()
          };
        }
        return task;
      })
    );
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      toast.success(`Task ${!task.completed ? 'completed' : 'marked as incomplete'}`);
    }
  };
  
  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast.success("Task deleted");
  };
  
  const getPriorityBadge = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-500">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-500">Medium</Badge>;
      case 'low':
        return <Badge className="bg-blue-500">Low</Badge>;
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  const dueSoonTasks = tasks.filter(task => 
    !task.completed && 
    new Date(task.dueDate) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  );
  
  const getFilteredTasks = (filter: 'all' | 'active' | 'completed') => {
    switch (filter) {
      case 'active':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Task Management</CardTitle>
        {canManageTasks && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter task title"
                    value={formData.title}
                    onChange={(e) => handleFormChange('title', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter task description"
                    value={formData.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.dueDate ? format(new Date(formData.dueDate), 'PPP') : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={handleDateSelect}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select 
                      value={formData.priority}
                      onValueChange={(value) => handleFormChange('priority', value as any)}
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
                </div>
                
                <div className="space-y-2">
                  <Label>Assign To</Label>
                  <Select 
                    value={formData.assignedTo}
                    onValueChange={(value) => handleFormChange('assignedTo', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select staff or trainer" />
                    </SelectTrigger>
                    <SelectContent>
                      {staffAndTrainers.map(person => (
                        <SelectItem key={person.id} value={person.id}>
                          {person.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTask}>
                  Create Task
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {dueSoonTasks.length > 0 && (
          <div className="mb-6 rounded-md border bg-amber-50 p-4 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              <h3 className="font-medium">Tasks Due Soon</h3>
            </div>
            <div className="mt-2 space-y-2">
              {dueSoonTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Checkbox 
                      id={`due-soon-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                      className="mr-2"
                    />
                    <Label 
                      htmlFor={`due-soon-${task.id}`}
                      className={`text-sm ${task.completed ? 'line-through opacity-70' : ''}`}
                    >
                      {task.title}
                    </Label>
                  </div>
                  <span className="text-xs">{format(new Date(task.dueDate), 'MMM d')}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <Tabs defaultValue="active">
          <TabsList className="mb-4">
            <TabsTrigger value="active" className="flex items-center">
              <ListTodo className="h-4 w-4 mr-2" />
              Active
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center">
              <CheckSquare className="h-4 w-4 mr-2" />
              Completed
            </TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          
          {['active', 'completed', 'all'].map(filter => (
            <TabsContent key={filter} value={filter} className="space-y-4">
              {getFilteredTasks(filter as any).length > 0 ? (
                getFilteredTasks(filter as any).map(task => (
                  <div 
                    key={task.id} 
                    className={`flex items-start justify-between p-3 border rounded-md ${
                      task.completed ? 'bg-muted/50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id={`task-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={() => toggleTaskCompletion(task.id)}
                        className="mt-1"
                      />
                      <div>
                        <Label 
                          htmlFor={`task-${task.id}`}
                          className={`font-medium ${task.completed ? 'line-through opacity-70' : ''}`}
                        >
                          {task.title}
                        </Label>
                        
                        {task.description && (
                          <p className={`text-sm text-muted-foreground mt-1 ${task.completed ? 'line-through opacity-70' : ''}`}>
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex items-center mt-2 space-x-3">
                          <div className="flex items-center">
                            <CalendarIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                            </span>
                          </div>
                          
                          <div>{getPriorityBadge(task.priority)}</div>
                          
                          {task.assigneeName && (
                            <div className="flex items-center">
                              <Avatar className="h-5 w-5 mr-1">
                                <AvatarImage src={task.assigneeAvatar} alt={task.assigneeName} />
                                <AvatarFallback className="text-[10px]">
                                  {getInitials(task.assigneeName)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs">{task.assigneeName}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {canManageTasks && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deleteTask(task.id)}
                        className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {filter === 'active' ? 'No active tasks' : 
                   filter === 'completed' ? 'No completed tasks' : 'No tasks found'}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TaskManagement;
