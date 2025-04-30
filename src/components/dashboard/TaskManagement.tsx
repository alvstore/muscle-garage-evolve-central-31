
import { useState, useEffect } from 'react';
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
import { Calendar as CalendarIcon, ChevronRight, Plus, Trash2, CheckSquare, ListTodo, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { usePermissions } from "@/hooks/use-permissions";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useBranch } from "@/hooks/use-branch";

interface Task {
  id: string;
  title: string;
  description?: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  assigned_to?: string;
  assignee_name?: string;
  assignee_avatar?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  branch_id?: string;
}

interface TaskFormData {
  title: string;
  description: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  assigned_to: string;
}

interface User {
  id: string;
  name: string;
  avatar?: string;
}

const TaskManagement = () => {
  const { user } = useAuth();
  const { userRole, can } = usePermissions();
  const { currentBranch } = useBranch();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    due_date: format(new Date(), 'yyyy-MM-dd'),
    priority: 'medium',
    assigned_to: '',
  });
  const [date, setDate] = useState<Date>();
  const [staffAndTrainers, setStaffAndTrainers] = useState<User[]>([]);
  
  const canManageTasks = can('assign_plan') || userRole === 'admin' || userRole === 'staff';
  
  // Fetch staff and trainers
  useEffect(() => {
    const fetchStaffAndTrainers = async () => {
      try {
        let query = supabase
          .from('profiles')
          .select('id, full_name, avatar_url, role')
          .in('role', ['staff', 'trainer', 'admin']);
        
        if (currentBranch?.id) {
          // If branch filter is applicable
          query = query.eq('branch_id', currentBranch.id);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        if (data) {
          const mappedUsers: User[] = data.map(person => ({
            id: person.id,
            name: person.full_name || 'Unnamed User',
            avatar: person.avatar_url
          }));
          
          setStaffAndTrainers(mappedUsers);
        }
      } catch (error) {
        console.error('Error fetching staff and trainers:', error);
        toast.error('Failed to load staff and trainers');
      }
    };
    
    fetchStaffAndTrainers();
  }, [currentBranch?.id]);
  
  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      
      try {
        let query = supabase
          .from('tasks')
          .select(`
            *,
            assignee:assigned_to (full_name, avatar_url),
            creator:created_by (full_name)
          `)
          .order('due_date', { ascending: true });
          
        if (currentBranch?.id) {
          query = query.eq('branch_id', currentBranch.id);
        }
        
        // If not admin, only fetch tasks assigned to the user or created by the user
        if (userRole !== 'admin') {
          query = query.or(`assigned_to.eq.${user?.id},created_by.eq.${user?.id}`);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        if (data) {
          const mappedTasks: Task[] = data.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
            due_date: task.due_date,
            priority: task.priority as 'low' | 'medium' | 'high',
            assigned_to: task.assigned_to,
            assignee_name: task.assignee?.full_name,
            assignee_avatar: task.assignee?.avatar_url,
            completed: task.completed,
            created_at: task.created_at,
            updated_at: task.updated_at,
            created_by: task.created_by
          }));
          
          setTasks(mappedTasks);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchTasks();
    }
  }, [user, userRole, currentBranch?.id]);
  
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
        due_date: format(selectedDate, 'yyyy-MM-dd')
      }));
    }
  };
  
  const handleCreateTask = async () => {
    // Validate form
    if (!formData.title.trim()) {
      toast.error("Task title is required");
      return;
    }
    
    if (!formData.due_date) {
      toast.error("Due date is required");
      return;
    }
    
    try {
      // Create task data for Supabase
      const taskData = {
        title: formData.title,
        description: formData.description,
        due_date: formData.due_date,
        priority: formData.priority,
        assigned_to: formData.assigned_to || null,
        completed: false,
        created_by: user?.id,
        branch_id: currentBranch?.id
      };
      
      // Insert task into Supabase
      const { data, error } = await supabase
        .from('tasks')
        .insert(taskData)
        .select(`
          *,
          assignee:assigned_to (full_name, avatar_url)
        `);
      
      if (error) {
        throw error;
      }
      
      if (data && data[0]) {
        // Add new task to state
        const newTask: Task = {
          id: data[0].id,
          title: data[0].title,
          description: data[0].description,
          due_date: data[0].due_date,
          priority: data[0].priority,
          assigned_to: data[0].assigned_to,
          assignee_name: data[0].assignee?.full_name,
          assignee_avatar: data[0].assignee?.avatar_url,
          completed: data[0].completed,
          created_at: data[0].created_at,
          updated_at: data[0].updated_at,
          created_by: data[0].created_by
        };
        
        setTasks(prev => [newTask, ...prev]);
        
        // Reset form and close dialog
        setFormData({
          title: '',
          description: '',
          due_date: format(new Date(), 'yyyy-MM-dd'),
          priority: 'medium',
          assigned_to: '',
        });
        setDialogOpen(false);
        
        toast.success("Task created successfully");
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  };
  
  const toggleTaskCompletion = async (taskId: string, currentStatus: boolean) => {
    try {
      // Update task in Supabase
      const { error } = await supabase
        .from('tasks')
        .update({ 
          completed: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setTasks(prev => 
        prev.map(task => {
          if (task.id === taskId) {
            return {
              ...task,
              completed: !task.completed,
              updated_at: new Date().toISOString()
            };
          }
          return task;
        })
      );
      
      toast.success(`Task ${!currentStatus ? 'completed' : 'marked as incomplete'}`);
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };
  
  const deleteTask = async (taskId: string) => {
    try {
      // Delete task from Supabase
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success("Task deleted");
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
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
  
  const getInitials = (name: string = '') => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  const dueSoonTasks = tasks.filter(task => 
    !task.completed && 
    new Date(task.due_date) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
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
  
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Task Management</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
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
                          {formData.due_date ? format(new Date(formData.due_date), 'PPP') : "Select date"}
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
                    value={formData.assigned_to}
                    onValueChange={(value) => handleFormChange('assigned_to', value)}
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
                      onCheckedChange={() => toggleTaskCompletion(task.id, task.completed)}
                      className="mr-2"
                    />
                    <Label 
                      htmlFor={`due-soon-${task.id}`}
                      className={`text-sm ${task.completed ? 'line-through opacity-70' : ''}`}
                    >
                      {task.title}
                    </Label>
                  </div>
                  <span className="text-xs">{format(new Date(task.due_date), 'MMM d')}</span>
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
                    className={`border rounded-lg p-4 ${
                      task.completed 
                        ? 'bg-gray-50 border-gray-200 dark:bg-gray-900/50 dark:border-gray-800' 
                        : 'bg-white border-gray-200 dark:bg-gray-950 dark:border-gray-800'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <Checkbox 
                          id={`task-${task.id}`}
                          checked={task.completed}
                          onCheckedChange={() => toggleTaskCompletion(task.id, task.completed)}
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
                            <p className={`text-sm text-gray-500 mt-1 ${task.completed ? 'line-through opacity-70' : ''}`}>
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-xs text-gray-500">
                              Due: {format(new Date(task.due_date), 'MMM d, yyyy')}
                            </span>
                            {getPriorityBadge(task.priority)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        {task.assigned_to && (
                          <div className="mr-4">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={task.assignee_avatar || ''} />
                              <AvatarFallback className="text-xs">
                                {getInitials(task.assignee_name)}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        )}
                        {(canManageTasks || task.created_by === user?.id) && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteTask(task.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <ListTodo className="h-10 w-10 mx-auto text-gray-400" />
                  <p className="mt-2">No {filter} tasks found</p>
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
