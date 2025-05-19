import React, { useState, useEffect, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

// Import Tabs and Avatar components
import { 
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent 
} from '@/components/ui/tabs';
import { 
  Avatar,
  AvatarImage,
  AvatarFallback 
} from '@/components/ui/avatar';

// Icons
import { 
  Calendar as CalendarIcon, 
  Check, 
  Plus, 
  Trash2, 
  CheckSquare, 
  ListTodo, 
  AlertCircle 
} from "lucide-react";

// Hooks and Services
import { useAuth } from '@/hooks/auth/use-auth';
import { usePermissions } from '@/hooks/auth/use-permissions';
import { taskService, Task as TaskType } from '@/services/taskService';
import { staffService, StaffMember } from '@/services/communication/taskService';

// Types and Interfaces
interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface Task extends Omit<TaskType, 'assigned_to_name' | 'assigned_to_avatar'> {
  completed: boolean;
  assigneeName: string;
  assigneeAvatar: string;
  assigned_to_name?: string;
  assigned_to_avatar?: string;
  due_date?: string;
  dueDate?: string; // For backward compatibility
}

interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
}

// Staff members will be loaded from the database
const STAFF_AVATAR_PLACEHOLDER = '/placeholder.svg'; // Make sure this path is correct in your project



const TaskManagement = () => {
  const { user } = useAuth();
  const { can } = usePermissions();
  
  // State management
  const [tasks, setTasks] = useState<Task[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStaff, setIsLoadingStaff] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const [isMounted, setIsMounted] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    priority: 'medium',
    assignedTo: '',
  });
  
  // Check if user can manage tasks
  const canManageTasks = (can as (permission: string) => boolean)('view_tasks');
  const canAssignTasks = (can as (permission: string) => boolean)('assign_tasks');
  
  // Filter tasks based on user role and permissions
  const filteredTasks = useMemo(() => {
    if (isLoading) return [];
    
    return canManageTasks 
      ? tasks 
      : tasks.filter(task => 
          task.assigned_to === user?.id || 
          task.created_by === user?.id
        );
  }, [tasks, canManageTasks, user?.id, isLoading]);
  
  // Get tasks due soon
  const dueSoonTasks = useMemo(() => {
    return tasks.filter(task => 
      !task.completed && 
      task.dueDate && 
      new Date(task.dueDate) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    );
  }, [tasks]);
  
  // Get filtered tasks based on tab
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

  // Format task for display
  const formatTaskForDisplay = (task: TaskType): Task => {
    const assignee = staffMembers.find(s => s.id === task.assigned_to);
    
    return {
      ...task,
      completed: task.status === 'completed',
      assigneeName: assignee?.name || 'Unassigned',
      assigneeAvatar: assignee?.avatar_url || STAFF_AVATAR_PLACEHOLDER,
      dueDate: task.due_date || ''
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

  // Fetch tasks and staff members on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        
        if (canManageTasks || canAssignTasks) {
          // Load tasks
          const tasks = await taskService.getTasks();
          if (isMounted) {
            setTasks(tasks.map(formatTaskForDisplay));
          }
          
          // Load staff members
          const staff = await staffService.getStaffMembers();
          if (isMounted) {
            setStaffMembers(staff);
          }
        }
      } catch (err) {
        console.error('Error loading data:', err);
        if (isMounted) {
          setError('Failed to load data');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsLoadingStaff(false);
        }
      }
    };
    
    loadInitialData();
    
    return () => {
      setIsMounted(false);
    };
  }, [canManageTasks, canAssignTasks, isMounted]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const taskData = formatTaskForApi(formData);
      const newTask = await taskService.createTask(taskData);
      
      // Format the new task for display and add it to the list
      const formattedTask = formatTaskForDisplay(newTask);
      setTasks(prevTasks => [formattedTask, ...prevTasks]);
      
      // Reset form and close dialog
      setIsDialogOpen(false);
      setFormData({
        title: '',
        description: '',
        dueDate: format(new Date(), 'yyyy-MM-dd'),
        priority: 'medium',
        assignedTo: '',
      });
      setDate(null);
      
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
  
  // Handle select input changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle task status toggle
  const handleToggleStatus = async (taskId: string, currentStatus: string) => {
    try {
      setIsLoading(true);
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      
      // Update the task status using the updateTask method
      await taskService.updateTask(taskId, { status: newStatus });
      
      // Update the local state
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId 
            ? { 
                ...task, 
                status: newStatus, 
                completed: newStatus === 'completed',
                updated_at: new Date().toISOString()
              } 
            : task
        )
      );
      
      toast.success(`Task marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      setIsLoading(true);
      await taskService.deleteTask(taskId);
      
      // Remove the task from the local state
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    } finally {
      setIsLoading(false);
    }
  };

  // Get priority badge color
  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };
  
  // Handle priority change
  const handlePriorityChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      priority: value as 'low' | 'medium' | 'high'
    }));
  };
  
  // Handle date selection
  const handleDateSelect = (date: Date | null) => {
    if (!date) return;
    setDate(date);
    const formattedDate = format(date, 'yyyy-MM-dd');
    setFormData(prev => ({
      ...prev,
      dueDate: formattedDate,
      due_date: formattedDate // For API compatibility
    }));
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date';
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Update task status
  const toggleTaskCompletion = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      
      const newStatus = task.status === 'completed' ? 'todo' : 'completed';
      await taskService.updateTask(taskId, { status: newStatus });
      
      setTasks(tasks.map(t => 
        t.id === taskId 
          ? formatTaskForDisplay({ ...t, status: newStatus })
          : t
      ));
      
      toast.success(`Task marked as ${newStatus}`);
    } catch (err) {
      console.error('Error updating task status:', err);
      toast.error('Failed to update task status');
    }
  };

  // Delete a task
  const deleteTask = async (taskId: string) => {
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

  // Get priority badge
  const getPriorityBadge = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-500">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-500">Medium</Badge>;
      case 'low':
        return <Badge className="bg-blue-500">Low</Badge>;
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Task Management</CardTitle>
        {canManageTasks && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter task description"
                    value={formData.description}
                    onChange={handleInputChange}
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
                        <DatePicker
                          selected={date}
                          onChange={handleDateSelect}
                          minDate={new Date()}
                          className="form-input w-full"
                          placeholderText="Select due date"
                          dateFormat="yyyy-MM-dd"
                          showTimeSelect={false}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select 
                      value={formData.priority}
                      onValueChange={(value) => handleSelectChange('priority', value)}
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
                    onValueChange={(value) => handleSelectChange('assignedTo', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select staff or trainer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Unassigned</SelectItem>
                      {staffMembers.map(staff => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={isLoading || !formData.title.trim()}
                >
                  {isLoading ? 'Creating...' : 'Create Task'}
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
                          <div className="text-sm text-gray-500">
                            {task.description}
                          </div>
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
